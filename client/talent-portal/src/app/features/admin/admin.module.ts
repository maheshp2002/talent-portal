import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CheckboxModule } from 'primeng/checkbox';
import { HighlightModule } from 'ngx-highlightjs';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewAllJobComponent } from './view-all-job/view-all-job.component';
import { TableModule } from 'primeng/table';
import { ExamResultComponent } from './exam-result/exam-result.component';
import { CounsellingComponent } from './counselling/counselling.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageModalComponent } from './image-modal/image-modal.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    HomepageComponent,
    NavbarComponent,
    ViewAllJobComponent,
    ExamResultComponent,
    CounsellingComponent,
    ImageModalComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FontAwesomeModule,
    CheckboxModule,
    HighlightModule,
    DialogModule,
    ButtonModule,
    SharedModule,
    TableModule,
    TooltipModule,
    MatDialogModule,
    InputTextareaModule
  ]
})
export class AdminModule { }
