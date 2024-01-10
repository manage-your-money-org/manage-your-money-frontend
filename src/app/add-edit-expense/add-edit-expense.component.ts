import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ExpenseService} from "../services/expense/expense.service";
import {ExpenseCategoryService} from "../services/expense-category/expense-category.service";
import {ExpenseResponse} from "../shared/models/response/ExpenseResponse";

@Component({
  selector: 'app-add-edit-expense',
  templateUrl: './add-edit-expense.component.html',
  styleUrl: './add-edit-expense.component.css'
})
export class AddEditExpenseComponent implements OnInit {

  receivedExpenseCategory: string = '';
  isForEditing: boolean = false;
  expense: ExpenseResponse = {} as ExpenseResponse;
  key: string = '';


  constructor(private router: Router, private activatedRoute: ActivatedRoute, private expenseService: ExpenseService, private expenseCategoryService: ExpenseCategoryService) {
  }

  ngOnInit(): void {

    this.receivedExpenseCategory = this.activatedRoute.snapshot.params["expenseCategoryKey"];

    const receivedKey = this.activatedRoute.snapshot.params['key'];

    if (receivedKey !== 'add') {

      this.key = receivedKey;
      this.expenseService.getExpenseByKey(this.key).subscribe((response) => {

        if (response.status === 200) {

          this.expense = response.body;
        }

      });
    }

  }

}
