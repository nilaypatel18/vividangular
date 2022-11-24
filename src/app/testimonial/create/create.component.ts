import { Component, OnInit } from '@angular/core';
import { TestimonialService } from '../testimonial.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: '../form.html'
})
export class TestimonialCreateComponent implements OnInit {
  public maxFileSize: number;
  public testimonial: any = {
    name: '',
    title: '',
    idYoutube: '',
    description: '',
    type: 'parent',
    imageId: null
  };
  public isSubmitted: Boolean = false;
  public imageUrl: String = '';
  public mainImageOptions: any;
  public imageSelected: any[] = [];
  constructor(private router: Router, private testimonialService: TestimonialService, private toasty: ToastrService) {
    this.maxFileSize = 5;
  }

  ngOnInit() {

  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error('Invalid form, please try again.');
    }
    var tableData = localStorage.getItem('TSMData')
      ? JSON.parse(localStorage.getItem('TSMData') || '')
      : [];

    var maxId = 0

    if(tableData.length > 0)
    {
      for(let i = 0 ;i < tableData.length ; i++)
      { 
        if(tableData[i].id > maxId)
        {
          maxId = tableData[i].id
        }
      }
    }

    var data = this.testimonial
    data.id = maxId + 1

    tableData.push(data);
    localStorage.setItem('TSMData', JSON.stringify(tableData));
    this.router.navigate(['/testimonials/list']);
  }
}
