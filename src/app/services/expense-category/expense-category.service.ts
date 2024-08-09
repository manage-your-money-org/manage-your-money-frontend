import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ExpenseCategoryRequest} from "../../shared/models/request/ExpenseCategoryRequest";
import {MymUtil} from "../../shared/util/MymUtil";
import {MymApiResponse} from "../../shared/models/response/MymApiResponse";
import {ExpenseCategoryResponse} from "../../shared/models/response/ExpenseCategoryResponse";
import {PageableResponse} from "../../shared/models/response/PageableResponse";

@Injectable({
  providedIn: 'root'
})
export class ExpenseCategoryService {

  private baseUrl = `${environment.apiUrl}/mym/api/expensecategories`;

  constructor(private httpClient: HttpClient) {
  }

  createNewExpenseCategory(expenseCategoryRequest: ExpenseCategoryRequest) {

    return this.httpClient.post<MymApiResponse<ExpenseCategoryResponse>>(`${this.baseUrl}/new/create`,
      expenseCategoryRequest, {
        observe: "response", withCredentials: true, headers: MymUtil.getHeaders()
      });
  }

  updateExpenseCategory(expenseCategoryRequest: ExpenseCategoryRequest) {

    return this.httpClient.put<MymApiResponse<ExpenseCategoryResponse>>(
      `${this.baseUrl}/update`,
      expenseCategoryRequest,
      {observe: "response", withCredentials: true, headers: MymUtil.getHeaders()}
    );
  }

  getExpenseCategoryByKey(key: string) {

    let params = new HttpParams().set("key", key);

    return this.httpClient.get<MymApiResponse<ExpenseCategoryResponse>>(`${this.baseUrl}/key`, {
      observe: "response",
      params: params,
      withCredentials: true,
      headers: MymUtil.getHeaders()
    });
  }

  //get all categories
  getAllCategories(page: number, size: number, sort: string) {

    let params = new HttpParams()
      .append("page", page)
      .append("size", size)
      .append("sort", sort)

    return this.httpClient.get<MymApiResponse<PageableResponse<ExpenseCategoryResponse>>>(
      `${this.baseUrl}`,
      {
        observe: "response",
        headers: MymUtil.getHeaders(),
        withCredentials: true,
        params: params
      }
    )
  }

  // delete category by key
  deleteExpenseCategoryByKey(key: string) {

    let params = new HttpParams().set("key", key);

    return this.httpClient.delete(
      `${this.baseUrl}/key`,
      {
        observe: "response",
        withCredentials: true,
        headers: MymUtil.getHeaders(),
        params: params
      }
    )
  }
}
