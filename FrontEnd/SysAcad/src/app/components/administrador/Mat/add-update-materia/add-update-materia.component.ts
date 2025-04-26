import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Formularios reactivos y validaciones
import { ActivatedRoute, Router } from '@angular/router'; // Servicios para obtener parámetros de la ruta y redirigir
import { CommonModule } from '@angular/common'; // Módulos comunes de Angular
import { ToastrService } from 'ngx-toastr'; // Servicio para mostrar notificaciones
import { MateriaService } from '../../../../services/materia.service'; // Servicio para interactuar con la API de materias
import { Materia } from '../../../../interfaces/materia'; // Interfaz para el modelo de Materia

@Component({
  selector: 'app-add-update-materia', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [ReactiveFormsModule, CommonModule], // Módulos necesarios para el componente
  templateUrl: './add-update-materia.component.html', // Ruta al archivo HTML del componente
  styleUrl: './add-update-materia.component.css' // Ruta al archivo CSS del componente
})
export class AddUpdateMateriaComponent implements OnInit {
  form: FormGroup; // Formulario reactivo para manejar los datos de la materia
  id: number; // ID de la materia (si se está editando)
  operacion: string = 'Agregar '; // Define si la operación es "Agregar" o "Editar"

  constructor(
    private fb: FormBuilder, // Constructor de formularios reactivos
    private materiasService: MateriaService, // Servicio para interactuar con la API
    private router: Router, // Servicio para redirigir
    private aRouter: ActivatedRoute, // Servicio para obtener parámetros de la ruta
    private toastr: ToastrService // Servicio para mostrar notificaciones
  ) {
    // Inicializar el formulario con validaciones
    this.form = this.fb.group({
      nombre: ['', Validators.required], // Campo obligatorio para el nombre
      horas_anuales: [0, Validators.required], // Campo obligatorio para las horas anuales
      modalidad: ['', Validators.required] // Campo obligatorio para la modalidad
    });

    // Obtener el ID de la materia desde los parámetros de la ruta
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    // Si el ID es distinto de 0, se está editando una materia
    if (this.id !== 0) {
      this.operacion = 'Editar'; // Cambiar la operación a "Editar"
      this.getMateria(this.id); // Obtener los datos de la materia
    }
  }

  // Método para obtener los datos de una materia por su ID
  getMateria(id: number): void {
    this.materiasService.getMateria(id).subscribe(
      (data: Materia) => {
        console.log(data);
        this.form.setValue({
          nombre: data.nombre,
          horas_anuales: data.horas_anuales,
          modalidad: data.modalidad
        });
      },
      (error) => {
        console.error('Error al obtener la materia:', error);
        this.showErrorMessage('No se pudo obtener la materia. Intente nuevamente.');
      }
    );
  }

  // Método para agregar o actualizar una materia
  addMateria(): void {
    const materia: Materia = {
      nombre: this.form.value.nombre,
      horas_anuales: this.form.value.horas_anuales,
      modalidad: this.form.value.modalidad
    };

    if (this.id !== 0) {
      // Si el ID es distinto de 0, se está actualizando una materia
      materia.id = this.id;
      this.materiasService.updateMateria(this.id, materia).subscribe({
        next: (response: any) => {
          console.log('Materia actualizada');
          this.toastr.success(
            `La materia ${materia.nombre} fue actualizada con éxito`,
            'Materia Actualizada',
            {
              progressBar: true,
              progressAnimation: 'decreasing'
            }
          );
          this.router.navigate(['/materias']); // Redirigir a la lista de materias
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      // Si el ID es 0, se está creando una nueva materia
      this.materiasService.saveMateria(materia).subscribe({
        next: (response: any) => {
          console.log('Materia creada');
          this.toastr.success(
            `La materia ${materia.nombre} fue creada con éxito`,
            'Materia Creada',
            {
              progressBar: true,
              progressAnimation: 'decreasing'
            }
          );
          this.router.navigate(['/materias']); // Redirigir a la lista de materias
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  // Método para manejar errores
  private handleError(error: any): void {
    console.error('Detalles del error:', error);
    let errorMessage = 'Ocurrió un error al procesar la solicitud.';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    this.showErrorMessage(errorMessage);
  }

  // Método para mostrar mensajes de error en el formulario
  private showErrorMessage(message: string): void {
    this.form.setErrors({ serverError: message });
  }

  // Método para volver a la página anterior
  volver(): void {
    this.router.navigate(['/admin/materias']);
  }
}