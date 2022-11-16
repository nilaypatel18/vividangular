import { CurrencyListingComponent } from './list/list.component';
import { CurrencyService } from './currency.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MediaModule } from '../media/media.module';
import { CurrencyFormComponent } from './curreny-form/currency-modal';
import { CurrencyRoutingModule } from './currency.routing';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, MediaModule, CurrencyRoutingModule, NgSelectModule],
  declarations: [CurrencyFormComponent, CurrencyListingComponent],
  providers: [CurrencyService],
  exports: [],
  entryComponents: []
})
export class CurrencyModule {}
