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

  startDetection(passportImage: string | ArrayBufferLike | Blob | ArrayBufferView) {
    this.websocket = new WebSocket('ws://localhost:8765');
  
    this.websocket.onerror = (error) => {
      this.setConfirmDialogShow(true); 
      this.messageService.add({
        severity: ToastTypes.ERROR,
        summary: 'An error occurred'
      });
      console.error('WebSocket error:', error);
    };
  
    this.websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  
    this.websocket.onopen = () => {
      if (this.websocket) { 
        const base64Data = this.convertToBase64(passportImage);
        if (this.websocket) {
          this.websocket.send(base64Data);          
        } else {
          this.preloaderService.show();
          setTimeout(() => {
            this.router.navigate(['user/jobs']);
          }, 3000);
          console.error('WebSocket connection is not defined.');
          this.messageService.add({
            severity: ToastTypes.ERROR,
            summary: "An error occured!"
          });
        }
      }
    }
  }

  sendCameraFeed(base64Data: string) {
    if (this.websocket) {
      this.websocket.send("camera_feed," + base64Data);
    } else {
      console.error('WebSocket connection is not defined.');
    }
  }
  
  convertToBase64(passportImage: string | ArrayBufferLike | Blob | ArrayBufferView): string {
    let base64Data = '';
    if (typeof passportImage === 'string') {
      base64Data = passportImage;
    } else if (passportImage instanceof Blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Data = reader.result as string;
      };
      reader.readAsDataURL(passportImage);
    } else {
      const blob = new Blob([passportImage]);
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Data = reader.result as string;
      };
      reader.readAsDataURL(blob);
    }
    return base64Data;
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

  setConfirmDialogShow(isShow: boolean) {
    this.isConfirmDialogShowSubject.next(isShow);
  }

  getConfirmDialogShow(): Observable<boolean> {
    return this.isConfirmDialogShowSubject.asObservable();
  }
}
