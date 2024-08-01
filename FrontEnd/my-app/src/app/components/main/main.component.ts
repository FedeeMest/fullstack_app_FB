import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ListaalumnosComponent } from '../dashboard/alumnos/listaalumnos/listaalumnos.component';
import { AlumnosComponent } from '../dashboard/alumnos/alumnos.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    ListaalumnosComponent,

  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {

}
