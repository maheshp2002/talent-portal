import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { HomepageComponent } from './homepage/homepage.component';
import { OnlineExamLandingComponent } from './online-exam-landing/online-exam-landing.component';
import { CanDeactivateGuard } from 'src/app/core/services/CanDeactivateGuard.service';
import { ExamComponent } from './exam/exam.component';

const routes: Routes = [
  {
    path: '', component: UserLayoutComponent, children: [
      { path: '', component: HomepageComponent },
      { path: 'online-exam', component: OnlineExamLandingComponent},
      { path: 'exam', component: ExamComponent, canDeactivate: [CanDeactivateGuard]  }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard]
})
export class UserRoutingModule { }
