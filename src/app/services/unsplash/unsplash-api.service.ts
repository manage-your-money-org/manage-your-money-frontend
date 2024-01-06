import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {UnsplashResponse} from "../../shared/models/response/Unsplash/UnsplashResponse";

@Injectable({
  providedIn: 'root'
})
export class UnsplashApiService {

  constructor(private httpClient: HttpClient) {
  }

  searchPhoto(
    query: string,
    page: number,
    per_page: number
  ) {

    const params: HttpParams = new HttpParams()
      .append("query", query)
      .append("page", page)
      .append("per_page", per_page)

    const headers: HttpHeaders = new HttpHeaders()
      .append("Accept-Version", "v1")
      .append("Authorization", `Client-ID ${environment.unsplashClientId}`)

    return this.httpClient.get<UnsplashResponse>(
      `https://api.unsplash.com/search/photos`,
      {
        observe: "response",
        params: params,
        headers: headers
      }
    );
  }

}
