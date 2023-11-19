import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ExpenseCategoryRequest} from "../../shared/models/request/ExpenseCategoryRequest";
import {MymUtil} from "../../shared/util/MymUtil";

@Injectable({
  providedIn: 'root'
})
export class ExpenseCategoryService {

  private baseUrl = `${environment.apiUrl}/mym/api/expensecategories`;

  constructor(private httpClient: HttpClient) {
  }

  createNewExpenseCategory(expenseCategoryRequest: ExpenseCategoryRequest) {

    return this.httpClient.post(`${this.baseUrl}/new/create`,
      expenseCategoryRequest, {
        observe: "response", withCredentials: true, headers: MymUtil.getHeaders()
      });
  }

  updateExpenseCategory(expenseCategoryRequest: ExpenseCategoryRequest) {

    return this.httpClient.put(
      `${this.baseUrl}/update`,
      expenseCategoryRequest,
      {observe: "response", withCredentials: true, headers: MymUtil.getHeaders()}
    );
  }

  getExpenseCategoryByKey(key: string) {

    let params = new HttpParams().set("key", key);

    return this.httpClient.get(`${this.baseUrl}/key`, {
      observe: "response",
      params: params,
      withCredentials: true,
      headers: MymUtil.getHeaders()
    });
  }



}
