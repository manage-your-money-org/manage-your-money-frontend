import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ExpenseService} from "../services/expense/expense.service";
import {ExpenseResponse} from "../shared/models/response/ExpenseResponse";
import {FilterRequest} from "../shared/models/request/FilterRequest";
import {PaymentMethod} from "../shared/models/response/PaymentMethod";
import {MatDialog} from "@angular/material/dialog";
import {AddEditExpenseComponent} from "../add-edit-expense/add-edit-expense.component";
import {DialogData} from "../shared/models/DialogData";
import {EXPENSE_CATEGORY_KEY_KEY, EXPENSE_KEY_KEY} from "../shared/constants";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit {

  receivedCategoryKey: string = null;
  expenseList: ExpenseResponse[] = [];
  pageSize: number = 50;
  currentPage: number = 0;
  isError = false;
  errorMessage = '';
  isLoading = true;
  isLastPage = false;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private expenseService: ExpenseService,
              private matDialog: MatDialog,
              private _snackbar: MatSnackBar
  ) {
  }

  toggleLoading = () => this.isLoading = !this.isLoading;

  ngOnInit(): void {

    this.receivedCategoryKey = this.activatedRoute.snapshot.params["expenseCategoryKey"];

    this.getAllExpenses();
  }

  onScroll() {

    console.log("On scrolled")
    this.isLoading = true;

    if (!this.isLastPage) {
      this.currentPage++;
      this.getAllExpenses();
    } else {
      this.isLoading = false;
    }
  }

  trackByFn(index, item) {
    return item.key;
  }

  getAllExpenses() {

    const filterRequest: FilterRequest = {
      categoryKeys: [this.receivedCategoryKey]
    }

    this.expenseService.getExpensesList(
      filterRequest,
      this.currentPage,
      this.pageSize,
      "expenseDate,desc"
    ).subscribe({
      next: (response) => {

        if (response.status === 200) {
          this.isError = false;

          const pageableResponse = response.body.body;
          this.isLastPage = pageableResponse.last;

          this.expenseList = [...this.expenseList, ...pageableResponse.content]
        } else {
          this.isError = true;
          this.errorMessage = "Unable to fetch expenses - \nstatus: " + response.status + "\nmessage: " + response.body.message;
        }

        if (this.isLastPage) {
          this.isLoading = false;
        } else {
          this.toggleLoading();
        }
      },
      error: (error) => {

        this.isError = true;
        this.errorMessage = "Unable to fetch expenses - \nstatus: " + error.status + "\nmessage: " + (error.error.message === null || error.error.message === '') ? error.message : error.error.message;
      }
    })
  }

  getFormattedPaymentMethods(paymentMethods: PaymentMethod[]): string {

    let paymentMethodsString = 'OTHERS';

    if (paymentMethods.length !== 0) {

      paymentMethodsString = '';
      paymentMethodsString = paymentMethods.map(pm => pm.paymentMethodName).join(" | ")
    }

    return paymentMethodsString;
  }

  navigateToAddExpensePage() {

    //this.router.navigate(['expense-categories', this.receivedCategoryKey, "expenses", "add"]);

    const dialogData: DialogData = {
      map: new Map<string, any>()
        .set(EXPENSE_CATEGORY_KEY_KEY, this.receivedCategoryKey)
        .set(EXPENSE_KEY_KEY, "add")
    };

    const dialogRef = this.matDialog.open(AddEditExpenseComponent, {
      data: dialogData,
      width: "500px",
      maxHeight: "600px"
    });

    dialogRef.afterClosed().subscribe(result => {

      const expenseResponse = result as ExpenseResponse;
      this.expenseList.push(expenseResponse);
      this.expenseList.sort((e1, e2) => e2.expenseDate - e1.expenseDate)
    });
  }

  navigateToEditExpensePage(expense: ExpenseResponse) {

    //this.router.navigate(['expense-categories', this.receivedCategoryKey, "expenses", expense.key]);

    const dialogData: DialogData = {
      map: new Map<string, any>()
        .set(EXPENSE_CATEGORY_KEY_KEY, this.receivedCategoryKey)
        .set(EXPENSE_KEY_KEY, expense.key)
    };

    const dialogRef = this.matDialog.open(AddEditExpenseComponent, {
      data: dialogData,
      width: "500px",
      height: "600px"
    });

    dialogRef.afterClosed().subscribe(result => {

      const expenseResponse = result as ExpenseResponse;

      const expenseIndex = this.expenseList.findIndex(obj => obj.key === expense.key);

      if (expenseIndex !== -1) {
        this.expenseList[expenseIndex] = {...this.expenseList[expenseIndex], ...expenseResponse}
        this.expenseList.sort((e1, e2) => e2.expenseDate - e1.expenseDate)
      }
    });
  }

  deleteExpense(expense: ExpenseResponse) {

    const dialogRef = this.matDialog.open(DeleteDialogComponent, {
      data: "This will delete this category and it's expenses."
    });

    dialogRef.afterClosed().subscribe(result => {

      console.log(`Dialog result: ${result}`);

      if (result) {

        this.expenseService.deleteExpense(
          expense.key
        ).subscribe((response) => {

          if (response.status === 204) {

            this._snackbar.open("Expense deleted successfully", '', {
              duration: 5000
            });

            this.expenseList.splice(this.expenseList.indexOf(expense), 1);
          } else {
            this._snackbar.open("Something went wrong!", '', {duration: 5000})
          }
        });
      }
    });

  }
}
