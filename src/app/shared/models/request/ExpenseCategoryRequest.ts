export interface ExpenseCategoryRequest {

  categoryName: string,
  categoryDescription: string,
  imageUrl: string,
  key?: string // only required for editing
}
