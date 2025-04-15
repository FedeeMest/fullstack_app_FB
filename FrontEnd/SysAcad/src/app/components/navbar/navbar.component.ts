import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service.service';
import { CommonModule } from '@angular/common';
import { AlumnosService } from '../../services/alumnos.service';
import { AdminService } from '../../services/admin.service';
import { AuthStateService } from '../../services/auth-state.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isAdmin: boolean = false; // Variable para verificar si el usuario es admin
  nombre: string = ''; // Nombre del usuario
  apellido: string = ''; // Apellido del usuario
  usuario: string = ''; // usuario
  rol: string = ''; // Rol del usuario (admin o alumno)



  constructor(
    private route: Router,
    private authService: AuthService,
    private alumnosService: AlumnosService,
    private adminService: AdminService,
    private authtateService: AuthStateService // Servicio para manejar el estado de autenticación
  ) {}

  ngOnInit(): void {
  // Escuchar cambios en el estado de autenticación
  this.authtateService.authState$.subscribe((isAuthenticated) => {
    if (isAuthenticated) {
      this.checkRole();
      this.loadUserInfo();
    } else {
      this.clearUserInfo();
    }
    
  });

  // Inicializar el estado al cargar el componente
  if (typeof window !== 'undefined' && localStorage.getItem('token')) {
    this.checkRole();
    this.loadUserInfo();
  }
}


  checkRole() {
    const role = this.authService.getRole(); // Recuperar el rol del usuario
    this.isAdmin = role === 'admin'; // Verificar si el rol es admin
    this.rol = role ?? '';
  }

  loadUserInfo() {
    const id = this.authService.getUserId(); // Recuperar el ID del usuario
    if (id === null) {
      console.error('El ID del usuario es null');
      return;
    }

    if (this.isAdmin) {
      this.adminService.getAdmin(id).subscribe(
        (admin) => {
          this.nombre = admin.nombre;
          this.apellido = admin.apellido;
          this.usuario = admin.usuario;
        },
        (error) => {
          console.error('Error al obtener los admins:', error);
        }
      );
    } else {
      this.alumnosService.getAlumno(id).subscribe(
        (alumno) => {
          this.nombre = alumno.nombre;
          this.apellido = alumno.apellido;
          this.usuario = alumno.usuario;
        },
        (error) => {
          console.error('Error al obtener los alumnos:', error);
        }
      );
    }
  }

  clearUserInfo() {
    this.isAdmin = false;
    this.nombre = '';
    this.apellido = '';
    this.rol = '';
  }

  logout() {
    localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
    this.authtateService.setAuthState(false);
    this.route.navigate(['/']); // Redirigir al login
  }

  goHome() {
    this.route.navigate(['/inicio']);
  }

  goBuscar() {
    this.route.navigate(['/admin/buscar']);
  }

  goAlumnos() {
    this.route.navigate(['/admin/alumnos']);
  }

  goMaterias() {
    this.route.navigate(['/admin/materias']);
  }

  goAdmins() {
    this.route.navigate(['/admin/admins']);
  }
}