import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { ConfirmationService } from 'primeng/api';
import { ViewAllJobComponent } from './view-all-job/view-all-job.component';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    HomepageComponent,
    NavbarComponent,
    ViewAllJobComponent
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
    TableModule
  ]
})
export class AdminModule { }
