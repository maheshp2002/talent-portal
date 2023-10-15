import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isPasswordVisible = false;

  /**
   * Toggles the visibility of the password input's eye icon.
   * If the icon is currently visible, it will be hidden and vice versa.
   */
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
