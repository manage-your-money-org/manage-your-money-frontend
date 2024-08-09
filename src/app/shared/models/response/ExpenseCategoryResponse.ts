export interface ExpenseCategoryResponse {

  categoryName: string,
  categoryDescription: string,
  imageUrl: string,
  created: number,
  modified: number,
  uid: string
  key: string

  // not included in response
  thisMonthExpense: number,
  totalExpense: number
}
