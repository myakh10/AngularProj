import { Component, OnInit } from '@angular/core';
import { ValidationErrors, AbstractControl, AsyncValidatorFn, 
  FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, from } from "rxjs";
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../users/user-single/user';
import { CustomValidationService } from 'src/app/custom-validation.service';

@Component({
  selector: 'app-home',
  templateUrl: "./inscription.component.html",
  styles: [`
  .hero {
    background-image: url('/assets/img/display1.jpg') !important;
    background-size: cover;
    background-position: center center;
  }
  .container {
    margin: 0 auto;
    width: 500px;
  }  
`
  ]
})

export class InscriptionComponent implements OnInit{
    registerForm: FormGroup;
    submitted = false;
    listOfUsers: Observable<User[]>;

    constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService, private customValidator: CustomValidationService) { 
      // list of users
      this.listOfUsers = new Observable<User[]>();

      this.registerForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email], Validators.composeAsync([this.emailAsyncValidator(), this.emailValidAsyncValidator()])],
        password: [
          null,
          Validators.compose([
            Validators.required,
            // number check
            this.customValidator.patternValidator(/\d/, {
              hasNumber: true
            }),
            // upper case letter check
            this.customValidator.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }),
            // lower case letter check
            this.customValidator.patternValidator(/[a-z]/, {
              hasSmallCase: true
            }),
            // length check
            Validators.minLength(8)
          ])
        ],
        confirmPassword: ['', [Validators.required]], 
      }, {
        validators: [this.customValidator.passwordMatchValidator("password", "confirmPassword")]
      });
    }

    async ngOnInit() {
      this.listOfUsers = this.userService.getUsers();
    }

    // check if the user is already registered - if true then show a validation error
    emailAsyncValidator(): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const myResult = from(this.userService.isUserAlreadyRegistered(control.value,"password"));
        return myResult.pipe(
          map((response: any) => (response ? {'asyncValidation': 'failed'} : null))
        )
      }  
    }

    // check if the email used is defined in reqres - if not then show a validation error
    emailValidAsyncValidator(): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const myResult = from(this.userService.isEmailFromReqRes(control.value,"password"));
        return myResult.pipe(
          map((response: any) => (response ? null : {'emailNotFromReqres': 'failed'}))
        )
      }  
    }

    // getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    async onSubmit() {
      this.submitted = true;

      // if the form is invalid stop here
      if (this.registerForm.invalid) {
          return;
      }

      this.userService.doInscription(this.router, this.registerForm.controls['email'].value, this.registerForm.controls['password'].value);
  }
}