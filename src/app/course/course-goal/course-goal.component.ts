import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import * as _ from 'lodash';
import { CourseService } from '../course.service';

@Component({
  selector: 'course-goal',
  templateUrl: './course-goal.html'
})
export class CourseGoalComponent implements OnInit {
  @Input() course: any;
  @Output() onTabSelect = new EventEmitter();
  public courseId: string;
  public courseGoal: any = {
    goalCourse: '',
    whyJoinCourse: '',
    needToJoinCourse: ''
  };
  public isSubmitted: boolean = false;
  public index: number = 0;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toasty: ToastrService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.courseId = this.course._id;
  }

  addItem(type: string) {
    this.course[type].push(this.courseGoal[type]);
    this.courseGoal[type] = '';
    this.submit();
  }

  submit() {
    this.isSubmitted = true;
    if (this.course._id) {
      this.courseService
        .update(
          this.courseId,
          _.pick(this.course, [
            'tutorId',
            'name',
            'price',
            'description',
            'alias',
            'categoryIds',
            'introductionVideoId',
            'mainImageId',
            'isFree',
            'goalCourse',
            'whyJoinCourse',
            'needToJoinCourse'
          ])
        )
        .then(resp => {
          this.toasty.success('Updated successfuly!');
          //this.router.navigate(['/users/courses']);
        })
        .catch(err => {
          this.toasty.error((err.data.data && err.data.data.message) || err.data.message || err.data.email);
        });
    }
  }

  removeItem(type: string, i: number) {
    if (window.confirm('Are you sure want to delete this?')) {
      this.course[type].splice(i, 1);
      this.submit();
    }
  }

  onTab(tab: number) {
    this.onTabSelect.emit(tab);
  }
}
