import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ExpenseCategoryService} from "../services/expense-category/expense-category.service";
import {ExpenseCategoryResponse} from "../shared/models/response/ExpenseCategoryResponse";
import {PageableResponse} from "../shared/models/response/PageableResponse";
import {HttpResponse} from "@angular/common/http";
import {MymApiResponse} from "../shared/models/response/MymApiResponse";

@Component({
  selector: 'app-expense-category',
  templateUrl: './expense-category.component.html',
  styleUrl: './expense-category.component.css'
})
export class ExpenseCategoryComponent implements OnInit {

  expenseCategoryList: ExpenseCategoryResponse[] = [];
  pageableResponse: PageableResponse<ExpenseCategoryResponse>;
  currentPage = 0;
  pageSize = 6;

  isError = false;
  errorMessage = '';
  isLoading = false;

  totalPages = 0;
  isLastPage = false;

  constructor(private router: Router, private expenseCategoryService: ExpenseCategoryService) {
  }

  toggleLoading = () => this.isLoading = !this.isLoading;

  ngOnInit(): void {

    //this.getExpenseCategories()
  }

  searchCategory() {

    // todo: search category on backend
  }

  onScroll() {

    console.log("On scrolled")

    if (!this.isLastPage) {
      this.currentPage++;
      this.getExpenseCategories();
    }
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
