import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MymUtil} from "../shared/util/MymUtil";
import {Router} from "@angular/router";
import {UserAuthenticationService} from "../services/user-authentication/user-authentication.service";
import {UserRequest} from "../shared/models/request/UserRequest";

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent implements OnInit {

  name: string = '';
  emailId: string = '';
  password: string = '';
  confirmPassword: string = '';

  isFormValid: boolean = true;
  invalidFormMessage: string = '';

  isRegistrationSuccessful = false;
  successMessage: string = ''

  constructor(private router: Router, private userAuthenticationService: UserAuthenticationService) {
  }

  ngOnInit(): void {
  }

  registerUser(registerForm: NgForm) {

    // console.log(registerForm);

    console.log(`${this.name}, ${this.emailId}, ${this.password}, ${this.confirmPassword}`);

    if (!MymUtil.isStringValid(this.name)) {
      this.isFormValid = false;
      this.invalidFormMessage = "Please enter a valid name";
      return;
    }

    if (!MymUtil.isEmailIdValid(this.emailId.trim())) {

      this.isFormValid = false;
      this.invalidFormMessage = 'Please enter a valid email id';
      return;
    }

    if (!MymUtil.isStringValid(this.password)) {

      this.isFormValid = false;
      this.invalidFormMessage = "Please enter a password";
      return;
    }

    if (!MymUtil.isPasswordValid(this.password)) {

      this.isFormValid = false;
      this.invalidFormMessage = "Password should be at-lease 8 characters long and should contain a special character (!@#$%^&*)";
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.isFormValid = false;
      this.invalidFormMessage = 'Password does not match';
      return;
    }

    this.isFormValid = true;
    this.invalidFormMessage = '';

    let userRequest: UserRequest = {
      name: this.name.trim(),
      emailId: this.emailId.trim(),
      password: this.password.trim()
    }

    this.userAuthenticationService.registerUser(userRequest).subscribe({

      next: response => {

        let status = response.status;

        console.log("Status: " + status);

        if (status == 201) {
          this.isRegistrationSuccessful = true;
          this.successMessage = response.body.message;
        } else {

          this.isRegistrationSuccessful = false;
          this.successMessage = '';

          this.isFormValid = false;
          this.invalidFormMessage = response.body.message;
        }

        //this.router.navigate(["login"])
      },

      error: err => {

        let status = err.status;

        console.log("Status: " + status);

        this.isFormValid = false;
        this.invalidFormMessage = err.error.message;
      }

    })
  }

  navigateToLoginPage() {

    this.router.navigate(["login"])
  }
}
