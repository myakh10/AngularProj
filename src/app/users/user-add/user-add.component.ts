import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { Observable, from } from "rxjs";
import { Router } from '@angular/router';
import { ValidationErrors, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { CustomValidationService } from 'src/app/custom-validation.service';

@Component({
  selector: 'app-user-add',
  templateUrl:'./user-add.component.html',
  styles: [`
  .hero {
    background-image: url('/assets/img/display2.jpg') !important;
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
export class UserAddComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService, private customValidator: CustomValidationService) { 
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
      validator: this.customValidator.passwordMatchValidator("password", "confirmPassword")
    }); 
  }

  ngOnInit(): void {
    
  }

  emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const myResult = from(this.userService.isUserAlreadyRegistered(control.value,"jgehk"));
      return myResult.pipe(
        map((response: any) => (response ? {'asyncValidation': 'failed'} : null))
      )
    }  
  }

  emailValidAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const myResult = from(this.userService.isEmailFromReqRes(control.value,"jgehk"));
      return myResult.pipe(
        map((response: any) => (response ? null : {'emailNotFromReqres': 'failed'}))
      )
    }  
  }

  get f() { return this.registerForm.controls; }

  private createUser(token: string, id: string) { 
    this.userService.addToken(token);

    this.userService.getUser(id)
    .subscribe(user => {
      this.userService.addSignedUpUser(user);
    });
  }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    const response = await this.userService.getInscriptionResponse(this.registerForm.controls['email'].value, this.registerForm.controls['password'].value);
    if(response.status == 200){
      const data = await response.json();

      this.userService.addToUserPasswordMap(this.registerForm.controls['email'].value, this.registerForm.controls['password'].value);
      this.createUser(data.token, data.id);

      this.router.navigateByUrl('/users');
    }
  }
}