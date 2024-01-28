import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MymApiResponse} from "../../shared/models/response/MymApiResponse";
import {PaymentMethod} from "../../shared/models/response/PaymentMethod";
import {MymUtil} from "../../shared/util/MymUtil";

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private baseUrl = `${environment.apiUrl}/mym/api/payment-methods`;

  constructor(private httpClient: HttpClient) {
  }

  getAllPaymentMethodsOfUser() {

    return this.httpClient.get<MymApiResponse<PaymentMethod[]>>(
      `${this.baseUrl}`,
      {
        headers: MymUtil.getHeaders(),
        withCredentials: true
      }
    );
  }

}
