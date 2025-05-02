import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Módulos para formularios reactivos y validaciones
import { ActivatedRoute } from '@angular/router'; // Servicio para obtener parámetros de la ruta
import { Router } from '@angular/router'; // Servicio para redirigir a otras rutas
import { ToastrService } from 'ngx-toastr'; // Servicio para mostrar notificaciones
import { Location } from '@angular/common'; // Servicio para manejar la navegación hacia atrás
import { AdminService } from '../../../../services/admin.service.js'; // Servicio para interactuar con la API de administradores
import { Admin } from '../../../../interfaces/admin.js'; // Interfaz para el modelo de administrador

@Component({
  selector: 'app-add-update-admin', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [ReactiveFormsModule, CommonModule], // Módulos necesarios para el componente
  templateUrl: './add-update-admin.component.html', // Ruta al archivo HTML del componente
  styleUrl: './add-update-admin.component.css' // Ruta al archivo CSS del componente
})
export class AddUpdateAdminComponent implements OnInit {
  form: FormGroup; // Formulario reactivo para manejar los datos del administrador
  id: number; // ID del administrador (si se está editando)
  operacion: string = 'Agregar '; // Define si la operación es "Agregar" o "Editar"
  errorMessage: string = ''; // Mensaje de error para mostrar al usuario

  constructor(
    private fb: FormBuilder, // Constructor de formularios reactivos
    private adminService: AdminService, // Servicio para interactuar con la API
    private router: Router, // Servicio para redirigir
    private aRouter: ActivatedRoute, // Servicio para obtener parámetros de la ruta
    private location: Location, // Servicio para manejar la navegación hacia atrás
    private toastr: ToastrService // Servicio para mostrar notificaciones
  ) {
    // Inicializar el formulario con validaciones
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      mail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) // Validación para correos electrónicos
        ]
      ],
      direccion: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z\s]+\s\d+$/) // Validación para direcciones (ejemplo: "Calle 123")
        ]
      ],
      fecha_n: ['', Validators.required], // Fecha de nacimiento
      usuario: ['', Validators.required], // Usuario
      password: ['', Validators.required] // Contraseña
    });

    // Obtener el ID del administrador desde los parámetros de la ruta
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    // Si el ID es distinto de 0, se está editando un administrador
    if (this.id !== 0) {
      this.operacion = 'Editar '; // Cambiar la operación a "Editar"
      this.getAdmin(this.id); // Obtener los datos del administrador
    }
  }

  // Método para obtener los datos de un administrador por su ID
  getAdmin(id: number): void {
    this.adminService.getAdmin(id).subscribe((data: Admin) => {
      const fechaFormateada = new Date(data.fecha_n).toISOString().split('T')[0]; // Formatear la fecha
      console.log(data);
      this.form.setValue({
        nombre: data.nombre,
        apellido: data.apellido,
        mail: data.mail,
        direccion: data.direccion,
        fecha_n: fechaFormateada,
        usuario: data.usuario,
        password: data.password
      });
    });
  }

  // Método para agregar o actualizar un administrador
  addAdmin(): void {
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
      // Si el ID es distinto de 0, se está actualizando un administrador
      admin.id = this.id;
      this.adminService.updateAdmin(this.id, admin).subscribe({
        next: (response: any) => {
          console.log('Admin actualizado', response.data);
          this.errorMessage = '';
          sessionStorage.setItem('admin', JSON.stringify(response.data)); // Guardar los datos actualizados en el almacenamiento 
          this.toastr.success(
            `El admin ${admin.apellido} ${admin.nombre} fue actualizado con éxito`,
            'Admin Actualizado',
            {
              progressBar: true,
              progressAnimation: 'decreasing'
            }
          );
          this.volver(); // Volver a la página anterior
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error desconocido'; // Mostrar mensaje de error
          console.error('Error al actualizar el admin:', error);
        }
      });
    } else {
      // Si el ID es 0, se está creando un nuevo administrador
      this.adminService.saveAdmin(admin).subscribe({
        next: (response: any) => {
          console.log('Admin creado', response.data);
          this.errorMessage = '';
          this.toastr.success(
            `El admin ${admin.apellido} ${admin.nombre} fue creado con éxito`,
            'Admin Creado',
            {
              progressBar: true,
              progressAnimation: 'decreasing'
            }
          );
          this.router.navigate(['/admin/admins']); // Redirigir a la lista de administradores
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error desconocido'; // Mostrar mensaje de error
          console.error('Error al crear el admin:', error);
        }
      });
    }
  }

  // Método para volver a la página anterior
  volver(): void {
    this.location.back();
  }
}