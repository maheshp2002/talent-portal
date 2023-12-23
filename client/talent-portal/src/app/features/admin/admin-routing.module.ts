import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ViewAllJobComponent } from './view-all-job/view-all-job.component';
import { ExamResultComponent } from './exam-result/exam-result.component';

const routes: Routes = [
  {
    path: '', component: AdminLayoutComponent,
    children: [
      { path: 'jobs', component: ViewAllJobComponent },
      { path: 'homepage', component: HomepageComponent },
      { path: 'exam-result/:id', component: ExamResultComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
