// signalr.service.ts
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;
  private detectionEventSubject = new Subject<string>();
  public detectionEvent$ = this.detectionEventSubject.asObservable();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7163/hub/SignalRHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while establishing connection: ' + err));

    this.hubConnection.on('ReceiveDetectionEvent', (data: string) => {
      this.detectionEventSubject.next(data);
    });
  }
}
