import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
class RouterGuardService {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return true;
  }
}

export const IsAllowed: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(RouterGuardService).canActivate(route, state);
}
