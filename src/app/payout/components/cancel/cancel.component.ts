import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payment-cancel',
  templateUrl: './cancel.html'
})
export class PayoutCancelComponent implements OnInit, OnDestroy {
  public second: any = 0;
  public interval: any;
  constructor(private router: Router) {}

  ngOnInit() {
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
