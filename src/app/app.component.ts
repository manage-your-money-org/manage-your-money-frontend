import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  name = 'manage-your-money-frontend';

  donNotShowHeaderList = [
    '_LoginComponent',
    '_ForgotPasswordComponent',
    '_RegisterUserComponent'
  ]

  shouldShowHeaderComponent = false;

  onActivate(event: any) {

    this.shouldShowHeaderComponent = !this.donNotShowHeaderList.includes(event.constructor.name);
  }
}
