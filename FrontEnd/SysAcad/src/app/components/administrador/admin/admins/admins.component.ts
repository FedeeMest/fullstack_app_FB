import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../services/admin.service.js'; // Servicio para interactuar con la API de administradores
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'; // Módulo para manejar formularios reactivos
import { Router, RouterModule } from '@angular/router'; // Servicio para redirigir a otras rutas
import { ToastrService } from 'ngx-toastr'; // Servicio para mostrar notificaciones
import { Admin } from '../../../../interfaces/admin.js'; // Interfaz para el modelo de administrador
import { CommonModule, NgFor } from '@angular/common'; // Módulos comunes de Angular

@Component({
  selector: 'app-admins', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [NgFor, CommonModule, RouterModule, ReactiveFormsModule], // Módulos necesarios para el componente
  templateUrl: './admins.component.html', // Ruta al archivo HTML del componente
  styleUrl: './admins.component.css' // Ruta al archivo CSS del componente
})
export class AdminsComponent implements OnInit {
  listaAdmins: Admin[] = []; // Lista de administradores obtenidos desde la API

  constructor(
    private adminservice: AdminService, // Servicio para interactuar con la API
    private fb: FormBuilder, // Constructor de formularios reactivos
    private router: Router, // Servicio para redirigir
    private toastr: ToastrService // Servicio para mostrar notificaciones
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.getAdmins(); // Llamar al método para obtener la lista de administradores
  }

  // Método para obtener la lista de administradores desde la API
  getAdmins(): void {
    this.adminservice.getAdmins().subscribe({
      next: (response) => {
        this.listaAdmins = response ?? []; // Asignar la lista de administradores obtenida
      },
      error: (err) => {
        console.error('Error fetching data', err); // Loguear errores en la consola
      },
    });
  }

  // Método para ver la información de un administrador
  verAdmin(admin: Admin): void {
    const adminId = admin.id; // Obtener el ID del administrador seleccionado
    this.toastr.info('Mostrando la información del admin seleccionado', 'Admin Seleccionado', {
      progressBar: true,
      progressAnimation: 'decreasing',
    });
    this.router.navigate(['/admin/resultado', 'admins', adminId]); // Redirigir a la página de detalles del administrador
  }

  // Método para eliminar un administrador
  deleteAdmin(id: number): void {
    if (confirm('¿Está seguro que desea eliminar este admin?')) {
      // Confirmar la eliminación
      this.adminservice.deleteAdmin(id).subscribe({
        next: (response) => {
          // Mostrar notificación de éxito
          this.toastr.success('Admin eliminado correctamente', 'Admin Eliminado', {
            progressBar: true,
            progressAnimation: 'decreasing',
          });
          this.getAdmins(); // Actualizar la lista de administradores
        },
        error: (err) => {
          console.error('Error deleting data', err); // Loguear errores en la consola
        },
      });
    }
  }

  // Método para redirigir al formulario de agregar administrador
  goAdd(): void {
    this.router.navigate(['/admin/add_admin']); // Redirigir al formulario de agregar administrador
  }
}