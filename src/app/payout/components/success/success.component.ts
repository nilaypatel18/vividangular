import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestPayoutService } from '../../services/request-payout.service';
@Component({
  selector: 'app-payment-success',
  templateUrl: './success.html'
})
export class PayoutSuccessComponent implements OnInit, OnDestroy {
  public second: any = 0;
  public interval: any;
  public requestId: string;
  constructor(
    private toasty: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private payoutService: RequestPayoutService
  ) {}
  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.payoutService
      .approve(this.requestId, { note: localStorage.getItem('payoutNote') || '' })
      .then(res => {
        localStorage.removeItem('payoutNote');
      })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));

    this.second = 5;
    this.interval = window.setInterval(() => {
      if (this.second > 0) {
        this.second = this.second - 1;
      } else {
        window.clearInterval(this.interval);
        this.router.navigate(['/payout/requests']);
      }
    }, 1000);
  }

  ngOnDestroy() {
    window.clearInterval(this.interval);
  }
}
