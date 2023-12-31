import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Constants } from 'src/app/configs/app.config';
import { ToastTypes } from 'src/app/core/enums';
import { Messages } from 'src/app/common/message';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { PreLoaderService } from 'src/app/core/services/preloader.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  isPasswordVisible = false;
  forgotPasswordForm: FormGroup = new FormGroup({});

  constructor(private readonly fb: FormBuilder,
    public readonly constants: Constants,
    private readonly service: AuthenticationService,
    private readonly toast: MessageService,
    private readonly router: Router,
    public readonly message: Messages,
    private readonly preLoaderService: PreLoaderService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }


  /**
   * Builds a form using the FormGroup class from Angular's Reactive Forms API.
   */
  buildForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(this.constants.emailPattern)]]
    })
  }

  onSubmit() {
    this.preLoaderService.show();
    this.service.forgotPassword(this.forgotPasswordForm.get('email')?.value).subscribe({
      next: (response: any) => {
        this.preLoaderService.hide();
        this.toast.add({
          severity: ToastTypes.SUCCESS,
          summary: `A mail with password reset link has been sent to you email '${this.forgotPasswordForm.get('email')?.value}'.`
        });        

        this.router.navigateByUrl('');
      },

      error: () => {
        this.preLoaderService.hide();
        this.toast.add({
          severity: ToastTypes.ERROR,
          summary: 'An error occurred during forgot password'
        });
      }
    });
  }
}
