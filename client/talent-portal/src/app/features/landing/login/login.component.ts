import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Messages } from 'src/app/common/message';
import { Constants } from 'src/app/configs/app.config';
import { ToastTypes } from 'src/app/core/enums';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { TokenHelper } from 'src/app/core/utilities/helpers/token.helper';
import { PasswordValidator } from 'src/app/core/validators/password.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isPasswordVisible = false;
  loginForm: FormGroup = new FormGroup({});

  constructor(private readonly fb: FormBuilder,
    public readonly constants: Constants,
    public readonly message: Messages,
    private readonly service: AuthenticationService,
    private readonly router: Router,
    private readonly validator: PasswordValidator,
    private readonly toast: MessageService,
    private tokenHelper: TokenHelper
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * Toggles the visibility of the password input's eye icon.
   * If the icon is currently visible, it will be hidden and vice versa.
   */
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  /**
   * Builds a form using the FormGroup class from Angular's Reactive Forms API.
   */
  buildForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(this.constants.emailPattern)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.validator.passwordValidator(
          this.constants.passwordPatternAllowedCharacters
        ),
        Validators.pattern(this.constants.passwordPattern),
        Validators.maxLength(15)
      ]
      ]
    })
  }

  onSubmit() {
    this.service.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.tokenHelper.setToken(response.result);
        const role = this.tokenHelper.getDecodedToken().role;
        this.toast.add({
          severity: ToastTypes.SUCCESS,
          summary: 'Login successful'
        });        
  
        if (role === "User") {
          this.router.navigateByUrl('/user');
        } else {
          this.router.navigateByUrl('/admin/homepage');
        }
      },

      error: () => {
        this.toast.add({
          severity: ToastTypes.ERROR,
          summary: 'An error occurred during login'
        });
      }
    });
  }
}
