import { Routes } from '@angular/router';
import { AlumnosComponent } from './components/Alum/alumnos/alumnos.component';
import { AddUpdateAlumnoComponent } from './components/Alum/add-update-alumno/add-update-alumno.component';
import { MateriasComponent } from './components/Mat/materias/materias.component';
import { AddUpdateMateriaComponent } from './components/Mat/add-update-materia/add-update-materia.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { BuscadorComponent } from './components/busqueda/buscador/buscador.component';
import { ResultadoComponent } from './components/busqueda/resultado/resultado.component';
import { ListadoIComponent } from './components/busqueda/listado-i/listado-i.component';
import { AddInscripcionComponent } from './components/busqueda/add-inscripcion/add-inscripcion.component';
import { LoginComponent } from './auth/login/login.component';



export const routes: Routes = [
    {path: "", component: InicioComponent},
    {path:"login", component:LoginComponent},
    {path: "alumnos", component: AlumnosComponent},
    {path: "add_alumno", component: AddUpdateAlumnoComponent},
    {path: "editar_alumno/:id", component: AddUpdateAlumnoComponent},
    {path: "materias", component: MateriasComponent},
    {path: "add_materia", component: AddUpdateMateriaComponent},
    {path: "editar_materia/:id", component: AddUpdateMateriaComponent},
    {path: "buscar", component: BuscadorComponent},
    {path: "resultado/:id", component: ResultadoComponent},
    {path: "lista_insc/:id", component: ListadoIComponent},
    {path: "add_inscripcion/:id", component: AddInscripcionComponent},
    { path: "**", redirectTo: "" }

];
