import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseListingComponent } from './list/list.coponent';
import { CourseCreateComponent } from './create/create.component';
import { CourseUpdateComponent } from './update/update.component';
import { CoursePreviewComponent } from './preview/preview.component';
import { ConfigResolver } from '../shared/resolver';

const routes: Routes = [
  {
    path: 'list',
    component: CourseListingComponent,
    data: {
      title: 'Courses manager',
      urls: [{ title: 'courses', url: '/courses/list' }, { title: 'Listing' }]
    }
  },
  {
    path: 'update/:id',
    component: CourseUpdateComponent,
    data: {
      title: 'Courses Update',
      urls: [{ title: 'Courses', url: '/courses/list' }, { title: 'Update' }]
    },
    resolve: { appConfig: ConfigResolver }
  },
  {
    path: 'create',
    component: CourseCreateComponent,
    data: {
      title: 'Create New Course',
      urls: [{ title: 'Courses', url: '/courses/list' }, { title: 'Create' }]
    },
    resolve: { appConfig: ConfigResolver }
  },
  {
    path: 'preview/:id',
    component: CoursePreviewComponent,
    data: {
      title: 'Course Preview',
      urls: [{ title: 'Courses', url: '/courses/list' }, { title: 'Preview' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule {}
