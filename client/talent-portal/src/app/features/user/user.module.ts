import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { UserRoutingModule } from './user-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OnlineExamLandingComponent } from './online-exam-landing/online-exam-landing.component';
import { ExamComponent } from './exam/exam.component';
import { ErrorMessageComponent } from 'src/app/shared/error-message/error-message.component';
import { ConfirmationService } from 'primeng/api';
import { HighlightModule } from 'ngx-highlightjs';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';
import { JobSearchComponent } from './job-search/job-search.component';
import { CircleProgressOptions, NgCircleProgressModule } from 'ng-circle-progress';
import { ResultComponent } from './result/result.component';
import { AttendedExamsComponent } from './attended-exams/attended-exams.component';

@NgModule({
  declarations: [
    HomepageComponent,
    UserLayoutComponent,
    NavbarComponent,
    OnlineExamLandingComponent,
    ExamComponent,
    JobSearchComponent,
    ResultComponent,
    AttendedExamsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ErrorMessageComponent,
    HighlightModule,
    ConfirmDialogModule,
    SharedModule,
    DialogModule,
    FileUploadModule,
    TableModule,
    FontAwesomeModule,
    TooltipModule,
    NgCircleProgressModule
  ],
  providers: [ConfirmationService, CircleProgressOptions]
})
export class UserModule { }
