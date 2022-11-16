import { CurrencyService } from './../currency.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { pick } from 'lodash';

@Component({
  selector: 'app-currency-form',
  templateUrl: './currency-modal.html'
})
export class CurrencyFormComponent implements OnInit {
  @Input() currency: any = {
    name: '',
    symbol: '',
    isActive: true,
    exchangeRate: ''
  };
  public currencies: any;
  public submitted: boolean = false;

  constructor(private toasty: ToastrService, public activeModal: NgbActiveModal, private service: CurrencyService) {}

  ngOnInit() {
    this.currencies = this.service.getCurrencies();
  }

  submit(frm: any) {
    this.submitted = true;
    if (frm.invalid) {
      return this.toasty.error('Please complete all fields!');
    }
    if (this.currency.exchangeRate <= 0) return this.toasty.error('Exchange rate must be grater than 0!');

    if (this.currency._id) {
      this.service
        .update(this.currency._id, pick(this.currency, ['isActive', 'symbol', 'name', 'exchangeRate']))
        .then(resp => this.activeModal.close(resp.data))
        .catch(err =>
          this.toasty.error(
            err.data.data && err.data.data.message ? err.data.data.message : 'Something went wrong, please try again!'
          )
        );
    } else {
      this.service
        .create(this.currency)
        .then(resp => {
          this.activeModal.close(resp.data);
        })
        .catch(err =>
          this.toasty.error(
            err.data.data && err.data.data.message ? err.data.data.message : 'Something went wrong, please try again!'
          )
        );
    }
  }
  changeCurrency(event) {
    console.log(event);
    this.currency.name = event.key.toUpperCase();
    this.currency.symbol = event.value.symbol_native;
  }
}
