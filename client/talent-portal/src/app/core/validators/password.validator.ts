import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
	providedIn: 'root',
})
export class PasswordValidator{

	/**
	 * Returns a validator function that checks if a given password matches a given regular expression pattern.
	 *
	 * @param regexPassword The regular expression pattern to match against.
	 * @returns A ValidatorFn function that returns a validation error if the password doesn't match the pattern.
	 */
	passwordValidator(regexPassword: RegExp): ValidatorFn {
		return (
			control: AbstractControl
		): { [key: string]: boolean } | null => {
			const password = control.value;
			const isValid = regexPassword.test(password);
			return isValid ? null : { invalidPassword: true };
		};
	}
}
