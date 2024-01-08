export interface ExpenseRequest {
  amount: number,
  spentOn: string,
  expenseDate: number,
  categoryKey: string,
  paymentMethodsKeys: string[],
  newPaymentMethod: string[],

  key: string // only for update
}
