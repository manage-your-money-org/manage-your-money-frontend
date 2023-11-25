import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {UserAuthenticationService} from "./user-authentication/user-authentication.service";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
class RouterGuardService {

  constructor(private authenticationService: UserAuthenticationService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authenticationService.getUserInformation().pipe(
      map((response) => {
        if (response.status === 200) {
          return true;
        }
        this.router.navigate(['/login'])
        return false;
      })
    );
  }
}

export const IsAllowed: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(RouterGuardService).canActivate(route, state);
}
