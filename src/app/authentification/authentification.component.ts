import { Component, OnInit } from '@angular/core';
import { ValidationErrors, AbstractControl, AsyncValidatorFn, 
  FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { map } from 'rxjs/operators';
import { Observable, from } from "rxjs";
import { CustomValidationService } from 'src/app/custom-validation.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html' ,
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
export class AuthentificationComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService, private customValidator: CustomValidationService) { 
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email], [this.emailAsyncValidator()]],
      password: ['', [Validators.required]]
    }, {
      validators: [this.customValidator.passwordIsValid("email", "password")]
    });
  }

  ngOnInit() {
  }

  // check if the user is already registered - if true then show a validation error
  emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const myResult = from(this.userService.isUserAlreadyRegistered(control.value,"jgehk"));
      return myResult.pipe(
        map((response: any) => (response ? null : {'userIsNotRegistered': 'failed'}))
      )
    }  
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    this.userService.doAuthentification(this.router, this.registerForm.controls['email'].value, this.registerForm.controls['password'].value);
  }
}
