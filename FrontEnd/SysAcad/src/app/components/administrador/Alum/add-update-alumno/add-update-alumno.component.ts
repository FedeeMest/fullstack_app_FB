import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Formularios reactivos y validaciones
import { Alumno } from '../../../../interfaces/alumno'; // Interfaz para el modelo de Alumno
import { AlumnosService } from '../../../../services/alumnos.service'; // Servicio para interactuar con la API de alumnos
import { ActivatedRoute, Router } from '@angular/router'; // Servicios para obtener parámetros de la ruta y redirigir
import { CommonModule } from '@angular/common'; // Módulos comunes de Angular
import { Location } from '@angular/common'; // Servicio para manejar la navegación hacia atrás
import { ToastrService } from 'ngx-toastr'; // Servicio para mostrar notificaciones

@Component({
  selector: 'app-add-update-alumno', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [ReactiveFormsModule, CommonModule], // Módulos necesarios para el componente
  templateUrl: './add-update-alumno.component.html', // Ruta al archivo HTML del componente
  styleUrl: './add-update-alumno.component.css' // Ruta al archivo CSS del componente
})
export class AddUpdateAlumnoComponent implements OnInit {
  form: FormGroup; // Formulario reactivo para manejar los datos del alumno
  id: number; // ID del alumno (si se está editando)
  operacion: string = 'Agregar '; // Define si la operación es "Agregar" o "Editar"
  errorMessage: string = ''; // Mensaje de error para mostrar al usuario

  constructor(
    private fb: FormBuilder, // Constructor de formularios reactivos
    private alumnosService: AlumnosService, // Servicio para interactuar con la API
    private router: Router, // Servicio para redirigir
    private aRouter: ActivatedRoute, // Servicio para obtener parámetros de la ruta
    private location: Location, // Servicio para manejar la navegación hacia atrás
    private toastr: ToastrService // Servicio para mostrar notificaciones
  ) {
    // Inicializar el formulario con validaciones
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      mail: ['',[Validators.required,Validators.email,Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      direccion: ['',[Validators.required,Validators.pattern(/^[A-Za-z\s]+\s\d+$/) ]], // Validación para direcciones (ejemplo: "Calle 123")
      fecha_n: ['', Validators.required], // Fecha de nacimiento
      plan: ['', Validators.required], // Plan del alumno
      usuario: ['', Validators.required], // Usuario
      password: ['', Validators.required] // Contraseña
    });

    // Obtener el ID del alumno desde los parámetros de la ruta
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    // Si el ID es distinto de 0, se está editando un alumno
    if (this.id !== 0) {
      this.operacion = 'Editar '; // Cambiar la operación a "Editar"
      this.getAlumno(this.id); // Obtener los datos del alumno
    }
  }
  
  // Método para obtener los datos de un alumno por su ID
  getAlumno(id: number): void {
    this.alumnosService.getAlumno(id).subscribe((data: Alumno) => {
      const fechaFormateada = new Date(data.fecha_n).toISOString().split('T')[0]; // Formatear la fecha
      console.log(data);
      this.form.setValue({
        nombre: data.nombre,
        apellido: data.apellido,
        mail: data.mail,
        direccion: data.direccion,
        fecha_n: fechaFormateada,
        plan: data.plan,
        usuario: data.usuario,
        password: data.password
      });
    });
  }

  // Método para agregar o actualizar un alumno
  addAlumno(): void {
    const alumno: Alumno = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      mail: this.form.value.mail,
      direccion: this.form.value.direccion,
      fecha_n: this.form.value.fecha_n,
      plan: this.form.value.plan,
      usuario: this.form.value.usuario,
      password: this.form.value.password
    };

    if (this.id !== 0) {
      // Si el ID es distinto de 0, se está actualizando un alumno
      alumno.id = this.id;
      this.alumnosService.updateAlumno(this.id, alumno).subscribe({
        next: (response: any) => {
          console.log('Alumno actualizado', response.data);
          this.errorMessage = '';
          sessionStorage.setItem('alumno', JSON.stringify(response.data)); // Guardar los datos actualizados en el almacenamiento
          this.toastr.success(
            `El alumno ${alumno.apellido} ${alumno.nombre} fue actualizado con éxito`,
            'Alumno Actualizado',
            {
              progressBar: true,
              progressAnimation: 'decreasing'
            }
          );
          this.volver(); // Volver a la página anterior
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error desconocido'; // Mostrar mensaje de error
          console.error('Error al actualizar el alumno:', error);
        }
      });
    } else {
      // Si el ID es 0, se está creando un nuevo alumno
      this.alumnosService.saveAlumno(alumno).subscribe({
        next: (response: any) => {
          console.log('Alumno creado', response.data);
          this.errorMessage = '';
          this.toastr.success(
            `El alumno ${alumno.apellido} ${alumno.nombre} fue creado con éxito`,
            'Alumno Creado',
            {
              progressBar: true,
              progressAnimation: 'decreasing'
            }
          );
          this.router.navigate(['/admin/alumnos']); // Redirigir a la lista de alumnos
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error desconocido'; // Mostrar mensaje de error
          console.error('Error al crear el alumno:', error);
        }
      });
    }
  }

  // Método para volver a la página anterior
  volver(): void {
    this.location.back();
  }

   // Método para redirigir al componente de cambio de contraseña
   goToChangePassword(): void {
    this.router.navigate([`/change-password/${this.id}`]); // Pasar el ID del alumno en la ruta
  }
}