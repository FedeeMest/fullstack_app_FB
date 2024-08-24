import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AlumnosComponent } from './components/alumnos/alumnos.component';
import { AddUpdateAlumnoComponent } from './components/add-update-alumno/add-update-alumno.component';

export const routes: Routes = [
    {path: " ", component: AppComponent},
    {path: "alumnos", component: AlumnosComponent},
    {path: "add_alumno", component: AddUpdateAlumnoComponent}
];
