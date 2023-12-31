import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { Messages } from 'src/app/common/message';
import { Constants } from 'src/app/configs/app.config';
import { ToastTypes } from 'src/app/core/enums';
import { IResetPasswordDto } from 'src/app/core/interfaces';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { PreLoaderService } from 'src/app/core/services/preloader.service';
import { PasswordValidator } from 'src/app/core/validators/password.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  token = '';
  email = '';
  isNewEyeIconVisible = false;
  isConfirmEyeIconVisible = false;
  changePasswordForm: FormGroup = new FormGroup({});

  constructor(private readonly fb: FormBuilder,
    public readonly constants: Constants,
    private readonly service: AuthenticationService,
    private readonly toast: MessageService,
    private readonly router: Router,
    public readonly message: Messages,
    private readonly activatedRouter: ActivatedRoute,
    private readonly validator: PasswordValidator,
    private readonly preLoaderService: PreLoaderService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.activatedRouter.queryParams.pipe(take(1)).subscribe(params => {
      const decodedToken = decodeURIComponent(params['token']);
      const token = decodedToken.replaceAll(' ', '+');
      this.token = token;
      this.email = params['email'];
    });
  }

  onSubmit() {
    this.preLoaderService.show();
    const resetPasswordData: IResetPasswordDto = {
      email: this.email,
      token: this.token,
      password: this.changePasswordForm.getRawValue().newPassword
    };

    this.service.resetPassword(resetPasswordData).subscribe({
      next: () => {
        this.preLoaderService.hide();
        this.toast.add({
          severity: ToastTypes.SUCCESS,
          summary: 'Your password has been changed successfully! Please login again.'
        });        

        this.router.navigateByUrl('');
      },

      error: (errorResponse) => {
        this.preLoaderService.hide();
        const errorObject = errorResponse.error;
        
        // Iterate through the keys in the error object
        for (const key in errorObject) {
          if (Object.prototype.hasOwnProperty.call(errorObject, key)) {
            const errorMessage = errorObject[key];
            // Display or handle the error message as needed
            this.toast.add({
              severity: ToastTypes.ERROR,
              summary: errorMessage
            });
          }
        }
      }
    })
  }

    /**
     * Toggles the visibility of the confirm password input's eye icon.
     * If the icon is currently visible, it will be hidden and vice versa.
     */
    toggleConfirmPasswordVisibility() {
      this.isConfirmEyeIconVisible = !this.isConfirmEyeIconVisible;
    }
  
    /**
     * Toggles the visibility of the new password input's eye icon.
     * If the icon is currently visible, it will be hidden and vice versa.
     */
    toggleNewPasswordVisibility() {
      this.isNewEyeIconVisible = !this.isNewEyeIconVisible;
    }


  /**
   * Builds a form using the FormGroup class from Angular's Reactive Forms API.
   */
  buildForm() {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        this.validator.passwordValidator(
          this.constants.passwordPatternAllowedCharacters
        ),
        Validators.pattern(this.constants.passwordPattern),
        Validators.maxLength(15)
      ]
    ],
    confirmPassword: ['', [
      Validators.required,
      () => {
        const formData = this.changePasswordForm.getRawValue();
        return formData.newPassword === formData.confirmPassword ? null : { passwordMismatch: true };
      }
    ]]
    })
  }
}
