import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../interfaces/alumno';
import { AlumnosService } from '../../../services/alumnos.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.css',
})
export class AlumnosComponent implements OnInit {
  listaAlumnos: Alumno[] = [];
  alumnosFiltrados: Alumno[] = [];
  planesDisponibles: string[] = [];
  filtroForm: FormGroup;

  constructor(
    private _alumnoService: AlumnosService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.filtroForm = this.fb.group({
      plan: [''],
    });
  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
    const storedAlumno = localStorage.getItem('alumno');
    if (storedAlumno) {
      localStorage.removeItem('alumno');
      console.log('Alumno eliminado del localStorage');
      }
    }
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
    localStorage.setItem('alumno', JSON.stringify(alumno));
    this.router.navigate(['/resultado']);
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
          this.getAlumnos();
        },
        error: (err) => {
          console.error('Error eliminando alumno', err);
        },
      });
    }
  }

  goAdd(): void {
    this.router.navigate(['/add_alumno']);
  }
}
