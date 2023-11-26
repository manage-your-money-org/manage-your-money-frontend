import {NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {LoginComponent} from './login/login.component';
import {HttpClientModule} from "@angular/common/http";
import {ExpenseCategoryComponent} from './expense-category/expense-category.component';
import {RegisterUserComponent} from './register-user/register-user.component';
import {UserComponent} from './user/user.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {AppHeaderComponent} from './app-header/app-header.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {NgOptimizedImage} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ExpenseCategoryComponent,
    RegisterUserComponent,
    UserComponent,
    ForgotPasswordComponent,
    AppHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgOptimizedImage
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
