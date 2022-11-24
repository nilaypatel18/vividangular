import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularcomponantsComponent } from './angularcomponants/angularcomponants.component';
import { AuthLayoutComponent } from './layouts/auth/auth.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      {
        path: 'starter',
        loadChildren: () =>
          import('./starter/starter.module').then((m) => m.StarterModule),
      },
      {
        path: 'tutor',
        loadChildren: () =>
          import('./tutor/tutor.module').then((m) => m.TutorModule),
      },
      {
        path: 'angularcomponats',
        component: AngularcomponantsComponent,
      },
      {
        path: 'testimonials',
        loadChildren: () =>
          import('./testimonial/testimonial.module').then(
            (m) => m.TestimonialModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/starter',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
