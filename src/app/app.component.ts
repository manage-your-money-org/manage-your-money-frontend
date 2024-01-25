import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'manage-your-money-frontend';

  constructor(private router: Router) {
  }

  doNotShowHeaderList = [
    '_LoginComponent',
    '_ForgotPasswordComponent',
    '_RegisterUserComponent',
  ];

  doNotShowMenuButtons: string[] = [
    '_AddEditExpenseCategoryComponent'
  ]

  shouldShowHeaderComponent = false;
  shouldShowMenuButtons = false;

  onActivate(event: any) {

    console.log(event.constructor.name);
    this.shouldShowHeaderComponent = !this.doNotShowHeaderList.includes(event.constructor.name);
    this.shouldShowMenuButtons = !this.doNotShowMenuButtons.includes(event.constructor.name);
  }

  onHeaderTitleClicked() {
    this.router.navigate([""]);
  }
}
