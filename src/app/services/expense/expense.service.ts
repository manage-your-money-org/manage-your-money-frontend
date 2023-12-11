import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {FilterRequest} from "../../shared/models/request/FilterRequest";
import {MymUtil} from "../../shared/util/MymUtil";
import {MymApiResponse} from "../../shared/models/response/MymApiResponse";
import {TotalSumResponse} from "../../shared/models/request/TotalSumResponse";

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {

    private baseUrl = `${environment.apiUrl}/mym/api/expenses`;

    constructor(private httpClient: HttpClient) {
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
