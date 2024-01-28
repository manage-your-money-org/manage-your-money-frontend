import {Component, OnInit} from '@angular/core';
import {ExpenseCategoryResponse} from "../shared/models/response/ExpenseCategoryResponse";
import {ExpenseCategoryService} from "../services/expense-category/expense-category.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-select-expense-category-dialog',
  templateUrl: './select-expense-category-dialog.component.html',
  styleUrl: './select-expense-category-dialog.component.css'
})
export class SelectExpenseCategoryDialogComponent implements OnInit {

  expenseCategoryList: ExpenseCategoryResponse[] = [];
  isLoading = true;
  searchInput: string = '';
  currentPage = 0;
  pageSize = 10;
  isLastPage = false;

  constructor(
    private expenseCategoryService: ExpenseCategoryService,
    private dialogRef: MatDialogRef<SelectExpenseCategoryDialogComponent>
  ) {
  }

  ngOnInit(): void {

    this.getAllExpenseCategories();
  }

  private getAllExpenseCategories() {

    this.expenseCategoryService.getAllCategories(
      this.currentPage, this.pageSize, "modified,desc"
    ).subscribe((response) => {

      if (response.status === 200) {

        const pageableResponse = response.body.body;
        this.isLastPage = pageableResponse.last;

        this.expenseCategoryList = [...this.expenseCategoryList, ...pageableResponse.content]

      }
      console.log("Category list: " + this.expenseCategoryList.length);

      if (this.isLastPage) {
        this.isLoading = false;
      } else {
        this.toggleLoading();
      }

    });
  }

  toggleLoading = () => this.isLoading = !this.isLoading;


  onScroll() {

    console.log("On scrolled")
    this.isLoading = true;

    if (!this.isLastPage) {
      this.currentPage++;
      this.getAllExpenseCategories();
    } else {
      this.isLoading = false;
    }
  }

  selectItem(expenseCategory: ExpenseCategoryResponse) {

    console.log("Selected category is: " + expenseCategory);
    this.dialogRef.close(expenseCategory);
  }


  searchCategory() {

    // todo: call backend service for category search
  }

}
