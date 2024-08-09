import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserAuthenticationService} from "../services/user-authentication/user-authentication.service";
import {HttpResponse} from "@angular/common/http";
import {LoginRequest} from "../shared/models/request/LoginRequest";
import {MymUtil} from '../shared/util/MymUtil';
import {MatDialog} from "@angular/material/dialog";
import {ForgotPasswordComponent} from "../forgot-password/forgot-password.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  emailId: string = '';
  isEmailValid = true;
  password: string = '';
  isPasswordValid = true;
  errorMessage: string = ""
  isLoginValid: boolean = false;

  hide = true;

  constructor(private router: Router, private authenticationService: UserAuthenticationService, private dialog: MatDialog) {
  }

  ngOnInit(): void {

  }

  onSignInButtonClicked() {

    this.isLoginValid = true;
    this.errorMessage = '';

    this.isEmailValid = MymUtil.isStringValid(this.emailId) && MymUtil.isEmailIdValid(this.emailId.trim());
    this.isPasswordValid = MymUtil.isStringValid(this.password) && MymUtil.isPasswordValid(this.password.trim());

    if (this.isEmailValid && this.isPasswordValid) {

      let loginRequest: LoginRequest = {
        emailId: this.emailId,
        password: this.password
      }

      console.log("Clicked handle login button")

      this.authenticationService.loginUser(loginRequest).subscribe({

          next: (response: HttpResponse<any>) => {

            console.log(response.status);
            console.log(response.body.error);

            if (response.status == 200) {

              this.isLoginValid = true;
              this.router.navigate(['/expense-categories'])
            } else {
              this.isLoginValid = false;
              this.errorMessage = "Something went wrong!!"
            }

          },
          error: (error) => {

            this.isLoginValid = false;

            this.errorMessage = "Error while Login: " + error.message;

            if (error.status == 403) {

              this.errorMessage = "Username or password not valid"
            }

            console.log("Error while logging user: " + error + ", status code: " + error.status)
          }
        }
      )
    } else {

      this.isLoginValid = false;
      this.errorMessage = !this.isEmailValid ? "Email not valid" : "Password should be at least 8 character, should contain a letter, a digit and a special character (!@#$%^&*)";
    }
  }

  navigateToForgotPassword() {
    //this.router.navigate(['/forgot-password']);

    this.dialog.open(ForgotPasswordComponent);
  }

  navigateToRegisterUser() {

    this.router.navigate(['/register']);
  }
}
