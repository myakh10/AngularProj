import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthentificationComponent } from './authentification/authentification.component';
import { InscriptionComponent } from './inscription/inscription.component';

const routes: Routes = [
  {
    path:'',
    component: InscriptionComponent
  },
  {
    path:'authentification',
    component: AuthentificationComponent
  },
  {
    path:'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
