import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

  constructor(private userService: UserService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const storageSessionKey = sessionStorage.getItem('sessionKey') || '';
    const userId = this.userService.user.getValue().personId;
    if (storageSessionKey !== 'fb606d4b-b003-4d5c-807b-1fd2653293a0' || userId !== 'fb606d4b-b003-4d5c-807b-1fd2653293a0') {
      return this.router.parseUrl('login-page');
    } else {
      return true;
    }
  }

}
