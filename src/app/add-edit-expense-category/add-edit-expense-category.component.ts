import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ExpenseCategoryService} from "../services/expense-category/expense-category.service";
import {ExpenseCategoryResponse} from "../shared/models/response/ExpenseCategoryResponse";

@Component({
  selector: 'app-add-edit-expense-category',
  templateUrl: './add-edit-expense-category.component.html',
  styleUrl: './add-edit-expense-category.component.css'
})
export class AddEditExpenseCategoryComponent implements OnInit {

  key = "";
  expenseCategory: ExpenseCategoryResponse = {} as ExpenseCategoryResponse;

  categoryName: string;
  categoryDescription: string;
  imageUrl: string

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private expenseCategoryService: ExpenseCategoryService) {
  }

  ngOnInit(): void {

    this.key = this.activatedRoute.snapshot.params["key"];

    if (this.key !== null && this.key.trim() !== "") {

      // retrieve expense category

      this.expenseCategoryService.getExpenseCategoryByKey(this.key.trim()).subscribe({
        next: (response) => {

          console.log(response.status);
          console.log(response.body);
          this.expenseCategory = response.body.body;
        },
        error: (err) => {

          console.log(err);
        }
      })
    }

  }


}
