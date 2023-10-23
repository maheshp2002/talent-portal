import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  {
    path: '', component: UserLayoutComponent, children: [
      { path: '', component: HomepageComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
