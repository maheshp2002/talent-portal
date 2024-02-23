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
      this.router.navigate(['user/jobs']);
      console.error('WebSocket error:', error);
    };
  
    this.websocket.onclose = () => {
      console.log('WebSocket connection closed');
      // You can handle the closed connection here if needed
    };
  
    this.websocket.onopen = () => {
      if (this.websocket) { 
        // Convert the passport image to base64 format
        const base64Data = this.convertToBase64(passportImage);
        // Check if this.websocket is defined before sending data
        if (this.websocket) {
          // Send the base64-encoded image to the server
          this.websocket.send(base64Data);
          setTimeout(() => {              
            this.preloaderService.hide();
          }, 4000);
        } else {
          console.error('WebSocket connection is not defined.');
        }
      }
    }
  }
  
  // Function to convert image to base64 format
  convertToBase64(passportImage: string | ArrayBufferLike | Blob | ArrayBufferView): string {
    let base64Data = '';
    if (typeof passportImage === 'string') {
      // If the input is already a base64 string, use it directly
      base64Data = passportImage;
    } else if (passportImage instanceof Blob) {
      // If the input is a Blob, read it as data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Data = reader.result as string;
      };
      reader.readAsDataURL(passportImage);
    } else {
      // For other types of input, such as ArrayBuffer or ArrayBufferView, convert to Blob first
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

  // For pop up confirm
  setConfirmDialogShow(isShow: boolean) {
    this.isConfirmDialogShowSubject.next(isShow);
  }

  getConfirmDialogShow(): Observable<boolean> {
    return this.isConfirmDialogShowSubject.asObservable();
  }
}
