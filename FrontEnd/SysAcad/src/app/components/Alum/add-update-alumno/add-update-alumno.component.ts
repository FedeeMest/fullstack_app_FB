import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Alumno } from '../../../interfaces/alumno';
import { AlumnosService } from '../../../services/alumnos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-update-alumno',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-update-alumno.component.html',
  styleUrl: './add-update-alumno.component.css'
})
export class AddUpdateAlumnoComponent implements OnInit {
  form: FormGroup
  id: number;
  operacion: string = 'Agregar ';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private alumnosService: AlumnosService, private router: Router, private aRouter: ActivatedRoute,private location: Location,private toastr: ToastrService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['',Validators.required],
      mail: ['',Validators.required],
      direccion: ['',Validators.required],
      fecha_n: ['',Validators.required],
      plan: ['',Validators.required]
    })
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
    
   }

  ngOnInit(): void {
    if(this.id !== 0){
      this.operacion = 'Editar '
      this.getAlumno(this.id);
    }

  }

  getAlumno(id: number){
    this.alumnosService.getAlumno(id).subscribe((data: Alumno) => {
      const fechaFormateada = new Date(data.fecha_n).toISOString().split('T')[0];
      console.log(data);
      this.form.setValue({
        nombre: data.nombre,
        apellido: data.apellido,
        mail: data.mail,
        direccion: data.direccion,
        fecha_n: fechaFormateada,
        plan: data.plan
      })
    })
  }

  addAlumno() {
    const alumno: Alumno = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      mail: this.form.value.mail,
      direccion: this.form.value.direccion,
      fecha_n: this.form.value.fecha_n,
      plan: this.form.value.plan
    };
  
    if (this.id !== 0) {
      alumno.id = this.id;
      this.alumnosService.updateAlumno(this.id, alumno).subscribe({
        next: (response: any) => {
          console.log('Alumno actualizado', response.data);
          this.errorMessage = '';
          localStorage.setItem('alumno', JSON.stringify(response.data));
          this.toastr.success(`El alumno ${alumno.apellido} ${alumno.nombre} fue actualizado con éxito`, 'Alumno Actualizado',{
            progressBar: true,
            progressAnimation:'decreasing'
          });
          this.volver();
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error desconocido';
          console.error('Error al actualizar el alumno:', error);
        }
      });
    } else {
      this.alumnosService.saveAlumno(alumno).subscribe({
        next: (response: any) => {
          console.log('Alumno creado', response.data);
          this.errorMessage = '';
          this.toastr.success(`El alumno ${alumno.apellido} ${alumno.nombre} fue creado con éxito`, 'Alumno Creado',{
            progressBar: true,
            progressAnimation:'decreasing'
          });
          this.router.navigate(['/alumnos']);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error desconocido';
          console.error('Error al crear el alumno:', error);
        }
      });
    }
  }

  volver() {
    this.location.back();
  }
  


}
