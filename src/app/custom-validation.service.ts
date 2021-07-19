import { Injectable } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { UserService } from 'src/app/user.service';
import { ValidationErrors, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationService {

  constructor(private userService: UserService) { }

  // check if the "confirm password" field matches the "password" field
  passwordMatchValidator(password: string, confirmPassword: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl = control.get(password);
      const confirmPasswordControl = control.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors.passwordMismatch
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }

  // check if the password is valid (i.e the one that user used in the sign up step)
  passwordIsValid(email: string, password: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailControl = control.get(email);
      const passwordControl = control.get(password);

      if (!emailControl || !passwordControl) {
        return null;
      }

      const valid = this.userService.isPasswordCorrect(emailControl.value, passwordControl.value);

      if(valid){
        passwordControl.setErrors(null);
        return null;
        
      } else {
        passwordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }
    };
  }

  // check if the password the security rules (number, small and upper case)
  patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn | null {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null as any;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null as any : error;
    };
  }
}
