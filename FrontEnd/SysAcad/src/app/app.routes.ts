import { Routes } from '@angular/router';
import { AlumnosComponent } from './components/administrador/Alum/alumnos/alumnos.component';
import { AddUpdateAlumnoComponent } from './components/administrador/Alum/add-update-alumno/add-update-alumno.component';
import { MateriasComponent } from './components/administrador/Mat/materias/materias.component';
import { AddUpdateMateriaComponent } from './components/administrador/Mat/add-update-materia/add-update-materia.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { BuscadorComponent } from './components/administrador/busqueda/buscador/buscador.component';
import { ResultadoComponent } from './components/administrador/busqueda/resultado/resultado.component';
import { ListadoIComponent } from './components/administrador/busqueda/listado-i/listado-i.component';
import { AddInscripcionComponent } from './components/administrador/busqueda/add-inscripcion/add-inscripcion.component';
import { LoginComponent } from './auth/login/login.component';
import { AdminsComponent } from './components/administrador/admin/admins/admins.component.js';
import { AddUpdateAdminComponent } from './components/administrador/admin/add-update-admin/add-update-admin.component.js';
import { InformacionComponent } from './components/alumnos/informacion/informacion.component';
import { RoleGuard } from './guards/auth.guard';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { ChangeadminComponent } from './components/administrador/changeadmin/changeadmin.component';

export const routes: Routes = [

    { path: 'login', component: LoginComponent },
  
    { path: '', component: InicioComponent },

    {
      path: '',
      canActivate: [RoleGuard],
      data: { roles: ['admin', 'alumno'] }, // Roles compartidos
      children: [
        {path: "informacion/:id", component: InformacionComponent},
        {path: "lista_insc/:id", component: ListadoIComponent},
        {path: "add_inscripcion/:id", component: AddInscripcionComponent},
        {path: "materias", component: MateriasComponent},
        {path: "change-password/:id", component: ChangepasswordComponent},
      ],
    },

    {
      path: 'admin',
      canActivate: [RoleGuard],
      data: { roles: ['admin'] }, // Solo admin
      children: [
        {path: "alumnos", component: AlumnosComponent},
        {path: "add_alumno", component: AddUpdateAlumnoComponent},
        {path: "editar_alumno/:id", component: AddUpdateAlumnoComponent},
        {path: "add_materia", component: AddUpdateMateriaComponent},
        {path: "editar_materia/:id", component: AddUpdateMateriaComponent},
        {path: "buscar", component: BuscadorComponent},
        {path: "resultado/:tabla/:id", component: ResultadoComponent},
        {path: "admins", component: AdminsComponent},
        {path: "add_admin", component: AddUpdateAdminComponent},
        {path: "editar_admin/:id", component: AddUpdateAdminComponent},
        {path: "change-password/:id", component: ChangeadminComponent},

        
      ],
    },

    {path: "**", redirectTo: "inicio" }
]

  