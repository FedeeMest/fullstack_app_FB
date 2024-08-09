import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AlumnosComponent } from './components/alumnos/alumnos.component';

export const routes: Routes = [
    {path: " ", component: AppComponent},
    {path: "alumnos", component: AlumnosComponent}
];
