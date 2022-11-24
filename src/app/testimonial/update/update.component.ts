import { Component, OnInit } from '@angular/core';
import { TestimonialService } from '../testimonial.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-testimonial-update',
  templateUrl: '../form.html',
})
export class TestimonialUpdateComponent implements OnInit {
  public maxFileSize: number;
  public testimonial: any = {};
  public isSubmitted: Boolean = false;
  private testimonialId: any;
  public imageUrl: String = '';
  public mainImageOptions: any;
  public imageSelected: any[] = [];
  constructor(
    private router: Router,
    private testimonialService: TestimonialService,
    private toasty: ToastrService,
    private route: ActivatedRoute
  ) {
    this.maxFileSize = 5;
  }

  ngOnInit() {
    this.testimonialId = this.route.snapshot.paramMap.get('id');

    var tableData = localStorage.getItem('TSMData')
      ? JSON.parse(localStorage.getItem('TSMData') || '')
      : [];
    if (tableData.length > 0) {
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].id == this.testimonialId) {
          this.testimonial = tableData[i];
        }
      }
    }
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error(
        'Something went wrong, please check and try again!'
      );
    }
    var tableData = localStorage.getItem('TSMData')
      ? JSON.parse(localStorage.getItem('TSMData') || '')
      : [];

    if (tableData.length > 0) {
      for (let i = 0; i < tableData.length; i++) {
        console.log(tableData[i].id,this.testimonial.id)
        if (tableData[i].id == this.testimonial.id) {
          tableData[i] = this.testimonial;
          break;
        }
      }
    }

    localStorage.setItem('TSMData', JSON.stringify(tableData));
    this.router.navigate(['/testimonials/list']);
  }
}
