import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {UserAuthenticationService} from '../services/user-authentication/user-authentication.service';
import {MymUtil} from '../shared/util/MymUtil';
import {HttpResponse} from '@angular/common/http';
import {MymApiResponse} from '../shared/models/response/MymApiResponse';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  emailId = '';
  isEmailIdValid = true;

  isResponseValid = true;

  successResponse = '';
  errorResponse = '';

  constructor(private router: Router, private userAuthenticationService: UserAuthenticationService) {
  }

  submitForgotPassword() {

    this.isEmailIdValid = MymUtil.isEmailIdValid(this.emailId.trim());

    if (this.isEmailIdValid) {

      this.isResponseValid = true;
      this.errorResponse = '';

      this.userAuthenticationService.forgotPassword(this.emailId).subscribe({

        next: (response: HttpResponse<MymApiResponse<string>>) => {

          if (response.status === 200) {

            this.isResponseValid = true;
            this.successResponse = response.body.body;
          } else {

            this.isResponseValid = false;
            this.errorResponse = response.body.message;
          }
        },
        error: (error) => {

          this.isResponseValid = false;
          this.errorResponse = (error.error.message === null || error.error.message === '') ? error.message : error.error.message;
        }
      })
    } else {

      this.isResponseValid = false;
      this.errorResponse = 'Please enter a valid email id'
    }

  }

}
