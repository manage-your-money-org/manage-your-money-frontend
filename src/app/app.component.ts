import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GlobalValuesService} from "./services/global-values.service";
import {
  EXPENSE_CATEGORY_SORT_PREF_KEY,
  SORT_ASCENDING_CATEGORY_NAME,
  SORT_ASCENDING_DATE,
  SORT_DESCENDING_CATEGORY_NAME,
  SORT_DESCENDING_DATE
} from "./shared/constants";
import {EventHandlerService} from "./services/event-handler.service";
import {LocalStorageService} from "./services/local-storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'manage-your-money-frontend';
  currentlyOpenedCategoryName = '';

  isDateDescendingForCategory = true;
  isNameDescendingForCategory = false;
  isDateSelected = true;
  sortMenuForExpenseCategory = [];
  selectedExpenseCategorySort: string = SORT_DESCENDING_DATE;
  activatedComponent = "_ExpenseCategoryComponent";

  constructor(private router: Router,
              private globalValuesService: GlobalValuesService,
              private eventHandlerService: EventHandlerService,
              private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {

    let category_sort_pref = this.localStorageService.getItem(EXPENSE_CATEGORY_SORT_PREF_KEY);

    if (category_sort_pref) {
      this.selectedExpenseCategorySort = category_sort_pref;
    }

    this.initializeSortMenu();
  }

  initializeSortMenu() {

    this.sortMenuForExpenseCategory = [
      {
        sortName: this.isDateDescendingForCategory ? "↑ Date, Desc" : "↓ Date",
        value: this.isDateDescendingForCategory ? SORT_DESCENDING_DATE : SORT_ASCENDING_DATE,
        isSelected: this.isDateSelected
      },
      //{sortName: "Date, desc", value: SORT_DESCENDING_DATE},
      {
        sortName: this.isNameDescendingForCategory ? "↑ Name, Desc" : "↓ Name",
        value: this.isNameDescendingForCategory ? SORT_DESCENDING_CATEGORY_NAME : SORT_ASCENDING_CATEGORY_NAME,
        isSelected: !this.isDateSelected
      },
      //{sortName: "Name, desc", value: SORT_DESCENDING_CATEGORY_NAME}
    ]
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

    this.activatedComponent = event.constructor.name;

    if (event.constructor.name === "_ExpenseComponent") {
      this.globalValuesService.currentlyOpenedExpenseCategoryObservable.subscribe(data => {

        this.currentlyOpenedCategoryName = data !== undefined ? " > " + data : '';
      });
      //this.currentlyOpenedCategoryName = this.globalValuesService.currentlyOpenedCategoryName !== undefined ? " > " + this.globalValuesService.currentlyOpenedCategoryName : '';
    } else {

      this.currentlyOpenedCategoryName = '';
    }

    if (event.constructor.name === '_ExpenseCategoryComponent') {

      console.log("selectedExpenseCategorySort: " + this.selectedExpenseCategorySort);
      this.eventHandlerService.emitSortMenuForExpenseCategoryMenuClick(this.selectedExpenseCategorySort);
    }
  }

  onHeaderTitleClicked() {
    this.currentlyOpenedCategoryName = '';
    this.router.navigate([""]);
  }

  emitSortMenuClick(menu: { sortName: string; value: string; isSelected: boolean }) {

    if (this.activatedComponent === "_ExpenseCategoryComponent") {

      if (menu.sortName.includes("Date")) {

        this.isDateDescendingForCategory = !this.isDateDescendingForCategory;
        this.isDateSelected = true;
        menu.value = this.isDateDescendingForCategory ? SORT_DESCENDING_DATE : SORT_ASCENDING_DATE;
      } else {
        this.isNameDescendingForCategory = !this.isNameDescendingForCategory;
        this.isDateSelected = false;
        menu.value = this.isNameDescendingForCategory ? SORT_DESCENDING_CATEGORY_NAME : SORT_ASCENDING_CATEGORY_NAME;
      }

      this.initializeSortMenu();

      this.selectedExpenseCategorySort = menu.value;
      this.eventHandlerService.emitSortMenuForExpenseCategoryMenuClick(menu.value);

      // save the preference to localstorage
      this.localStorageService.setTime(EXPENSE_CATEGORY_SORT_PREF_KEY, this.selectedExpenseCategorySort);
    }
  }
}
