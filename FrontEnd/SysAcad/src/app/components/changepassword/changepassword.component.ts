import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css'
})
export class ChangepasswordComponent {
  form: FormGroup;
  id: number; // ID del alumno
  role: string | null = null; // Rol del usuario

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private location: Location,
    private route: ActivatedRoute
  ) {
    // Obtener el rol del usuario
    this.role = this.authService.getRole();

    // Crear el formulario dinámicamente según el rol
    this.form = this.fb.group({
      ...(this.role === 'alumno' && { currentPassword: ['', Validators.required] }), // Contraseña actual requerida solo para alumnos
      newPassword: ['', [Validators.required, Validators.minLength(6)]], // Nueva contraseña requerida y con mínimo 6 caracteres
      confirmPassword: ['', Validators.required] // Confirmación de contraseña requerida
    });

    // Obtener el ID del alumno desde la URL
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  // Método para cambiar la contraseña
  changePassword(): void {
    const { currentPassword, newPassword, confirmPassword } = this.form.value;

    if (newPassword !== confirmPassword) {
      this.toastr.error('La nueva contraseña y su confirmación no coinciden.', 'Error');
      return;
    }

    // Llamar al servicio con el ID del alumno
    this.authService.changePassword(this.id, currentPassword || '', newPassword).subscribe({
      next: () => {
        this.toastr.success('Contraseña actualizada con éxito.', 'Éxito');
        this.form.reset();
        this.location.back(); // Navegar hacia atrás en el historial del navegador
      },
      error: (error) => {
        this.toastr.error(error.error.message || 'Error al cambiar la contraseña.', 'Error');
        console.error('Error al cambiar la contraseña:', error);
      }
    });
  }

  cancel(): void {
    this.location.back(); // Navegar hacia atrás en el historial del navegador
  }
}