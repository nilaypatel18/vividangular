import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentModule } from '../appointment/appointment.module';

import {
  ListingComponent,
  ViewComponent,
  PayoutSuccessComponent,
  PayoutCancelComponent,
  PayoutButtonComponent
} from './components';

import { RequestPayoutService } from './services/request-payout.service';

const routes: Routes = [
  {
    path: '',
    component: ListingComponent,
    data: {
      title: 'Request Payout Manager',
      urls: [{ title: 'Requests Payout' }]
    }
  },
  {
    path: ':id',
    component: ViewComponent,
    data: {
      title: 'Request Payout Manager',
      urls: [{ title: 'Request Payout' }]
    }
  },
  {
    path: 'success/:id',
    component: PayoutSuccessComponent
  },
  {
    path: 'cancel/:id',
    component: PayoutCancelComponent
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), NgbModule, AppointmentModule],
  declarations: [ListingComponent, ViewComponent, PayoutButtonComponent, PayoutCancelComponent, PayoutSuccessComponent],
  providers: [RequestPayoutService],
  exports: []
})
export class RequestPayoutModule {}
