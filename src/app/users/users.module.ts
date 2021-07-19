import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserSingleComponent } from './user-single/user-single.component';
import { UserAddComponent } from './user-add/user-add.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserListComponent,
    UserSingleComponent,
    UserAddComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
