import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service.service'; // Servicio para manejar la autenticación
import { CommonModule } from '@angular/common';
import { AlumnosService } from '../../services/alumnos.service'; // Servicio para interactuar con la API de alumnos
import { AdminService } from '../../services/admin.service'; // Servicio para interactuar con la API de administradores
import { AuthStateService } from '../../services/auth-state.service'; // Servicio para manejar el estado de autenticación
import { JwtHelperService } from '@auth0/angular-jwt'; // Servicio para decodificar tokens JWT

@Component({
  selector: 'app-navbar', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [CommonModule], // Módulos necesarios para el componente
  templateUrl: './navbar.component.html', // Ruta al archivo HTML del componente
  styleUrl: './navbar.component.css' // Ruta al archivo CSS del componente
})
export class NavbarComponent implements OnInit {
  isAdmin: boolean = false; // Variable para verificar si el usuario es administrador
  isAlumno: boolean = false; // Variable para verificar si el usuario es alumno
  nombre: string = ''; // Nombre del usuario
  apellido: string = ''; // Apellido del usuario
  usuario: string = ''; // Nombre de usuario
  rol: string = ''; // Rol del usuario (admin o alumno)
  private jwtHelper = new JwtHelperService(); // Instancia del servicio para manejar tokens JWT

  constructor(
    private route: Router, // Servicio para manejar la navegación
    private authService: AuthService, // Servicio para manejar la autenticación
    private alumnosService: AlumnosService, // Servicio para interactuar con la API de alumnos
    private adminService: AdminService, // Servicio para interactuar con la API de administradores
    private authtateService: AuthStateService // Servicio para manejar el estado de autenticación
  ) {}

  ngOnInit(): void {
    // Escuchar cambios en el estado de autenticación
    this.authtateService.authState$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.checkRoleAdmin(); // Verificar el rol del usuario
        this.checkRoleAlumno(); // Verificar el rol del usuario
        this.loadUserInfo(); // Cargar la información del usuario
      } else {
        this.clearUserInfo(); // Limpiar la información del usuario si no está autenticado
      }
    });

    // Inicializar el estado al cargar el componente
    if (typeof window !== 'undefined' && sessionStorage.getItem('token')) {
      this.checkRoleAdmin(); // Verificar el rol del usuario
      this.checkRoleAlumno(); // Verificar el rol del usuario
      this.loadUserInfo(); // Cargar la información del usuario
    }

    // Agregar listener para el evento beforeunload
    if (typeof window !== 'undefined') {
      // Agregar listener para el evento beforeunload
      window.addEventListener('beforeunload', () => {
        sessionStorage.removeItem('token'); // Eliminar el token del almacenamiento
      });
    }
  }

  // Método para verificar el rol del usuario
  checkRoleAdmin() {
    const role = this.authService.getRole(); // Recuperar el rol del usuario desde el servicio de autenticación
    this.isAdmin = role === 'admin'; // Verificar si el rol es "admin"
    this.rol = role ?? ''; // Asignar el rol al atributo `rol`
  }

  // Método para verificar el rol del usuario
  checkRoleAlumno() {
    const role = this.authService.getRole(); // Recuperar el rol del usuario desde el servicio de autenticación
    this.isAlumno = role === 'alumno'; // Verificar si el rol es "alumno"
    this.rol = role ?? ''; // Asignar el rol al atributo `rol`
  }
  // Método para cargar la información del usuario
  loadUserInfo() {
    const id = this.authService.getUserId(); // Recuperar el ID del usuario desde el servicio de autenticación
    if (id === null) {
      console.error('El ID del usuario es null'); // Mostrar un error si el ID es null
      return;
    }

    if (this.isAdmin) {
      // Si el usuario es administrador, obtener su información desde la API de administradores
      this.adminService.getAdmin(id).subscribe(
        (admin) => {
          this.nombre = admin.nombre; // Asignar el nombre del administrador
          this.apellido = admin.apellido; // Asignar el apellido del administrador
          this.usuario = admin.usuario; // Asignar el nombre de usuario del administrador
        },
        (error) => {
          console.error('Error al obtener los admins:', error); // Mostrar un error si no se puede obtener la información
        }
      );
    } else {
      // Si el usuario es alumno, obtener su información desde la API de alumnos
      this.alumnosService.getAlumno(id).subscribe(
        (alumno) => {
          this.nombre = alumno.nombre; // Asignar el nombre del alumno
          this.apellido = alumno.apellido; // Asignar el apellido del alumno
          this.usuario = alumno.usuario; // Asignar el nombre de usuario del alumno
        },
        (error) => {
          console.error('Error al obtener los alumnos:', error); // Mostrar un error si no se puede obtener la información
        }
      );
    }
  }

  // Método para limpiar la información del usuario
  clearUserInfo() {
    this.isAdmin = false; // Restablecer la variable `isAdmin` a false
    this.nombre = ''; // Limpiar el nombre del usuario
    this.apellido = ''; // Limpiar el apellido del usuario
    this.rol = ''; // Limpiar el rol del usuario
  }

  // Método para cerrar sesión
  logout() {
    sessionStorage.removeItem('token'); // Eliminar el token del almacenamiento
    this.authtateService.setAuthState(false); // Cambiar el estado de autenticación a false
    this.isAdmin = false; // Restablecer la variable `isAdmin` a false
    this.isAlumno = false; // Restablecer la variable `isAlumno` a false
    this.rol = ''; // Limpiar el rol del usuario
    this.nombre = ''; // Limpiar el nombre del usuario
    this.apellido = ''; // Limpiar el apellido del usuario
    this.route.navigate(['/']); // Redirigir al login
  }

  // Método para navegar a la página de inicio
  goHome() {
    this.route.navigate(['']);
  }

  // Método para navegar a la página de búsqueda
  goBuscar() {
    this.route.navigate(['/admin/buscar']);
  }

  // Método para navegar a la página de alumnos
  goAlumnos() {
    this.route.navigate(['/admin/alumnos']);
  }

  // Método para navegar a la página de materias
  goMaterias() {
    this.route.navigate(['/materias']);
  }

  // Método para navegar a la página de administradores
  goAdmins() {
    this.route.navigate(['/admin/admins']);
  }

  goInfo() {
    const token = sessionStorage.getItem('token'); // Obtener el token del almacenamiento 
    if (!token) {
      console.error('No se encontró el token en sessionStorage'); // Manejar el caso en que no exista el token
      return;
    }
  
    try {
      const decodedToken = this.jwtHelper.decodeToken(token); // Decodificar el token
      const userId = decodedToken?.id; // Obtener el ID del usuario del token decodificado
  
      if (!userId) {
        console.error('El token no contiene un ID válido'); // Manejar el caso en que no exista el ID
        return;
      }
  
      this.route.navigate([`/informacion/${userId}`]); // Redirigir al componente de información del usuario
    } catch (error) {
      console.error('Error al decodificar el token:', error); // Manejar errores al decodificar el token
    }
  }

  goLogin() {
    this.route.navigate(['/login']); // Redirigir a la página de inicio de sesión
  }

}