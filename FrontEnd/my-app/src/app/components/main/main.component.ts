import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AlumnosComponent } from '../dashboard/alumnos/alumnos.component';
import { AlumnoService } from '../../service/service.service';




@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    AlumnosComponent
  ],
  providers: [AlumnoService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {

}
