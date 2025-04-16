import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Alumno } from '../../../interfaces/alumno';
import { AlumnosService } from '../../../services/alumnos.service';
import { JwtHelperService} from '@auth0/angular-jwt';

@Component({
  selector: 'app-informacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent implements OnInit {
    alumno: Alumno| null = null;
    private jwtHelper = new JwtHelperService();

    constructor(private activatedroute:ActivatedRoute, private router: Router,private location: Location,private alumnosService: AlumnosService) {}

    ngOnInit(): void {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No se encontró el token');
        this.router.navigate(['/login']);
        return;
      }
      const decodedToken = this.jwtHelper.decodeToken(token);
      const tokenAlumnoId = decodedToken.id; // ID del alumno en el token

   this.activatedroute.params.subscribe((params) => {
        const routeAlumnoId = +params['id']; // ID del alumno en la ruta

        // Verificar si el ID del token coincide con el ID de la ruta
        if (tokenAlumnoId !== routeAlumnoId) {
          console.error('Acceso denegado: El ID del token no coincide con el ID de la ruta');
          this.router.navigate(['/informacion/' + tokenAlumnoId]); // Redirigir a la página principal o de error
          return;
        }

        // Si los IDs coinciden, cargar la información del alumno
        this.alumnosService.getAlumno(routeAlumnoId).subscribe({
          next: (alumno) => {
            this.alumno = alumno;
          },
          error: (err) => {
            console.error('Error al obtener los datos del alumno:', err);
            this.goBack();
          },
        });
      });
  }

  verInscripciones(id: number | undefined) {
    if (id !== undefined) {
      this.router.navigate(['/lista_insc', id]);
    } else {
      console.error('No se pudo obtener el ID del alumno');
    }
  }

  goBack() {
    this.location.back();
  }
}