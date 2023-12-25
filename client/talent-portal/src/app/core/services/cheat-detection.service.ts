import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PreLoaderService } from './preloader.service';

@Injectable({
  providedIn: 'root'
})
export class DetectionService {
  private websocket: WebSocket | undefined;

  constructor(
    private readonly preloaderService: PreLoaderService
  ) {}

  startDetection() {
    this.websocket = new WebSocket('ws://localhost:8765');

    // this.websocket.onmessage = (event) => {
    //   console.log('Detected object:', event.data); // Log the detected object in the browser console
    // };
    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.websocket.onclose = () => {
      console.log('WebSocket connection closed');
      // You can handle the closed connection here if needed
    };

    this.websocket.onopen = () => {
      console.log('Websocket started');
      setTimeout(() => {
        this.preloaderService.hide();
      }, 2000);
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
}
