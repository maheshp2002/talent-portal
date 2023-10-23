import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OnlineExamLandingComponent } from './online-exam-landing/online-exam-landing.component';


@NgModule({
  declarations: [
    HomepageComponent,
    UserLayoutComponent,
    NavbarComponent,
    OnlineExamLandingComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
