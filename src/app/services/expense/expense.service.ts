import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {FilterRequest} from "../../shared/models/request/FilterRequest";
import {MymUtil} from "../../shared/util/MymUtil";
import {MymApiResponse} from "../../shared/models/response/MymApiResponse";
import {TotalSumResponse} from "../../shared/models/request/TotalSumResponse";
import {PageableResponse} from "../../shared/models/response/PageableResponse";
import {ExpenseResponse} from "../../shared/models/response/ExpenseResponse";
import {ExpenseRequest} from "../../shared/models/request/ExpenseRequest";

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private baseUrl = `${environment.apiUrl}/mym/api/expenses`;

  constructor(private httpClient: HttpClient) {
  }

  getExpensesList(
    filterRequest: FilterRequest, page: number, size: number, sort: string
  ) {

    let params = new HttpParams()
      .append("page", page)
      .append("size", size)
      .append("sort", sort)

    return this.httpClient.post<MymApiResponse<PageableResponse<ExpenseResponse>>>(
      `${this.baseUrl}`, filterRequest, {
        observe: "response",
        params: params,
        headers: MymUtil.getHeaders(),
        withCredentials: true
      }
    )
  }

  createNewExpense(
    expenseRequest: ExpenseRequest
  ) {

    return this.httpClient.post<MymApiResponse<ExpenseResponse>>(
      `${this.baseUrl}/new/create`, expenseRequest, {
        observe: "response",
        withCredentials: true,
        headers: MymUtil.getHeaders()
      }
    )
  }

  getExpenseByKey(key: string) {

    let params = new HttpParams()
      .append("key", key);

    return this.httpClient.get<MymApiResponse<ExpenseResponse>>(
      `${this.baseUrl}/key`, {
        params: params,
        headers: MymUtil.getHeaders(),
        withCredentials: true
      }
    );
  }

  updateExpense(expenseRequest: ExpenseRequest) {

    if (expenseRequest.key === null || expenseRequest.key.trim() === '') {
      throw new Error("Please add expense key in the request");
    }

    return this.httpClient.post<MymApiResponse<ExpenseResponse>>(
      `${this.baseUrl}/new/create`, expenseRequest, {
        observe: "response",
        withCredentials: true,
        headers: MymUtil.getHeaders()
      }
    );
  }

  deleteExpense(key: string) {

    let params = new HttpParams()
      .append("key", key);

    return this.httpClient.delete(
      `${this.baseUrl}/key`, {
        params: params,
        headers: MymUtil.getHeaders(),
        withCredentials: true
      }
    );
  }

  getTotalExpenseAmountSum(
    filterRequest: FilterRequest
  ) {

    return this.httpClient.post<MymApiResponse<TotalSumResponse>>(
      `${this.baseUrl}/amount/sum`,
      filterRequest,
      {
        observe: "response",
        withCredentials: true,
        headers: MymUtil.getHeaders()
      }
    );
  }


}
