import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service.service'; // Servicio para manejar la autenticación
import { Router } from '@angular/router'; // Servicio para redirigir a otras rutas
import { FormsModule } from '@angular/forms'; // Módulo para manejar formularios
import { JwtHelperService } from '@auth0/angular-jwt'; // Servicio para decodificar tokens JWT
import { CommonModule } from '@angular/common'; // Módulo común de Angular

@Component({
  selector: 'app-login', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [FormsModule, CommonModule], // Módulos necesarios para el componente
  templateUrl: './login.component.html', // Ruta al archivo HTML del componente
  styleUrls: ['./login.component.css'] // Ruta al archivo CSS del componente
})
export class LoginComponent {
  usuario: string = ''; // Variable para almacenar el usuario ingresado
  password: string = ''; // Variable para almacenar la contraseña ingresada
  showPassword: boolean = false; // Variable para controlar la visibilidad de la contraseña
  private jwtHelper = new JwtHelperService(); // Instancia del servicio para manejar tokens JWT

  constructor(private authService: AuthService, private router: Router) {}

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Método para manejar el inicio de sesión
  login() {
    // Llamar al servicio de autenticación con las credenciales ingresadas
    this.authService.login(this.usuario, this.password).subscribe(
      (response) => {
        // Almacenar el token JWT en el almacenamiento local
        localStorage.setItem('token', response.token);

        // Notificar al servicio que el usuario inició sesión
        this.authService.notifyLogin();

        // Decodificar el token JWT para obtener información del usuario
        const decodedToken = this.jwtHelper.decodeToken(response.token);
        const userRole = decodedToken.rol; // Obtener el rol del usuario

        // Redirigir según el rol del usuario
      
        this.router.navigate(['']); // Redirigir a la página principal
  
      },
      (error) => {
        // Manejar errores en el inicio de sesión
        console.error('Error logging in:', error);
        alert('Credenciales incorrectas'); // Mostrar un mensaje de error al usuario
      }
    );
  }
}