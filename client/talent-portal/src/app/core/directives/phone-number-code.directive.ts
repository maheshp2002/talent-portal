import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPhoneNumberCode]'
})
export class PhoneNumberCodeDirective {

  constructor(private el: ElementRef<HTMLInputElement>) { }

  @HostListener('focus', ['$event'])
  onFocus(event: Event) {
    this.formatValue();
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    this.formatValue();
  }

  @HostListener('keydown.backspace', ['$event'])
  onBackspace(event: KeyboardEvent) {
    if (this.el.nativeElement.value === '+91') {
      this.el.nativeElement.value = '';
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  private formatValue() {
    const inputValue = this.el.nativeElement.value;
    const countryCode = '+91';
    if (!inputValue && inputValue !== countryCode) {
      this.el.nativeElement.value = countryCode;
    } else if (inputValue && !inputValue.startsWith(countryCode)) {
      this.el.nativeElement.value = countryCode + inputValue.slice(countryCode.length);
    }
  }
}
