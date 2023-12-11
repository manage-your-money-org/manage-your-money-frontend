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

@Component({
  selector: 'app-expense-category',
  templateUrl: './expense-category.component.html',
  styleUrl: './expense-category.component.css'
})
export class ExpenseCategoryComponent implements OnInit {

  expenseCategoryList: ExpenseCategoryResponse[] = [];
  pageableResponse: PageableResponse<ExpenseCategoryResponse>;
  currentPage = 0;
  pageSize = 10;

  isError = false;
  errorMessage = '';
  isLoading = false;

  totalPages = 0;
  isLastPage = false;

  selectedItem: ExpenseCategoryResponse;

  constructor(private router: Router, private expenseCategoryService: ExpenseCategoryService, private expenseService: ExpenseService) {
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

    if (!this.isLastPage) {
      this.currentPage++;
      this.getExpenseCategories();
    }
  }

  trackByFn(index, item) {
    return item.key;
  }

  getFormattedDate(longValue: number): string {

    const date = new Date(longValue);
    return date.toLocaleDateString(); // Adjust format as needed
  }

  navigateToAddExpenseCategory() {

    // todo: navigate to add-edit-expense-category-component for adding new category
    this.router.navigate(["add-edit-expense-category", ""])
  }

  navigateToEditExpenseCategory() {

    // todo: navigate to add-edit-expense-category-component for editing existing category
    this.router.navigate(["add-edit-expense-category", this.selectedItem.key])
  }

  private getExpenseCategories() {

    this.expenseCategoryService.getAllCategories(
      this.currentPage, this.pageSize, "modified,desc"
    ).subscribe({

      next: (response: HttpResponse<MymApiResponse<PageableResponse<ExpenseCategoryResponse>>>) => {

        if (response.status === 200) {

          this.isError = false;
          this.pageableResponse = response.body.body;
          this.isLastPage = this.pageableResponse.last;

          this.expenseCategoryList = [...this.expenseCategoryList, ...this.pageableResponse.content]

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
        console.log("Category content list: " + this.pageableResponse.content.length);
      },

      error: (error) => {

        this.isError = true;
        this.errorMessage = "Unable to fetch expense categories - \nstatus: " + error.status + "\nmessage: " + (error.error.message === null || error.error.message === '') ? error.message : error.error.message;
      },
      complete: () => {
        this.toggleLoading();
      }
    });
  }
}
