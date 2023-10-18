import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IValidationMessage } from 'src/app/core/interfaces/IValidationMessage';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent {
  /**
   * An input decorator that specifies the name of the form control.
   */
  @Input() control: FormControl | any = new FormControl({});

  /**
   * An input decorator that specifies a mapping of validation error keys to error messages.
   */
  @Input() validationMessages: IValidationMessage = {};

  /**
   * A getter method that returns an error message for the specified form control if it has an error and has been touched.
   * Also it shows the server error that return from a api call.
   *
   * returns the error message for the specified form control if it has an error and has been touched,
   *  or `null` if there is no error.
   * Also return server error that thrown from the backend when the api call in not processed.
   */
  get errorMessage(): string | null {
    if (this.control && this.control.errors) {
      for (const key in this.control.errors) {
        if (this.control.errors.hasOwnProperty(key) && (!this.control.pristine || this.control.touched)) {
          return this.validationMessages[key];
        }
      }
    }
    return null;
  }
}
