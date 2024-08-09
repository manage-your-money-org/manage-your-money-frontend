import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ExpenseCategoryService} from "../services/expense-category/expense-category.service";
import {ExpenseCategoryResponse} from "../shared/models/response/ExpenseCategoryResponse";
import {UnsplashApiService} from "../services/unsplash/unsplash-api.service";
import {UnsplashPhoto} from "../shared/models/response/Unsplash/UnsplashPhoto";
import {MymUtil} from "../shared/util/MymUtil";
import {ExpenseCategoryRequest} from "../shared/models/request/ExpenseCategoryRequest";

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
  imageUrl: string = '';
  created: number = new Date().getTime();
  isForEditing = true;
  errorMessage = '';


  // unsplash
  searchInput = '';
  unsplashPhotosList: UnsplashPhoto[] = [];
  currentPage = 0;
  pageSize = 15;
  isUnsplashError = false;
  unsplashErrorMessage = '';
  isLoading = false;
  isLastPage = false;
  selectedUnsplashItem: UnsplashPhoto;
  currentSearchInput = '';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private expenseCategoryService: ExpenseCategoryService,
              private unsplashAPIService: UnsplashApiService
  ) {
  }

  ngOnInit(): void {

    this.key = this.activatedRoute.snapshot.params["key"];

    if (this.key !== null && this.key.trim() !== "" && this.key.trim() !== "add") {

      this.isForEditing = true;

      // retrieve expense category

      this.expenseCategoryService.getExpenseCategoryByKey(this.key.trim()).subscribe({
        next: (response) => {

          console.log(response.status);
          console.log(response.body);
          this.expenseCategory = response.body.body;

          this.categoryName = this.expenseCategory.categoryName;
          this.categoryDescription = this.expenseCategory.categoryDescription;
          this.imageUrl = this.expenseCategory.imageUrl;
          this.created = this.expenseCategory.created;
        },
        error: (err) => {

          console.log(err);

          if (err.status === 403) {
            // permission denied error
            this.router.navigate(['login'])
          }
        }
      })
    } else {
      this.isForEditing = false;
    }

  }

  onSubmitButtonClicked() {

    this.errorMessage = '';

    if (this.isFormValid()) {

      const expenseCategoryRequest: ExpenseCategoryRequest = {
        categoryName: this.categoryName.trim(),
        categoryDescription: MymUtil.isStringValid(this.categoryDescription) ? this.categoryDescription.trim() : '',
        imageUrl: MymUtil.isStringValid(this.imageUrl) ? this.imageUrl.trim() : null,
        key: this.isForEditing ? this.expenseCategory.key : null
      }

      if (this.isForEditing) {

        this.expenseCategoryService.updateExpenseCategory(
          expenseCategoryRequest
        ).subscribe((response => {

          if (response.status === 200) {
            this.router.navigate(['expense-categories'])
          } else {
            this.errorMessage = response.body.message;
          }
        }));

      } else {

        this.expenseCategoryService.createNewExpenseCategory(expenseCategoryRequest)
          .subscribe((response => {

            if (response.status === 201) {
              this.router.navigate(['expense-categories'])
            } else {
              this.errorMessage = response.body.message;
            }
          }));
      }
    } else {
      this.errorMessage = "Please enter a valid category name";
    }
  }

  isFormValid(): boolean {

    return MymUtil.isStringValid(this.categoryName);
  }

  selectItem(item: UnsplashPhoto) {
    this.selectedUnsplashItem = item;
    this.imageUrl = this.selectedUnsplashItem.urls.regular;
  }

  toggleLoading = () => this.isLoading = !this.isLoading;

  onScroll() {

    console.log("On scrolled")

    this.isLoading = true;

    if (!this.isLastPage) {
      this.currentPage++;
      this.searchImage(true);
    } else {
      this.isLoading = false;
    }
  }

  trackByFn(index, item) {
    return item.id;
  }

  searchImage(isCalledByScroll: boolean) {

    if (this.searchInput.trim() !== '' && (isCalledByScroll || this.currentSearchInput !== this.searchInput)) {

      if (this.currentSearchInput !== this.searchInput) {
        this.unsplashPhotosList = [];
        this.isLastPage = false;
        this.currentPage = 0;
      }

      this.currentSearchInput = this.searchInput;

      this.toggleLoading();

      this.unsplashAPIService.searchPhoto(
        this.searchInput.trim(),
        this.currentPage,
        this.pageSize
      ).subscribe({

        next: (response) => {

          if (response.status === 200) {

            this.unsplashErrorMessage = '';
            this.isUnsplashError = false;

            this.isLastPage = this.currentPage === 0;

            this.unsplashPhotosList = [...this.unsplashPhotosList, ...response.body.results]

            this.toggleLoading();
          }
        },
        error: (err) => {

          this.unsplashErrorMessage = err.message;
          this.isUnsplashError = true;
        }
      });
    }
  }
}
