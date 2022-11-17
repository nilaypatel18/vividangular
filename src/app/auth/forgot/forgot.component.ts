import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: 'forgot.html'
})
export class ForgotComponent {
  public email: String = '';
  public submitted: Boolean = false;
  private Auth: AuthService;
  public appConfig: any;

  constructor(auth: AuthService, public router: Router, private route: ActivatedRoute, private toasty: ToastrService) {
    this.Auth = auth;
  }

  forgot(frm: any) {
    this.submitted = true;
    this.Auth.forgot(this.email)
      .then(resp => {
        if (resp) {
          this.toasty.success('New password has been sent, please check your email inbox.');
          this.email = '';
        }
      })
      .catch(err => this.toasty.error('Something went wrong'));
  }
}
