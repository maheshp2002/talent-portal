import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PreLoaderService } from './preloader.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastTypes } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class DetectionService {
  private websocket: WebSocket | undefined;
  private isConfirmDialogShowSubject = new Subject<boolean>();

  constructor(
    private readonly preloaderService: PreLoaderService,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}

  startDetection() {
    this.websocket = new WebSocket('ws://localhost:8765');

    // this.websocket.onmessage = (event) => {
    //   console.log('Detected object:', event.data); // Log the detected object in the browser console
    // };
    this.websocket.onerror = (error) => {
      this.setConfirmDialogShow(true); 
      this.messageService.add({
        severity: ToastTypes.ERROR,
        summary: 'An error occurred'
      });
      this.router.navigate(['user/jobs']);
      console.error('WebSocket error:', error);
    };

    this.websocket.onclose = () => {
      console.log('WebSocket connection closed');
      // You can handle the closed connection here if needed
    };

    this.websocket.onopen = () => {
      setTimeout(() => {              
        this.preloaderService.hide();
      }, 4000);
    }

  }

  stopDetection() {
    if (this.websocket) {
      this.websocket.close();
    }
  }

  getWebSocket(): WebSocket | undefined {
    return this.websocket;
  }

  getDetectedObject(): Observable<any> {
    return new Observable<any>((observer) => {
      this.websocket?.addEventListener('message', (event) => {
        observer.next(event.data);
      });
    });
  }

  // For pop up confirm
  setConfirmDialogShow(isShow: boolean) {
    this.isConfirmDialogShowSubject.next(isShow);
  }

  getConfirmDialogShow(): Observable<boolean> {
    return this.isConfirmDialogShowSubject.asObservable();
  }
}
