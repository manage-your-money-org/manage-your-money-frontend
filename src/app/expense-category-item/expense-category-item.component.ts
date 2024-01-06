import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ExpenseCategoryResponse} from "../shared/models/response/ExpenseCategoryResponse";
import {ExpenseService} from "../services/expense/expense.service";
import {FilterRequest} from "../shared/models/request/FilterRequest";
import {DateUtil} from "../shared/util/DateUtil";

@Component({
    selector: 'app-expense-category-item',
    templateUrl: './expense-category-item.component.html',
    styleUrl: './expense-category-item.component.css'
})
export class ExpenseCategoryItemComponent {

    @Input() expenseCategoryItem: ExpenseCategoryResponse
    @Input() isSelected: boolean
    @Output() itemSelected = new EventEmitter<ExpenseCategoryResponse>();

    constructor(private expenseService: ExpenseService) {
    }

    onItemClick() {

        if (this.expenseCategoryItem.thisMonthExpense === null || this.expenseCategoryItem.thisMonthExpense === undefined) {

            let dateRange = DateUtil.getTimeInMillisForFirstAndLastDayOfCurrentMonth();

            const filterRequest: FilterRequest = {
                categoryKeys: [this.expenseCategoryItem.key],
                paymentMethodKeys: null,
                dateRange: {first: dateRange.firstDay, second: dateRange.lastDay}
            };

            this.expenseService.getTotalExpenseAmountSum(filterRequest).subscribe((response) => {
                this.expenseCategoryItem.thisMonthExpense = response.body.body.totalExpenseAmount;
            });

            filterRequest.dateRange = null;

            this.expenseService.getTotalExpenseAmountSum(filterRequest).subscribe((response) => {
                this.expenseCategoryItem.totalExpense = response.body.body.totalExpenseAmount;
            });

            this.itemSelected.emit(this.expenseCategoryItem);

        } else {
            this.itemSelected.emit(this.expenseCategoryItem);
        }
    }

  navigateToExpensePage() {

    // send this.expenseCategoryItem.key as parameter
  }
}
