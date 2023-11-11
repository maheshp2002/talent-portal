import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenHelper } from '../helpers/token.helper';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(
        private tokenHelper: TokenHelper,
        private router: Router) { }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const hasToken = this.tokenHelper.hasToken();
        const role = this.tokenHelper.getDecodedToken();
        console.log(hasToken);
        if (!hasToken) {
            this.router.navigate(['/login']);
            return false;
        }
        if (role.role !== "Admin") {
            this.router.navigate(['']);
            return false;
        }
        console.log(role);
        
        return true;
    }

}