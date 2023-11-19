import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {MymUtil} from "../../shared/util/MymUtil";
import {UserRequest} from "../../shared/models/request/UserRequest";
import {LoginRequest} from "../../shared/models/request/LoginRequest";
import {MymApiResponse} from "../../shared/models/response/MymApiResponse";
import {UserResponse} from "../../shared/models/response/UserResponse";
import {TokenResponse} from "../../shared/models/response/TokenResponse";
import {PasswordResetRequest} from "../../shared/models/request/PasswordResetRequest";

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationService {

  private loginUrl = `${environment.apiUrl}/mym/app/users/login`;
  private userBaseUrl: string = `${environment.apiUrl}/mym/api/users`;

  constructor(private httpClient: HttpClient) {
  }


  // register or create user
  registerUser(userRequest: UserRequest): Observable<any> {

    let url: string = `${this.userBaseUrl}/create`;

    console.log("Create User post request")
    return this.httpClient.post<MymApiResponse<UserResponse>>(url, userRequest, {
      observe: "response",
      headers: MymUtil.getHeaders()
    });
  }

  loginUser(loginRequest: LoginRequest) {

    let body = new FormData();
    body.append("username", loginRequest.emailId);
    body.append("password", loginRequest.password);

    return this.httpClient.post<TokenResponse>(this.loginUrl, body, {observe: "response"});
  }

  forgotPassword(email: string) {

    let params = new HttpParams().set("email", email);

    return this.httpClient.post<MymApiResponse<string>>(
      `${this.userBaseUrl}/password/forgot`,
      {observe: "response", headers: MymUtil.getHeaders(), params: params}
    );
  }

  passwordReset(passwordResetRequest: PasswordResetRequest) {

    return this.httpClient.put<MymApiResponse<string>>(
      `${this.userBaseUrl}/password/reset`,
      passwordResetRequest,
      {
        observe: "response",
        headers: MymUtil.getHeaders(),
        withCredentials: true
      }
    )
  }

  updateEmail(email: string) {

    let updateEmailRequest: {
      email: string
    } = {
      email: email
    }

    return this.httpClient.put<MymApiResponse<string>>(
      `${this.userBaseUrl}/update/email`,
      updateEmailRequest,
      {
        observe: "response",
        headers: MymUtil.getHeaders(),
      }
    )
  }

  updateUserBasicDetails(name: string) {

    let updateUserBasicDetailRequest: {
      name: string
    } = {
      name: name
    }

    return this.httpClient.put<MymApiResponse<UserResponse>>(
      `${this.userBaseUrl}/update/basic`,
      updateUserBasicDetailRequest,
      {
        observe: "response",
        headers: MymUtil.getHeaders(),
      }
    )
  }

  verifyEmailOtp(otp: string) {

    let params = new HttpParams().set("otp", otp);

    return this.httpClient.post<MymApiResponse<TokenResponse>>(
      `${this.userBaseUrl}/update/email/verify/otp`,
      null,
      {
        observe: "response",
        headers: MymUtil.getHeaders(),
        params: params
      }
    )
  }

  getUserInformation() {

    return this.httpClient.get<MymApiResponse<UserResponse>>(`${this.userBaseUrl}/details`, {
      observe: "response",
      headers: MymUtil.getHeaders(),
      withCredentials: true
    })
  }


}
