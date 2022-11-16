import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit } from '@angular/core';
import { RequestPayoutService } from '../../services/request-payout.service';

@Component({
  selector: 'app-button-payout',
  templateUrl: './button.html'
})
export class PayoutButtonComponent implements OnInit {
  @Input() requestId: string;
  @Input() payoutEmail: string;
  @Input() amount: number;
  @Input() code: string = '';
  @Input() config: any;
  @Input() note: string = '';

  public returnUrl: string;
  public cancelUrl: string;
  public description: string;
  public paypalLink: string = 'https://www.sandbox.paypal.com/cgi-bin/webscr';
  constructor(private requestService: RequestPayoutService, private toasty: ToastrService) {}
  ngOnInit() {
    if (this.config && this.config.paypalConfig) {
      const paypalConfig = this.config.paypalConfig;
      this.paypalLink =
        paypalConfig.environment === 'sandbox'
          ? 'https://www.sandbox.paypal.com/cgi-bin/webscr'
          : 'https://www.paypal.com/cgi-bin/webscr';
    }
    this.description = 'Payout for request ' + this.code;
    this.returnUrl = window.location.origin + '/payout/requests/success/' + this.requestId;
    this.cancelUrl = window.location.origin + '/payout/requests/cancel/' + this.requestId;
    this.requestService
      .createLog({ requestId: this.requestId })
      .then()
      .catch(e => {
        this.toasty.error('Something went wrong. Please try again');
      });
  }
}
