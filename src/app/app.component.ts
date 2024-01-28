import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GlobalValuesService} from "./services/global-values.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'manage-your-money-frontend';
  currentlyOpenedCategoryName = '';

  constructor(private router: Router, private globalValuesService: GlobalValuesService) {
  }

  ngOnInit(): void {
    this.globalValuesService.sharedData.subscribe(data => {

      this.currentlyOpenedCategoryName = data.currentlyOpenedCategoryName !== undefined ? " > " + data.currentlyOpenedCategoryName : '';
    });
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
    this.currentlyOpenedCategoryName = '';
    this.router.navigate([""]);
  }
}
