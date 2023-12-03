import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {UserAuthenticationService} from "./user-authentication/user-authentication.service";
import {catchError, map, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
class RouterGuardService {

  constructor(private authenticationService: UserAuthenticationService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.authenticationService.getUserInformation().pipe(
      map((response) => {
        console.log("Router guard: " + response.status)
        if (response.status === 200) {
          return true;
        }
        this.router.navigate(["/login"])
        return false;
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle the error here
        console.error('An error occurred:', error.message);
        this.router.navigate(["/login"])
        return throwError(() => 'Something went wrong; please try again later.');
      })
    );
  }
}

export const IsAllowed: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(RouterGuardService).canActivate(route, state);
}
