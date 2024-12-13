import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service.service';


@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: any): boolean {
    const userRole = this.authService.getRole(); // Recupera el rol del usuario
    const expectedRoles = route.data['roles'] as Array<string>;

    if (expectedRoles.includes(userRole!)) {
      return true;
    } else {
      this.router.navigate(['/login']); // Redirige si no tiene permisos
      return false;
    }
  }
}