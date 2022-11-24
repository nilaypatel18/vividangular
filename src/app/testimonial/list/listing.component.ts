import { Component, OnInit } from '@angular/core';
import { TestimonialService } from '../testimonial.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-testimonial-listing',
  templateUrl: './listing.html',
})
export class TestimonialListingComponent implements OnInit {
  public count: number = 0;
  public items: any = [];
  public act_items: any = [];
  public currentPage: number = 1;
  public pageSize: number = 10;
  public searchFields: any = {};
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc',
  };

  constructor(
    private router: Router,
    private testimonialService: TestimonialService,
    private toasty: ToastrService
  ) {}

  ngOnInit() {
    this.query();
  }

  query() {
    var tableData = localStorage.getItem('TSMData');
    if (tableData) {
      this.items = JSON.parse(tableData);
      this.act_items = JSON.parse(tableData);
      this.count = JSON.parse(tableData).length;
    }
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }

  handleOnChange(value: any) {
    var tableData = this.act_items.length > 0 ? this.act_items : [];
    var newTable: any = [];
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].title.includes(value.target.value)) {
        newTable.push(tableData[i]);
      }
    }
    this.items = newTable;
  }

  remove(item: any, index: number) {
    if (window.confirm('Are you sure want to delete this testimonial?')) {
    }
  }
}
