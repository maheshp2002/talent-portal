import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class Constants {
	passwordPattern = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?\W).*$/;
	emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
	passwordPatternAllowedCharacters = /^(?:[\w@#$%^&*\-+=[\]{}|:',.?/`~“<>();"]+|\s*)$/;
	dateFormat = 'MM/dd/yyy';
	wholeNumberPattern = /^\d+$/;
	dateTimeFormat = 'MM/dd/yyy, hh:mm a';
	fileSizeInBytes = 1000000;
	allowedFileType = 'application/pdf';
	row = 10;
}

