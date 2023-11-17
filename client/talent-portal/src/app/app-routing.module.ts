import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from './core/utilities/guards/user.guard';
import { AdminGuard } from './core/utilities/guards/admin.guard';
import { NotFoundComponent } from './shared/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',    
    loadChildren: () => import('./features/landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'user',    
    // canActivate: [UserGuard],
    loadChildren: () => import('./features/user/user.module').then((m) => m.UserModule)
  },
  {
    path: 'admin',  
    // canActivate: [AdminGuard],  
    loadChildren: () => import('./features/admin/admin.module').then((m) => m.AdminModule)
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
