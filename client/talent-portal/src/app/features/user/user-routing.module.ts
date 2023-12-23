import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { HomepageComponent } from './homepage/homepage.component';
import { OnlineExamLandingComponent } from './online-exam-landing/online-exam-landing.component';
import { CanDeactivateGuard } from 'src/app/core/services/CanDeactivateGuard.service';
import { ExamComponent } from './exam/exam.component';
import { JobSearchComponent } from './job-search/job-search.component';
import { ResultComponent } from './result/result.component';
import { AttendedExamsComponent } from './attended-exams/attended-exams.component';

const routes: Routes = [
  {
    path: '', component: UserLayoutComponent, children: [
      { path: '', component: HomepageComponent },
      { path: 'exam-landing/:id', component: OnlineExamLandingComponent},
      { path: 'exam/:id', component: ExamComponent, canDeactivate: [CanDeactivateGuard]  },
      { path: 'jobs', component: JobSearchComponent },
      { path: 'result/:jobId/:userId', component: ResultComponent },
      { path: 'attended-exams', component: AttendedExamsComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard]
})
export class UserRoutingModule { }
