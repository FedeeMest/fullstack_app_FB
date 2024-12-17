import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service.service'; // Ajusta la ruta según tu estructura de proyecto
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.usuario, this.password).subscribe(
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