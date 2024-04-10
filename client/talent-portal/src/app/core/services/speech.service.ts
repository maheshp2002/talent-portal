import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  speaking: boolean = false;

  toggleSpeech(message: string) {
    if (this.speaking) {
      this.speaking = false;
      speechSynthesis.cancel();
    } else {
      this.speaking = true;
      let msg = new SpeechSynthesisUtterance();
      msg.text = message;

      msg.addEventListener('end', () => {
        this.speaking = false;
      });

      speechSynthesis.speak(msg);
    }    
  }
}
