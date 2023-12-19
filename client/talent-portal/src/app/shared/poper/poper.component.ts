import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import Party from 'party-js';

@Component({
  selector: 'app-poper',
  templateUrl: './poper.component.html',
  styleUrls: ['./poper.component.scss']
})
export class PoperComponent implements AfterViewInit{
  @ViewChild('confettiContainer') confettiContainer!: ElementRef;

  ngAfterViewInit(): void {
    this.startConfetti();
  }

  startConfetti(): void {
    if (this.confettiContainer) {
      Party.confetti(this.confettiContainer.nativeElement, {
        count: Party.variation.range(50, 100),
      });
    }
  }
}
