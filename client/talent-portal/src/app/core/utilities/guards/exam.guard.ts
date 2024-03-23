import { Injectable } from '@angular/core';
import { CanDeactivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FullscreenService } from '../../services/fullscreen.service';
import { ExamComponent } from 'src/app/features/user/exam/exam.component';

@Injectable({
  providedIn: 'root'
})
export class ExamGuard implements CanDeactivate<ExamComponent> {
  constructor(private fullscreenService: FullscreenService, private router: Router) {}

  canDeactivate(component: ExamComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (this.fullscreenService.isFullscreen) {
      this.fullscreenService.exitFullscreen();
    }
    return true;
  }
}
