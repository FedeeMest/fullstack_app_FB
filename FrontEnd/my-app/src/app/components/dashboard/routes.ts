import { Route } from "@angular/router";
import { AlumnosComponent } from "./alumnos/alumnos.component";
import { MateriasComponent } from "./materias/materias.component";
import { InscripcionesComponent } from "./inscripciones/inscripciones.component";
import { PrincipalComponent } from "./principal/principal.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { ListaalumnosComponent } from "./alumnos/listaalumnos/listaalumnos.component";

export default [
    { path: '', component: PrincipalComponent },
    { path: 'alumnos',component: AlumnosComponent },
    { path: 'materias',component: MateriasComponent },
    { path: 'inscripciones',component: InscripcionesComponent },
    { path: 'navbar',component: NavbarComponent },
    { path: 'listaalumnos',component: ListaalumnosComponent},

] as Route[];