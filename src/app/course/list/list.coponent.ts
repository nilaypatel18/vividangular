import { CategoryService } from './../../category/category.service';
import { TutorService } from './../../tutor/tutor.service';
import { CourseService } from './../course.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-course-listing',
  templateUrl: './list.html'
})
export class CourseListingComponent implements OnInit {
  public count: number = 0;
  public items = [];
  public currentPage: Number = 1;
  public pageSize: Number = 10;
  public searchFields: any = { name: '', approved: '' };
  public categories: any = [];
  public categoryIds: any;
  public config: any;
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public updating: Boolean = false;

  public searching = false;
  public searchFailed = false;
  public tutorId: any;

  search = (text$: Observable<String>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this.tutorService
          .search({ name: term })
          .then(resp => {
            this.searchFailed = false;
            this.searching = false;
            return resp.data.items;
          })
          .catch(err => {
            this.searchFailed = true;
            this.searching = false;
            return of([]);
          })
      ),
      tap(() => (this.searching = false))
    );

  formatter = (x: { name: String }) => x.name;

  constructor(
    private router: Router,
    private courseService: CourseService,
    private toasty: ToastrService,
    private tutorService: TutorService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.query();
    this.queryCategories();
  }

  query() {
    const params = Object.assign(
      {
        page: this.currentPage,
        take: this.pageSize,
        sort: `${this.sortOption.sortBy}`,
        sortType: `${this.sortOption.sortType}`
      },
      this.searchFields
    );
    if (this.tutorId) {
      params.tutorId = this.tutorId._id;
    }
    if (this.categoryIds) {
      params.categoryIds = this.categoryIds.toString();
    }
    this.courseService
      .search(params)
      .then(resp => {
        this.count = resp.data.count;
        this.items = resp.data.items;
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }

  queryCategories() {
    this.categoryService.search({ take: 100 }).then(
      resp => {
        this.categories = resp.data.items;
      },
      err => this.toasty.error('Something went wrong, please try again!')
    );
  }

  remove(item: any, index: number) {
    if (window.confirm('Are you sure want to delete this course?')) {
      this.courseService
        .delete(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
          this.count--;
        })
        .catch(err => {
          if (err.data.data.message) this.toasty.error(err.data.data.message);
          else this.toasty.error('Something went wrong, please try again!');
        });
    }
  }

  update(course: any, field: string, value: Boolean) {
    const data = _.pick(course, [
      'tutorId',
      'name',
      'price',
      'description',
      'alias',
      'categoryIds',
      'introductionVideoId',
      'mainImageId',
      'isFree',
      'featured'
    ]);

    data[field] = value;
    if (!this.updating) {
      this.updating = true;
      this.courseService
        .update(course._id, data)
        .then(resp => {
          course[field] = value;
          this.toasty.success('Updated successfuly!');
          this.updating = false;
        })
        .catch(err => {
          this.updating = false;
          return this.toasty.error('Something went wrong, please check and try again!');
        });
    }
  }
  disable(course: any) {
    this.courseService
      .disable(course.id)
      .then(resp => {
        this.toasty.success('Updated successfuly!');
        this.updating = false;
        course.disabled = true;
      })
      .catch(err => {
        this.updating = false;
        return this.toasty.error('Something went wrong, please check and try again!');
      });
  }

  enable(course: any) {
    this.courseService
      .enable(course.id)
      .then(resp => {
        this.toasty.success('Updated successfuly!');
        this.updating = false;
        course.disabled = false;
      })
      .catch(err => {
        this.updating = false;
        return this.toasty.error('Something went wrong, please check and try again!');
      });
  }
}
