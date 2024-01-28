import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ExpenseCategoryService} from "../services/expense-category/expense-category.service";
import {ExpenseCategoryResponse} from "../shared/models/response/ExpenseCategoryResponse";
import {PageableResponse} from "../shared/models/response/PageableResponse";
import {HttpResponse} from "@angular/common/http";
import {MymApiResponse} from "../shared/models/response/MymApiResponse";
import {ExpenseService} from "../services/expense/expense.service";
import {DateUtil} from "../shared/util/DateUtil";
import {FilterRequest} from "../shared/models/request/FilterRequest";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-expense-category',
  templateUrl: './expense-category.component.html',
  styleUrl: './expense-category.component.css'
})
export class ExpenseCategoryComponent implements OnInit {

  expenseCategoryList: ExpenseCategoryResponse[] = [];
  currentPage = 0;
  pageSize = 10;

  isError = false;
  errorMessage = '';
  isLoading = true;

  isLastPage = false;

  selectedItem: ExpenseCategoryResponse;

  constructor(private router: Router, private expenseCategoryService: ExpenseCategoryService,
              private expenseService: ExpenseService, private dialog: MatDialog, private _snackbar: MatSnackBar) {
  }

  selectItem(item: ExpenseCategoryResponse) {
    this.selectedItem = item;
  }

  toggleLoading = () => this.isLoading = !this.isLoading;

  ngOnInit(): void {

    this.getExpenseCategories()
  }

  onScroll() {

    console.log("On scrolled")
    this.isLoading = true;

    if (!this.isLastPage) {
      this.currentPage++;
      this.getExpenseCategories();
    } else {
      this.isLoading = false;
    }
  }

  trackByFn(index, item) {
    return item.key;
  }

  navigateToAddExpenseCategory() {

    this.router.navigate(["expense-categories", "add"])
  }

  navigateToEditExpenseCategory() {

    this.router.navigate(["expense-categories", this.selectedItem.key])
  }

  deleteExpenseCategory() {

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: "This will delete this category and it's expenses."
    });

    dialogRef.afterClosed().subscribe(result => {

      console.log(`Dialog result: ${result}`);

      if (result) {

        this.expenseCategoryService.deleteExpenseCategoryByKey(
          this.selectedItem.key
        ).subscribe((response) => {

          if (response.status === 204) {

            this._snackbar.open("Category deleted successfully", '', {
              duration: 5000
            });

            this.expenseCategoryList.splice(this.expenseCategoryList.indexOf(this.selectedItem), 1);
          } else {
            this._snackbar.open("Something went wrong!", '', {duration: 5000})
          }
        });
      }
    });
  }

  private getExpenseCategories() {

    this.expenseCategoryService.getAllCategories(
      this.currentPage, this.pageSize, "modified,desc"
    ).subscribe({

      next: (response: HttpResponse<MymApiResponse<PageableResponse<ExpenseCategoryResponse>>>) => {

        if (response.status === 200) {

          this.isError = false;
          const pageableResponse = response.body.body;
          this.isLastPage = pageableResponse.last;

          this.expenseCategoryList = [...this.expenseCategoryList, ...pageableResponse.content]

          if (this.currentPage === 0 && this.expenseCategoryList.length !== 0) {

            let dateRange = DateUtil.getTimeInMillisForFirstAndLastDayOfCurrentMonth();

            const filterRequest: FilterRequest = {
              categoryKeys: [this.expenseCategoryList[0].key],
              paymentMethodKeys: null,
              dateRange: {first: dateRange.firstDay, second: dateRange.lastDay}
            };

            this.expenseService.getTotalExpenseAmountSum(filterRequest).subscribe((response) => {
              this.expenseCategoryList[0].thisMonthExpense = response.body.body.totalExpenseAmount;
            });

            filterRequest.dateRange = null;

            this.expenseService.getTotalExpenseAmountSum(filterRequest).subscribe((response) => {
              this.expenseCategoryList[0].totalExpense = response.body.body.totalExpenseAmount;
            });

            this.selectedItem = this.expenseCategoryList[0];
          }
        }
        console.log("Category list: " + this.expenseCategoryList.length);

        if (this.isLastPage) {
          this.isLoading = false;
        } else {
          this.toggleLoading();
        }
      },

      error: (error) => {

        this.isError = true;
        this.errorMessage = "Unable to fetch expense categories - \nstatus: " + error.status + "\nmessage: " + (error.error.message === null || error.error.message === '') ? error.message : error.error.message;
      }
    });
  }
}
