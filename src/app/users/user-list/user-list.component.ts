import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { Observable } from "rxjs";
import { User } from '../user-single/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styles: [`
    .addUser {
      margin: auto;
      width: 20%;
      padding: 20px;
    }
    .hero {
      background-image: url('/assets/img/display2.jpg') !important;
      background-size: cover;
      background-position: center center;
    }
  `
  ]
})

export class UserListComponent implements OnInit {
  users: Observable<User[]>;

  constructor(private userService: UserService) { 
    this.users = new Observable<User[]>();
  }

  async ngOnInit() : Promise<void> {
    // show signed up users in the user management page
    this.users = this.userService.getSignedUpUsers();
  }
}