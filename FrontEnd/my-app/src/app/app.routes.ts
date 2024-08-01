import { Routes } from '@angular/router';

export const routes: Routes = [

    {
    path: 'main',
    loadComponent: () => import('./components/main/main.component'). then(m=>m.MainComponent)
   },
   {
    path: 'dashboard',
    loadChildren: () => import('./components/dashboard/routes')

   },
];
