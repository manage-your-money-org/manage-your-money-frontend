import {ExpenseCategoryResponse} from "./ExpenseCategoryResponse";
import {PaymentMethod} from "./PaymentMethod";

export interface ExpenseResponse {

  amount: number,
  created: Date,
  modified: Date,
  spentOn: string,
  uid: string,
  key: string,
  expenseDate: 0,
  category: ExpenseCategoryResponse,
  paymentMethods: PaymentMethod[]
}