import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-profile-update',
  templateUrl: './form.html',
})
export class ProfileUpdateComponent implements OnInit {
  public info: any = {};
  public avatarUrl = '';
  public isSubmitted = false;
  public avatarOptions: any = {};
  public user: any = {};

  constructor(
    private router: Router,

    private toasty: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    var profileData = JSON.parse(localStorage.getItem('UserProfile') || '');

    this.info = _.pick(profileData, [
      'name',
      'email',
      'address',
      'phoneNumber',
    ]);
    this.avatarUrl = '';
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error(
        'Something went wrong, please check and try again!'
      );
    }
    localStorage.setItem('UserProfile', JSON.stringify(this.info));
    this.toasty.success('Please Updated Successfully.');
  }
}
