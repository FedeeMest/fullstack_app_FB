import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../../interfaces/alumno';
import { AlumnosService } from '../../../../services/alumnos.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminbarComponent } from '../../../adminbar/adminbar.component.js';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule, ReactiveFormsModule,AdminbarComponent],
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.css',
})
export class AlumnosComponent implements OnInit {
  listaAlumnos: Alumno[] = [];
  alumnosFiltrados: Alumno[] = [];
  planesDisponibles: string[] = [];
  filtroForm: FormGroup;

  constructor(private _alumnoService: AlumnosService, private fb: FormBuilder, private router: Router, private toastr: ToastrService) {
    this.filtroForm = this.fb.group({
      plan: [''],
    });
  }

  ngOnInit(): void {
    this.getAlumnos();
    this.filtroForm.get('plan')?.valueChanges.subscribe((planSeleccionado) => {
      this.filtrarAlumnos(planSeleccionado);
    });
  }

  getAlumnos(): void {
    this._alumnoService.getAlumnos().subscribe({
      next: (response) => {
        this.listaAlumnos = response ?? [];
        this.alumnosFiltrados = [...this.listaAlumnos];
        this.extraerPlanesDisponibles();
      },
      error: (err) => {
        console.error('Error fetching data', err);
      },
    });
  }

  verAlumno(alumno: Alumno): void {
    const alumnoId = alumno.id;
    this.toastr.info('Mostrando la informacion del alumno seleccionado', 'Alumno Seleccionado',{
      progressBar: true,
      progressAnimation:'decreasing'
    })
    this.router.navigate(['/admin/resultado', alumnoId]);
  }

  extraerPlanesDisponibles(): void {
    const planes = this.listaAlumnos.map((alumno) => alumno.plan);
    this.planesDisponibles = Array.from(new Set(planes.filter(Boolean)));
  }

  filtrarAlumnos(planSeleccionado: string): void {
    if (planSeleccionado) {
      this.alumnosFiltrados = this.listaAlumnos.filter(
        (alumno) => alumno.plan === planSeleccionado
      );
    } else {
      this.alumnosFiltrados = [...this.listaAlumnos];
    }
  }

  deleteAlumno(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este alumno?')) {
      this._alumnoService.deleteAlumno(id).subscribe({
        next: () => {
          console.log('Alumno eliminado');
          this.toastr.error('El alumno fue eliminado con éxito', 'Alumno Eliminado',{
            progressBar: true,
            progressAnimation:'decreasing'
          })
          this.getAlumnos();
        },
        error: (err) => {
          console.error('Error eliminando alumno', err);
        },
      });
    }
  }

  trackByAlumno(index: number, alumno: Alumno): number {
    return alumno.id ?? 0; // Asegúrate de que `id` sea único
  }

  goAdd(): void {
    this.router.navigate(['/admin/add_alumno']);
  }
}