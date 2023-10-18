import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageComponent } from './error-message/error-message.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorMessageComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ErrorMessageComponent
  ]
})
export class SharedModule { }
