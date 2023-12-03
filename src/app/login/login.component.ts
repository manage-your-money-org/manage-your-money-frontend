import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserAuthenticationService} from "../services/user-authentication/user-authentication.service";
import {HttpResponse} from "@angular/common/http";
import {LoginRequest} from "../shared/models/request/LoginRequest";
import {MymUtil} from '../shared/util/MymUtil';

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
  isLoginInvalid: boolean = false;

  hide = true;

  constructor(private router: Router, private authenticationService: UserAuthenticationService) {
  }

  ngOnInit(): void {

  }

  handleLoginOnClickSignInBtn() {


    if (!MymUtil.isEmailIdValid(this.emailId.trim())) {

      this.isEmailValid = false;
    } else {
      this.isEmailValid = true;
    }

    if (!MymUtil.isStringValid(this.password.trim())) {

      this.isPasswordValid = false;
    } else {
      this.isPasswordValid = true;
    }

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

              this.isLoginInvalid = false;
              this.router.navigate(['/expense-categories'])
            } else {
              this.isLoginInvalid = false;
              this.errorMessage = "Something went wrong!!"
            }

          },
          error: (error) => {

            this.isLoginInvalid = true;

            this.errorMessage = "Error while Login: " + error.message;

            if (error.status == 403) {

              this.errorMessage = "Username or password not valid"
            }

            console.log("Error while logging user: " + error + ", status code: " + error.status)
          }
        }
      )
    }
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  navigateToRegisterUser() {

    this.router.navigate(['/register']);
  }
}
