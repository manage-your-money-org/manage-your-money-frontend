import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserAuthenticationService} from "../services/user-authentication/user-authentication.service";
import {HttpResponse} from "@angular/common/http";
import {LoginRequest} from "../shared/models/request/LoginRequest";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  emailId: string = '';
  password: string = '';
  errorMessage: string = "Invalid credentials"
  isInvalidPassword: boolean = false;

  constructor(private router: Router, private authenticationService: UserAuthenticationService) {
  }

  ngOnInit(): void {

  }

  handleLoginOnClickSignInBtn() {

    let loginRequest: LoginRequest = {
      emailId: this.emailId,
      password: this.password
    }

    console.log("Clicked handle login button")

    this.authenticationService.loginUser(loginRequest).subscribe({

        next: (response: HttpResponse<any>) => {

          console.log(response.status);
          console.log(response.body);
          this.router.navigate(['/expense-categories'])
        },
        error: (error) => {

          console.log("Error while registering user: " + error + ", status code: " + error.status)
        }
      }
    )
  }

  registerUser() {

    this.router.navigate(['/register']);
  }
}
