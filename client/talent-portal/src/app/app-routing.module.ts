import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',    
    loadChildren: () => import('./features/landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'user',    
    loadChildren: () => import('./features/user/user.module').then((m) => m.UserModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
