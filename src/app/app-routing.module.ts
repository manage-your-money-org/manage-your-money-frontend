import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterUserComponent} from "./register-user/register-user.component";
import {UserComponent} from "./user/user.component";
import {IsAllowed} from "./services/router-guard.service";
import {ExpenseCategoryComponent} from "./expense-category/expense-category.component";
import {AddEditExpenseCategoryComponent} from "./add-edit-expense-category/add-edit-expense-category.component";
import {ExpenseComponent} from "./expense/expense.component";

const routes: Routes = [
  {path: '', component: ExpenseCategoryComponent, canActivate: [IsAllowed]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterUserComponent},
  // {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'user', component: UserComponent, canActivate: [IsAllowed]},
  {path: 'expense-categories', component: ExpenseCategoryComponent, canActivate: [IsAllowed]},
  {path: 'add-edit-expense-category/:key', component: AddEditExpenseCategoryComponent, canActivate: [IsAllowed]},
  {path: 'expenses/:expenseCategoryKey', component: ExpenseComponent, canActivate: [IsAllowed]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
