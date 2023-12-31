import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Messages } from 'src/app/common/message';
import { Constants } from 'src/app/configs/app.config';
import { ToastTypes } from 'src/app/core/enums';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { PreLoaderService } from 'src/app/core/services/preloader.service';
import { PasswordValidator } from 'src/app/core/validators/password.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{
  isPasswordVisible = false;
  registerForm: FormGroup = new FormGroup({});

  constructor(private readonly fb: FormBuilder,
    public readonly constants: Constants,
    public readonly message: Messages,
    private readonly service: AuthenticationService,
    private readonly router: Router,
    private readonly validator: PasswordValidator,
    private readonly toast: MessageService,
    private readonly preLoaderService: PreLoaderService
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
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
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
    this.preLoaderService.show();
    this.service.register(this.registerForm.value).subscribe({
      next: () => {
        this.preLoaderService.hide();
        this.router.navigateByUrl('');
        this.toast.add({
          severity: ToastTypes.SUCCESS,
          summary: 'User registered successfully'
        });
        this.toast.add({
          severity: ToastTypes.SUCCESS,
          summary: 'You can now login with this account'
        });
    },

    error: () => {
      this.preLoaderService.hide();
      this.toast.add({
        severity: ToastTypes.ERROR,
        summary: 'An error occurred during registration'
      });
    }
  })
}
}
