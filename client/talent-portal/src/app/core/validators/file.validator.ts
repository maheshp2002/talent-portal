import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class FileValidator {
    /**
     * A validator function that checks whether the file size is greater than the mentioned fileSizeInBytes.
     *
     * @param fileSizeInBytes The maximum file size.
     */
    fileSizeValidator(fileSizeInBytes: number): ValidatorFn {
        return (
            control: AbstractControl
        ): { [key: string]: boolean } | null => {
            const controlValue = control.value;
            return controlValue?.size > fileSizeInBytes ? { invalidFileSize: true } : null;
        }
    }

    /**
     * A validator function that checks whether the file type is equal the mentioned pdfTypeFile.
     *
     * @param pdfTypeFile The type of file.
     */
    fileTypeValidator(): ValidatorFn {
        return (
            control: AbstractControl
        ): { [key: string]: boolean } | null => {
            const controlValue = control.value;
            return (!controlValue?.type?.startsWith('application/pdf') || controlValue?.type?.startsWith('image/*')) && controlValue?.type !== undefined ? { invalidFileType: true } : null;
        }
    }
}
