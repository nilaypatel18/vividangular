import { Component, OnInit } from '@angular/core';
import { TutorService } from '../tutor.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
//import { SubjectService } from '../../subject/subject.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-tutor-listing',
  templateUrl: './listing.html',
})
export class TutorListingComponent implements OnInit {
  public count: any = 0;
  public items: any = [];
  public currentPage: any = 1;
  public pageSize: any = 10;
  public searchFields: any = {
    rating: '',
    status: '',
  };
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc',
  };
  public subjects = [];
  public subjectIds: any;
  public updating: Boolean = false;

  constructor(
    private router: Router,
    private tutorService: TutorService,
    private toasty: ToastrService //private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.query();
  }

  query() {
    var tableData = localStorage.getItem('TutorData');
    if (tableData) {
      this.items = JSON.parse(tableData);
      this.count = JSON.parse(tableData).length;
    }
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }

  remove(item: any, index: number) {
    if (window.confirm('Are you sure want to delete this tutor?')) {
      this.toasty.success('Item has been deleted!');
      this.items.splice(index, 1);
    }
  }

  update(tutor: any, field: string, value: Boolean) {
    const data = _.pick(tutor, [
      'name',
      'username',
      'subjectIds',
      'bio',
      'email',
      'isActive',
      'emailVerified',
      'address',
      'emailNotification',
      'phoneNumber',
      'phoneVerified',
      'grades',
      'languages',
      'password',
      'isHomePage',
      'zipCode',
      'accountVerified',
    ]);
    data[field] = value;
    if (!this.updating) {
      // this.updating = true;
      // this.tutorService
      //   .update(tutor._id, data)
      //   .then(resp => {
      //     tutor[field] = value;
      //     this.toasty.success('Updated successfuly!');
      //     this.updating = false;
      //   })
      //   .catch(err => {
      //     this.updating = false;
      //     return this.toasty.error('Something went wrong, please check and try again!');
      //   });
    }
  }

  changeStatus(tutor) {
    if (!this.updating) {
      this.updating = true;
      // this.tutorService
      //   .changeStatus(tutor._id)
      //   .then(resp => {
      //     tutor['isActive'] = !tutor.isActive;
      //     const message = tutor.isActive ? 'Activated' : 'Deactivated';
      //     this.toasty.success(message);
      //     this.updating = false;
      //   })
      //   .catch(err => {
      //     this.updating = false;
      //     return this.toasty.error('Something went wrong, please check and try again!');
      //   });
    }
  }
}
