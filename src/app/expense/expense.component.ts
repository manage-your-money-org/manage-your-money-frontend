import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ExpenseService} from "../services/expense/expense.service";
import {ExpenseResponse} from "../shared/models/response/ExpenseResponse";
import {FilterRequest} from "../shared/models/request/FilterRequest";
import {PaymentMethod} from "../shared/models/response/PaymentMethod";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddEditExpenseComponent} from "../add-edit-expense/add-edit-expense.component";
import {DialogData} from "../shared/models/DialogData";
import {DUPLICATE_EXPENSE_KEY, EXPENSE_CATEGORY_KEY_KEY, EXPENSE_KEY_KEY} from "../shared/constants";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {
  SelectExpenseCategoryDialogComponent
} from "../select-expense-category-dialog/select-expense-category-dialog.component";
import {ExpenseRequest} from "../shared/models/request/ExpenseRequest";
import {ExpenseCategoryResponse} from "../shared/models/response/ExpenseCategoryResponse";
import {ExpenseCategoryService} from "../services/expense-category/expense-category.service";
import {GlobalValuesService} from "../services/global-values.service";

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
              private expenseCategoryService: ExpenseCategoryService,
              private matDialog: MatDialog,
              private _snackbar: MatSnackBar,
              private globalValueService: GlobalValuesService
  ) {
  }

  toggleLoading = () => this.isLoading = !this.isLoading;

  ngOnInit(): void {

    this.receivedCategoryKey = this.activatedRoute.snapshot.params["expenseCategoryKey"];

    this.expenseCategoryService.getExpenseCategoryByKey(
      this.receivedCategoryKey
    ).subscribe(response => {
      if (response.ok) {
        //this.globalValueService.updateCurrentlyOpenedCategoryName(response.body.body.categoryName);
        this.globalValueService.updateData(response.body.body.categoryName);
      }
    });

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
        .set(DUPLICATE_EXPENSE_KEY, null)
    };

    const dialogRef = this.openAddEditDialog(dialogData);

    this.modifyExpenseListForExpenseAdditionAfterDialogClosed(dialogRef);
  }

  navigateToEditExpensePage(expense: ExpenseResponse) {

    //this.router.navigate(['expense-categories', this.receivedCategoryKey, "expenses", expense.key]);

    const dialogData: DialogData = {
      map: new Map<string, any>()
        .set(EXPENSE_CATEGORY_KEY_KEY, this.receivedCategoryKey)
        .set(EXPENSE_KEY_KEY, expense.key)
        .set(DUPLICATE_EXPENSE_KEY, null)
    };

    const dialogRef = this.openAddEditDialog(dialogData);

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        const expenseResponse = result as ExpenseResponse;

        const expenseIndex = this.expenseList.findIndex(obj => obj.key === expense.key);

        if (expenseIndex !== -1) {
          this.expenseList[expenseIndex] = {...this.expenseList[expenseIndex], ...expenseResponse}
          this.expenseList.sort((e1, e2) => e2.expenseDate - e1.expenseDate)
        }
      }
    });
  }

  moveExpenseToOtherExpenseCategory(expense: ExpenseResponse) {

    const dialog = this.matDialog.open(SelectExpenseCategoryDialogComponent, {
      width: "800px",
      height: "500px"
    });

    dialog.afterClosed().subscribe((result => {

      if (result) {

        const selectedExpenseCategory = result as ExpenseCategoryResponse;

        if (selectedExpenseCategory.key !== this.receivedCategoryKey) {

          const expenseRequest: ExpenseRequest = {

            amount: expense.amount,
            spentOn: expense.spentOn,
            expenseDate: expense.expenseDate,
            categoryKey: selectedExpenseCategory.key,
            paymentMethodsKeys: expense.paymentMethods.map(pm => pm.key),
            newPaymentMethod: [],
            key: expense.key
          };

          let isActionClicked = false;

          this.expenseList.splice(this.expenseList.indexOf(expense), 1);

          let snackbar = this._snackbar.open("Expense moved to " + selectedExpenseCategory.categoryName, 'Undo', {
            duration: 3000
          });

          // when undo clicked
          snackbar.onAction().subscribe(value => {

            isActionClicked = true;

            // add the expense back to the list
            this.expenseList.push(expense);
            this.expenseList.sort((e1, e2) => e2.expenseDate - e1.expenseDate)
          });

          // when no undo is clicked, call update expense for updating expense category key of expense
          snackbar.afterDismissed().subscribe(value => {

            if (!isActionClicked) {

              this.expenseService.updateExpense(expenseRequest).subscribe((response) => {

                if (response.status === 200) {

                  this.expenseList.splice(this.expenseList.indexOf(expense), 1);

                  this.updateExpenseCategoryModifiedDate(selectedExpenseCategory);

                  // this._snackbar.open("Expense moved to " + selectedExpenseCategory.categoryName, '', {
                  //   duration: 5000
                  // });
                } else {
                  this._snackbar.open("Something went wrong!", '', {duration: 5000});

                  // add the expense back to the list
                  this.expenseList.push(expense);
                  this.expenseList.sort((e1, e2) => e2.expenseDate - e1.expenseDate)
                }
              });
            }
          });
        } else {
          this._snackbar.open("Cannot move to same category!", '', {duration: 5000})
        }
      }
    }));
  }

  deleteExpense(expense: ExpenseResponse) {

    const dialogRef = this.matDialog.open(DeleteDialogComponent, {
      data: "This will delete this expense."
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

  duplicateExpense(expense: ExpenseResponse) {

    const dialogData: DialogData = {
      map: new Map<string, any>()
        .set(EXPENSE_CATEGORY_KEY_KEY, this.receivedCategoryKey)
        .set(EXPENSE_KEY_KEY, "duplicate")
        .set(DUPLICATE_EXPENSE_KEY, expense)
    };


    const dialogRef = this.openAddEditDialog(dialogData);
    this.modifyExpenseListForExpenseAdditionAfterDialogClosed(dialogRef);
  }

  private openAddEditDialog(dialogData: DialogData) {

    return this.matDialog.open(AddEditExpenseComponent, {
      data: dialogData,
      width: "500px",
      height: "600px"
    });
  }

  private modifyExpenseListForExpenseAdditionAfterDialogClosed(dialogRef: MatDialogRef<AddEditExpenseComponent, any>) {

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        const expenseResponse = result as ExpenseResponse;
        this.expenseList.push(expenseResponse);
        this.expenseList.sort((e1, e2) => e2.expenseDate - e1.expenseDate)
      }
    });
  }

  private updateExpenseCategoryModifiedDate(selectedExpenseCategory: ExpenseCategoryResponse) {

    // this will update only the modified date of expense category

    this.expenseCategoryService.updateExpenseCategory(
      {
        categoryName: selectedExpenseCategory.categoryName,
        categoryDescription: selectedExpenseCategory.categoryDescription,
        imageUrl: selectedExpenseCategory.imageUrl,
        key: selectedExpenseCategory.key
      }
    ).subscribe((res) => {

      if (res.status === 200) {
        console.log("Expense Category updated")
      }
    });
  }

}
