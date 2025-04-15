import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { AdminService } from '../../../../services/admin.service.js';
import { Admin } from '../../../../interfaces/admin.js';

@Component({
  selector: 'app-add-update-admin',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-update-admin.component.html',
  styleUrl: './add-update-admin.component.css'
})
export class AddUpdateAdminComponent implements OnInit {
  form: FormGroup
  id: number;
  operacion: string = 'Agregar ';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router, private aRouter: ActivatedRoute,private location: Location,private toastr: ToastrService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['',Validators.required],
      mail: ['',[Validators.required, Validators.email, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      direccion: ['',[Validators.required,Validators.required, Validators.pattern(/^[A-Za-z\s]+\s\d+$/)]],
      fecha_n: ['',Validators.required],
      usuario: ['',Validators.required],
      password: ['',Validators.required]
    })
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
    
   }

  ngOnInit(): void {
    if(this.id !== 0){
      this.operacion = 'Editar '
      this.getAdmin(this.id);
    }

  }

  getAdmin(id: number){
    this.adminService.getAdmin(id).subscribe((data: Admin) => {
      const fechaFormateada = new Date(data.fecha_n).toISOString().split('T')[0];
      console.log(data);
      this.form.setValue({
        nombre: data.nombre,
        apellido: data.apellido,
        mail: data.mail,
        direccion: data.direccion,
        fecha_n: fechaFormateada,
        usuario: data.usuario,
        password: data.password
      })
    })
  }

  addAdmin() {
    const admin: Admin = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      mail: this.form.value.mail,
      direccion: this.form.value.direccion,
      fecha_n: this.form.value.fecha_n,
      usuario: this.form.value.usuario,
      password: this.form.value.password
    };
  
    if (this.id !== 0) {
      admin.id = this.id;
      this.adminService.updateAdmin(this.id, admin).subscribe({
        next: (response: any) => {
          console.log('Admin actualizado', response.data);
          this.errorMessage = '';
          localStorage.setItem('admin', JSON.stringify(response.data));
          this.toastr.success(`El admin ${admin.apellido} ${admin.nombre} fue actualizado con éxito`, 'Admin Actualizado',{
            progressBar: true,
            progressAnimation:'decreasing'
          });
          this.volver();
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error desconocido';
          console.error('Error al actualizar el admin:', error);
        }
      });
    } else {
      this.adminService.saveAdmin(admin).subscribe({
        next: (response: any) => {
          console.log('Admin creado', response.data);
          this.errorMessage = '';
          this.toastr.success(`El admin ${admin.apellido} ${admin.nombre} fue creado con éxito`, 'Admin Creado',{
            progressBar: true,
            progressAnimation:'decreasing'
          });
          this.router.navigate(['/admin/admins']);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error desconocido';
          console.error('Error al crear el admins:', error);
        }
      });
    }
  }

  volver() {
    this.location.back();
  }




}
