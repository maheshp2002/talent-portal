import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { UserRoutingModule } from './user-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OnlineExamLandingComponent } from './online-exam-landing/online-exam-landing.component';
import { ExamComponent } from './exam/exam.component';
import { ErrorMessageComponent } from 'src/app/shared/error-message/error-message.component';
import { ConfirmationService } from 'primeng/api';
import { HighlightModule } from 'ngx-highlightjs';


@NgModule({
  declarations: [
    HomepageComponent,
    UserLayoutComponent,
    NavbarComponent,
    OnlineExamLandingComponent,
    ExamComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ErrorMessageComponent,
    HighlightModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService]
})
export class UserModule { }
