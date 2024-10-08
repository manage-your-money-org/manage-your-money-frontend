import {NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from './login/login.component';
import {HttpClientModule} from "@angular/common/http";
import {ExpenseCategoryComponent} from './expense-category/expense-category.component';
import {RegisterUserComponent} from './register-user/register-user.component';
import {UserComponent} from './user/user.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {NgOptimizedImage} from "@angular/common";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatRippleModule} from "@angular/material/core";
import {MatDialogModule} from "@angular/material/dialog";
import {MatToolbarModule} from "@angular/material/toolbar";
import {ExpenseCategoryItemComponent} from './expense-category-item/expense-category-item.component';
import {AddEditExpenseCategoryComponent} from './add-edit-expense-category/add-edit-expense-category.component';
import {UnsplashImageItemComponent} from './unsplash-image-item/unsplash-image-item.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {DeleteDialogComponent} from './delete-dialog/delete-dialog.component';
import {ExpenseComponent} from './expense/expense.component';
import {AddEditExpenseComponent} from './add-edit-expense/add-edit-expense.component';
import {ExpensePaymentMethodItemComponent} from './expense-payment-method-item/expense-payment-method-item.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {
  SelectExpenseCategoryDialogComponent
} from './select-expense-category-dialog/select-expense-category-dialog.component';
import {MatMenuModule} from "@angular/material/menu";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ExpenseCategoryComponent,
    RegisterUserComponent,
    UserComponent,
    ForgotPasswordComponent,
    ExpenseCategoryItemComponent,
    AddEditExpenseCategoryComponent,
    UnsplashImageItemComponent,
    DeleteDialogComponent,
    ExpenseComponent,
    AddEditExpenseComponent,
    ExpensePaymentMethodItemComponent,
    SelectExpenseCategoryDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgOptimizedImage,
    BrowserAnimationsModule,
    MatIconModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatDividerModule,
    MatListModule, MatRippleModule, MatDialogModule, MatToolbarModule, MatProgressBarModule, MatChipsModule,
    MatAutocompleteModule, ReactiveFormsModule, MatMenuModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
