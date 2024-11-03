import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MateriaService } from '../../../services/materia.service.js';
import { ActivatedRoute, Router } from '@angular/router';
import { Materia } from '../../../interfaces/materia.js';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-add-update-materia',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-update-materia.component.html',
  styleUrls: ['./add-update-materia.component.css'],
})
export class AddUpdateMateriaComponent implements OnInit {
  form: FormGroup;
  id: number;
  operacion: string = 'Agregar';

  constructor(
    private fb: FormBuilder,
    private materiasService: MateriaService,
    private router: Router,
    private aRouter: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      horas_anuales: [0, Validators.required],
      modalidad: ['', Validators.required],
    });
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.id !== 0) {
      this.operacion = 'Editar';
      this.getMateria(this.id);
    }
  }

  getMateria(id: number) {
    this.materiasService.getMateria(id).subscribe(
      (data: Materia) => {
        console.log(data);
        this.form.setValue({
          nombre: data.nombre,
          horas_anuales: data.horas_anuales,
          modalidad: data.modalidad,
        });
      },
      (error) => {
        console.error('Error al obtener la materia:', error);
        this.showErrorMessage('No se pudo obtener la materia. Intente nuevamente.');
      }
    );
  }

  addMateria() {
    console.log(this.form.value);
    const materia: Materia = {
      nombre: this.form.value.nombre,
      horas_anuales: this.form.value.horas_anuales,
      modalidad: this.form.value.modalidad,
    };

    const materiaRequest = this.id !== 0 
      ? this.materiasService.updateMateria(this.id, materia) 
      : this.materiasService.saveMateria(materia);

    materiaRequest.pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(() => error); // Re-lanzar el error si es necesario
      })
    ).subscribe({
      next: () => {
        console.log(this.id !== 0 ? 'Materia actualizada' : 'Materia creada');
        this.router.navigate(['/materias']);
      },
    });
  }

  private handleError(error: any) {
    console.error('Detalles del error:', error);
    let errorMessage = 'Ocurrió un error al procesar la solicitud.';

    if (error instanceof Error) {
      errorMessage = error.message; // Usar el mensaje del error lanzado
    }

    this.showErrorMessage(errorMessage); // Muestra el mensaje de error al usuario
  }

  private showErrorMessage(message: string) {
    this.form.setErrors({ serverError: message }); // Asignar el mensaje de error al formulario
  }
}
