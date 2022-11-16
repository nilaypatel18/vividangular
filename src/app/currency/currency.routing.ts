import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrencyListingComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: CurrencyListingComponent,
    data: {
      title: 'Currency manager',
      urls: [{ title: 'Currency', url: '/currency/list' }, { title: 'Listing' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrencyRoutingModule {}
