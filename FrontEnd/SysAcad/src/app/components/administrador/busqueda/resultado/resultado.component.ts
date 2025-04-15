import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../../interfaces/alumno';
import { Admin } from '../../../../interfaces/admin';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { AlumnosService } from '../../../../services/alumnos.service';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit {
  alumno: Alumno| null = null;
  admin: Admin | null = null;
  tabla: string = '';

  constructor(private activatedroute:ActivatedRoute, private router: Router,private location: Location,private alumnosService: AlumnosService, private adminService: AdminService) {}

  ngOnInit(): void {
    // Obtener el ID del usuario desde los parámetros de la ruta
    this.activatedroute.params.subscribe((params) => {
      const tabla = params['tabla'];
      const userId = +params['id'];
      this.tabla = tabla;
      console.log('Tabla:', this.tabla);
      console.log('ID del usuario:', userId);

      if (userId) {
        if (this.tabla === 'admins') {
          // Si se accede a la tabla de Admins
          this.adminService.getAdmin(userId).subscribe({
            next: (admin) => {
              this.admin = admin;
            },
            error: (err) => {
              console.error('Error al obtener los datos del admin:', err);
              this.goBack();
            },
          });
        } else if (this.tabla === 'alumnos') {
          // Si se accede a la tabla de Alumnos
          this.alumnosService.getAlumno(userId).subscribe({
            next: (alumno) => {
              this.alumno = alumno;
            },
            error: (err) => {
              console.error('Error al obtener los datos del alumno:', err);
              this.goBack();
            },
          });
        }
      }
    });
  }

  editarAlumno(id: number | undefined) {
    if (id !== undefined) {
      this.router.navigate(['/admin/editar_alumno', id], { state: { from: 'resultado' } });
    } else {
      console.error('No se pudo obtener el ID del alumno');
    }
  }

  editarAdmin(id: number | undefined) {
  if (id !== undefined) {
    this.router.navigate(['/admin/editar_admin', id], { state: { from: 'resultado' } });
    } else {
      console.error('No se pudo obtener el ID del admin');
    }
  }

  verInscripciones(id: number | undefined) {
    if (id !== undefined) {
      this.router.navigate(['/lista_insc', id]);
    } else {
      console.error('No se pudo obtener el ID del alumno');
    }
  }

  goBack() {
    this.location.back();
  }
}