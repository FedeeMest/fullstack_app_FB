import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-changeadmin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './changeadmin.component.html',
  styleUrl: './changeadmin.component.css'
})
export class ChangeadminComponent {
  form: FormGroup;
  id: number; // ID del administrador

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private toastr: ToastrService,
    private location: Location,
    private route: ActivatedRoute
  ) {
    // Crear el formulario para cambiar la contraseña
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]], // Nueva contraseña requerida y con mínimo 6 caracteres
      confirmPassword: ['', Validators.required] // Confirmación de contraseña requerida
    });

    // Obtener el ID del administrador desde la URL
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  // Método para cambiar la contraseña
  changePassword(): void {
    const { newPassword, confirmPassword } = this.form.value;

    if (newPassword !== confirmPassword) {
      this.toastr.error('La nueva contraseña y su confirmación no coinciden.', 'Error');
      return;
    }

    // Llamar al servicio para cambiar la contraseña del administrador
    this.adminService.changePassword(this.id, newPassword).subscribe({
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