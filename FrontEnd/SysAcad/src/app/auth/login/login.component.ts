import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service.service'; // Ajusta la ruta según tu estructura de proyecto
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  private jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.usuario, this.password).subscribe(
      (response) => {
        localStorage.setItem('token', response.token); // Almacenar el token en el almacenamiento local
        const decodedToken = this.jwtHelper.decodeToken(response.token);
        const userRole = decodedToken.rol;
        if (userRole === 'admin') {
          this.router.navigate(['/admin/alumnos']); // Redirigir al componente de administrador
        } else if (userRole === 'alumno') {
          this.router.navigate(['/informacion']); // Redirigir al componente de alumno
        } else {
          this.router.navigate(['/']); // Redirigir a la página principal o a la ruta deseada
        }
      },
      (error) => {
        console.error('Error logging in:', error);
        alert('Credenciales incorrectas');
      }
    );
  }
}