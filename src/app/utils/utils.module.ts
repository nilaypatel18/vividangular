import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicChildLoaderDirective } from './components/modal-dialog/modal-dialog.directive';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { SelectComponent } from './components/select/select.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { DaterangepickerComponent } from './components/daterangepicker/daterangepicker.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  declarations: [
    ModalDialogComponent,
    SelectComponent,
    DynamicChildLoaderDirective,
    DatepickerComponent,
    DaterangepickerComponent,
    AutocompleteComponent,
  ],
  exports: [ModalDialogComponent, SelectComponent, DatepickerComponent,DaterangepickerComponent,AutocompleteComponent],
  providers: [MatDatepickerModule],
})
export class UtilsModule {}
