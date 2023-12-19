import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileDialogService {
  private isDialogVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isDialogVisible$: Observable<boolean> = this.isDialogVisibleSubject.asObservable();

  constructor() {}

  setIsDialogVisible(isVisible: boolean): void {
    this.isDialogVisibleSubject.next(isVisible);
  }
}
