import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SpeechService } from 'src/app/core/services/speech.service';

@Component({
  selector: 'app-robot',
  standalone: true,
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.scss']
})
export class RobotComponent {
    
  constructor(public speechService: SpeechService) { }
}
