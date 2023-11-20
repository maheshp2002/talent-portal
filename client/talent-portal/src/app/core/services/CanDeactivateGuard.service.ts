import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
