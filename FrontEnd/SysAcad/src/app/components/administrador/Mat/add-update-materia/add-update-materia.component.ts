import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MateriaService } from '../../../../services/materia.service';
import { Materia } from '../../../../interfaces/materia';

@Component({
  selector: 'app-add-update-materia',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-update-materia.component.html',
  styleUrl: './add-update-materia.component.css'
})
export class AddUpdateMateriaComponent implements OnInit {
  form: FormGroup
  id: number;
  operacion: string = 'Agregar ';

  constructor(private fb: FormBuilder, private materiasService: MateriaService, private router: Router, private aRouter: ActivatedRoute,private toastr: ToastrService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      horas_anuales: [0,Validators.required],
      modalidad: ['',Validators.required],
    })
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
    const materia: Materia = {
      nombre: this.form.value.nombre,
      horas_anuales: this.form.value.horas_anuales,
      modalidad: this.form.value.modalidad,
    };

    if(this.id !== 0){
      materia.id = this.id;
      this.materiasService.updateMateria(this.id, materia).subscribe({
        next:(response: any) => {
          console.log('Materia actualizada');
          this.toastr.success(`La materia ${materia.nombre} fue actualizada con éxito`, 'Materia Actualizada',{
            progressBar: true,
            progressAnimation:'decreasing'
          });
          this.router.navigate(['/materias']);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.materiasService.saveMateria(materia).subscribe({
        next:(response: any) => {
          console.log('Materia creada');
          this.toastr.success(`La materia ${materia.nombre} fue creada con éxito`, 'Materia Creada',{
            progressBar: true,
            progressAnimation:'decreasing'
          });
          this.router.navigate(['/materias']);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
  }
}

  /* addMateria() {
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
  } */

  private handleError(error: any) {
    console.error('Detalles del error:', error);
    let errorMessage = 'Ocurrió un error al procesar la solicitud.';

    if (error instanceof Error) {
      errorMessage = error.message; 
    }

    this.showErrorMessage(errorMessage); 
  }

  private showErrorMessage(message: string) {
    this.form.setErrors({ serverError: message }); 
  }

  volver() {
    this.router.navigate(['/materias']);
  }
}
