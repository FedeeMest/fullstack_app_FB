import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario: string = '';
  contraseña: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.usuario, this.contraseña).subscribe(
      (response) => {
        localStorage.setItem('token', response.token); // Almacenar el token en el almacenamiento local
        this.router.navigate(['/']); // Redirigir a la página principal o a la ruta deseada
      },
      (error) => {
        console.error('Error logging in:', error);
        alert('Credenciales incorrectas');
      }
    );
  }
}
