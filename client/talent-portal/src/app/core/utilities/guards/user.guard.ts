import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenHelper } from '../helpers/token.helper';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {

    constructor(
        private tokenHelper: TokenHelper,
        private router: Router) { }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const hasToken = this.tokenHelper.hasToken();
        const role = this.tokenHelper.getDecodedToken();
        console.log(hasToken);
        if (!hasToken) {
            this.router.navigate(['']);
            return false;
        }
        if (role.role !== "User") {
            this.router.navigate(['']);
            return false;
            
        }
        return true;
    }

}