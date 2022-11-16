import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import * as _ from 'lodash';
import { CouponService } from '../../coupon/coupon.service';
@Component({
  selector: 'course-coupon',
  templateUrl: './course-coupon.html'
})
export class CourseCouponComponent implements OnInit {
  @Input() course: any;
  @Input() tutorId: string;
  @Output() onTabSelect = new EventEmitter();
  @Input() coupon: any = {
    name: '',
    code: '',
    type: 'percent',
    value: 0,
    courseId: '',
    tutorId: '',
    expiredDate: '',
    active: true,
    startTime: '',
    limitNumberOfUse: 0,
    targetType: 'course'
  };
  public time = {
    startTime: {
      year: 0,
      month: 0,
      day: 0
    },
    expiredDate: {
      year: 0,
      month: 0,
      day: 0
    }
  };
  public isSubmitted: Boolean = false;
  public type: string = 'percent';
  public config: any;
  constructor(private toasty: ToastrService, private couponService: CouponService, private route: ActivatedRoute) {
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.coupon.tutorId = this.tutorId;
    if (this.course && this.course._id) {
      this.coupon.courseId = this.course._id;
    }
    this.getCurrentCoupon();
  }

  getCurrentCoupon() {
    this.couponService
      .getCurrentCoupon({
        targetType: 'course',
        courseId: this.coupon.courseId || '',
        tutorId: this.tutorId
      })
      .then(resp => {
        if (resp && resp.data) {
          this.coupon = resp.data;
          const startTime = new Date(this.coupon.startTime);
          const expiredDate = new Date(this.coupon.expiredDate);
          this.time.startTime = {
            year: startTime.getFullYear(),
            month: startTime.getMonth() === 0 ? 12 : startTime.getMonth() + 1,
            day: startTime.getDate()
          };
          this.time.expiredDate = {
            year: expiredDate.getFullYear(),
            month: expiredDate.getMonth() === 0 ? 12 : expiredDate.getMonth() + 1,
            day: expiredDate.getDate()
          };
        }
      });
  }

  selectDate(event, field) {
    const date = `${event.year}-${event.month}-${event.day}`;
    if (
      moment(date, 'YYYY/MM/DD')
        .add(30, 'second')
        .utc()
        .isBefore(moment().set('hour', 0).set('minute', 0).set('second', 0))
    ) {
      this.time[field] = {
        year: 0,
        month: 0,
        day: 0
      };
      this.coupon[field] = '';
      return this.toasty.error('Please select an expiration date greater than or equal to the current date');
    }
    this.coupon[field] = new Date(date).toString();
    if (
      this.coupon.startTime &&
      this.coupon.expiredDate &&
      moment(this.coupon.startTime).isSameOrAfter(moment(this.coupon.expiredDate))
    ) {
      this.time.expiredDate = {
        year: 0,
        month: 0,
        day: 0
      };
      this.coupon.expiredDate = '';
      return this.toasty.error('The expiration date must be greater than the start date');
    }
  }

  percentage() {
    this.type = 'percent';
  }
  usd() {
    this.type = 'money';
  }
  submit(frm) {
    this.isSubmitted = true;
    this.coupon.type = this.type;
    if (!frm.valid || !this.coupon.startTime || !this.coupon.expiredDate) {
      return this.toasty.error('Invalid form, please try again.');
    }
    if (!this.coupon._id) {
      this.couponService.create(this.coupon).then(
        () => {
          this.toasty.success('Coupon has been created');
        },
        err => this.toasty.error(err.data.message || 'Something went wrong!')
      );
    } else {
      const data = _.pick(this.coupon, [
        'name',
        'code',
        'type',
        'value',
        'expiredDate',
        'courseId',
        'tutorId',
        'active',
        'startTime',
        'limitNumberOfUse',
        'targetType'
      ]);
      this.couponService.update(this.coupon._id, data).then(
        () => {
          this.toasty.success('Coupon has been updated');
        },
        err => this.toasty.error(err.data.message || 'Something went wrong!')
      );
    }
  }
  onTab(tab: number) {
    this.onTabSelect.emit(tab);
  }
}
