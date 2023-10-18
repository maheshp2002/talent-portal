import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Messages } from 'src/app/common/message';
import { Constants } from 'src/app/configs/app.config';
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
    // private readonly service: AuthenticationService,
    private readonly router: ActivatedRoute,
    private readonly validator: PasswordValidator
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
}
