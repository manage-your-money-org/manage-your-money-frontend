import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ExpenseService} from "../services/expense/expense.service";
import {ExpenseResponse} from "../shared/models/response/ExpenseResponse";
import {FilterRequest} from "../shared/models/request/FilterRequest";
import {PaymentMethod} from "../shared/models/response/PaymentMethod";

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

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private expenseService: ExpenseService) {
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
      "created,desc"
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

    this.router.navigate(['expense-categories', this.receivedCategoryKey, "expenses", "add"]);
  }

  navigateToEditExpensePage(expense: ExpenseResponse) {

    this.router.navigate(['expense-categories', this.receivedCategoryKey, "expenses", expense.key]);
  }
}
