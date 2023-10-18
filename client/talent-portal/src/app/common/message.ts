import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class Messages {
    requiredField = 'This field is required'
	invalidPassword = 'Invalid password. Password must contain uppercase, lowercase, and a special character'
    allowedCharacters = 'Allow only following special characters @ # $ % ^ & * – _ + = [ ] { } | \\ : ‘ , . ? / ` ~ “ < > ( ) ; “"'
    passwordMaxLength = 'Password cannot exceed 15 characters'
    passwordMinLength = 'Minimum length is 8 characters'
    minLength = 'Minimum length is 3 characters'
    emailMaxLength = 'Password cannot exceed 150 characters'
    invalidEmail = "Invalid email"
}
