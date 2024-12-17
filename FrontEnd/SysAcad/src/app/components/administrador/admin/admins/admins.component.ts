import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../services/admin.service.js';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Admin } from '../../../../interfaces/admin.js';
import { CommonModule, NgFor } from '@angular/common';
import { AdminbarComponent } from '../../../adminbar/adminbar.component.js';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule, ReactiveFormsModule, AdminbarComponent],
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.css'
})
export class AdminsComponent implements OnInit {

  listaAdmins: Admin[] = [];

  constructor(private adminservice: AdminService, private fb: FormBuilder, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAdmins();
  }

  getAdmins(): void {
    this.adminservice.getAdmins().subscribe({
      next: (response) => {
        this.listaAdmins = response ?? [];
      },
      error: (err) => {
        console.error('Error fetching data', err);
      },
    });
  }

  verAdmin(admin: Admin): void {
    const adminId = admin.id;
    this.toastr.info('Mostrando la informacion del admin seleccionado', 'Admin Seleccionado',{
      progressBar: true,
      progressAnimation:'decreasing'
    })
    this.router.navigate(['/admin/resultado', adminId]);

  }

  deleteAdmin(id: number): void {
      if (confirm('¿Está seguro que desea eliminar este admin?')) {
     this.adminservice.deleteAdmin(id).subscribe({
        next: (response) => {
          this.toastr.success('Admin eliminado correctamente', 'Admin Eliminado',{
           progressBar: true,
            progressAnimation:'decreasing'
         })  
          this.getAdmins();
        },
       error: (err) => {
         console.error('Error deleting data', err);
        },
      });
   }
  }

  goAdd(): void {
    this.router.navigate(['/admin/add_admin']);
  }


}
