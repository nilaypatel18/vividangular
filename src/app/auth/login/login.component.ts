import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: 'login.component.html',
})
export class LoginComponent {
  Auth: AuthService;
  credentials = {
    email: '',
    password: '',
  };
  public submitted: Boolean = false;

  constructor(
    auth: AuthService,
    public router: Router,
    private toasty: ToastrService
  ) {
    this.Auth = auth;
    if (auth.getAccessToken()) {
      this.router.navigate(['/starter']);
    }
  }

  login(frm: any) {
    this.submitted = true;
    if (!frm.valid) {
      return this.toasty.error(
        'Something went wrong, please check and try again!'
      );
    }
    const isValid = this.Auth.login(this.credentials);
    if (isValid) {
      return this.router.navigate(['/starter']);
    } else {
      return this.toasty.error(
        'Email or password went wrong, please try again'
      );
    }
  }
}
