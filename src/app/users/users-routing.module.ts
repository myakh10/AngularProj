import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserSingleComponent } from './user-single/user-single.component';
import { UserAddComponent } from './user-add/user-add.component';

const routes: Routes = [
  {
    path:'',
    component: UserListComponent
  },
  {
    path:'add',
    component: UserAddComponent
  },
  {
    path:':username',
    component: UserSingleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
