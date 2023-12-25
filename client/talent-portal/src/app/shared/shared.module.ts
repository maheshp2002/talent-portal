import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { NoDataFoundComponent } from './no-data-found/no-data-found.component';
import { PreLoaderComponent } from './pre-loader/pre-loader.component';
import { PoperComponent } from './poper/poper.component';
import { PhoneNumberCodeDirective } from '../core/directives';

@NgModule({
  declarations: [
    PhoneNumberCodeDirective,
    PreLoaderComponent,
    PoperComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorMessageComponent,
    NoDataFoundComponent,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ErrorMessageComponent,
    NoDataFoundComponent,
    PreLoaderComponent,
    PoperComponent,
    PhoneNumberCodeDirective
  ]
})
export class SharedModule { }
