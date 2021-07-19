import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-user-single',
  templateUrl: "./user-single.component.html",
  styles: [`
  .hero {
    background-image: url('/assets/img/display2.jpg') !important;
    background-size: cover;
    background-position: center center;
  } 
  `]
})
export class UserSingleComponent implements OnInit {
  user: any;

  constructor(
    private userService: UserService, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const username = params['username'];

      this.userService.getUser(username)
        .subscribe(user => {
          this.user = user
        });
    });
  }
}