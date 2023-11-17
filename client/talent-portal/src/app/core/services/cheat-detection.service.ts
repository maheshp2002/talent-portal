import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetectionService {
  private websocket: WebSocket | undefined;

  startDetection() {
    this.websocket = new WebSocket('ws://localhost:8765');

    this.websocket.onmessage = (event) => {
      console.log('Detected object:', event.data); // Log the detected object in the browser console
    };
  }

  stopDetection() {
    if (this.websocket) {
      this.websocket.close();
    }
  }
}
