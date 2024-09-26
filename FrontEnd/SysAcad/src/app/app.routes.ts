import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AlumnosComponent } from './components/Alum/alumnos/alumnos.component';
import { AddUpdateAlumnoComponent } from './components/Alum/add-update-alumno/add-update-alumno.component';
import { MateriasComponent } from './components/Mat/materias/materias.component';
import { AddUpdateMateriaComponent } from './components/Mat/add-update-materia/add-update-materia.component';
import { InicioComponent } from './components/inicio/inicio.component';

export const routes: Routes = [
    {path: "", component: InicioComponent},
    {path: "alumnos", component: AlumnosComponent},
    {path: "add_alumno", component: AddUpdateAlumnoComponent},
    {path: "editar_alumno/:id", component: AddUpdateAlumnoComponent},
    {path: "materias", component: MateriasComponent},
    {path: "add_materia", component: AddUpdateMateriaComponent}
];
