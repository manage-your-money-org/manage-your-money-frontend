import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserAuthenticationService} from "../services/user-authentication/user-authentication.service";
import {HttpResponse} from "@angular/common/http";
import {ExpenseCategoryService} from "../services/expense-category/expense-category.service";
import {LoginRequest} from "../shared/models/request/LoginRequest";
import {UserRequest} from "../shared/models/request/UserRequest";

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

  constructor(private router: Router, private authenticationService: UserAuthenticationService, private expenseCategoryService: ExpenseCategoryService) {
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

          return response.body;
        },
        error: (error) => {

          console.log("Error while registering user: " + error + ", status code: " + error.status)
        },
        complete: () => {

          console.log("Registering user request completed")
        }
      }
    )
  }

  registerUser() {

    let userRequest: UserRequest = {

      name: "sjnkjnskns",
      emailId: "sjknsknksn@gmail.com",
      password: "something"
    }

    this.authenticationService.registerUser(userRequest).subscribe({
      next: (response: HttpResponse<any>) => {

        console.log("User information status: " + response.status);
        console.log("User information: " + response.body);
      }
    });
  }
}
