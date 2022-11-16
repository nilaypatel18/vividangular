import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var jQuery: any;
import { sortBy } from 'lodash';
import { SectionService } from '../section.service';
import { LectureService } from '../lecture.service';
import { SectionFormComponent } from '../model-section/section-form';
import { LectureFormComponent } from '../modal-lecture/lecture-form';
@Component({
  selector: 'course-lecture',
  templateUrl: './course-lecture.html'
})
export class CourseLetureComponent implements OnInit {
  @Input() course: any;
  @Output() onTabSelect = new EventEmitter();
  public courseId: string;
  public isSubmitted: boolean = false;
  public sections: any[] = [];
  public lectures: any[] = [];
  public loading: boolean = false;
  constructor(
    private toasty: ToastrService,
    private sectionService: SectionService,
    private modalService: NgbModal,
    private lectureService: LectureService
  ) {}

  ngOnInit() {
    this.courseId = this.course._id;
    if (this.courseId) {
      this.loading = true;
      this.sectionService
        .search({ courseId: this.courseId, take: 100, sort: 'ordering', sortType: 'asc' })
        .then(resp => {
          if (resp.data) {
            this.sections = resp.data.items;
            this.loading = false;
            (function ($) {
              $(document).ready(function () {
                $('#accordion').on('hide.bs.collapse show.bs.collapse', e => {
                  $(e.target).prev().find('.btn-collapse i:last-child').toggleClass('fa-minus fa-plus');
                });
              });
            })(jQuery);
          }
        })
        .catch(err => {
          this.toasty.error(
            err.data && err.data.data && err.data.data.message
              ? err.data.data.message
              : 'Something went wrong, please try again!'
          );
          this.loading = false;
        });
    }
  }

  onTab(tab: number) {
    this.onTabSelect.emit(tab);
  }

  submitSection(section = { _id: '' }) {
    const modalRef = this.modalService.open(SectionFormComponent, { centered: true, backdrop: 'static', size: 'lg' });
    modalRef.componentInstance.section = section;
    modalRef.result.then(
      res => {
        if (section._id) {
          this.sectionService
            .update(section._id, Object.assign(res, { courseId: this.courseId }))
            .then(resp => {
              if (resp.data) {
                section = resp.data;
                this.sections = sortBy(this.sections, ['ordering']);
                this.toasty.success('Updated successfully!');
              }
            })
            .catch(err => {
              this.toasty.error(
                err.data && err.data.data && err.data.data.message
                  ? err.data.data.message
                  : 'Something went wrong, please try again!'
              );
            });
        } else {
          this.sectionService
            .create(Object.assign(res, { courseId: this.courseId }))
            .then(resp => {
              if (resp.data) {
                this.sections.push(Object.assign(resp.data, { lectures: [] }));
                this.sections = sortBy(this.sections, ['ordering']);
                this.toasty.success('Created successfully!');
              }
            })
            .catch(err => {
              this.toasty.error(
                err.data && err.data.data && err.data.data.message
                  ? err.data.data.message
                  : 'Something went wrong, please try again!'
              );
            });
        }
      },
      () => {}
    );
  }

  submitLecture(indexSection: number, sectionId: string, courseId: string, lecture = { _id: '' }) {
    const modalRef = this.modalService.open(LectureFormComponent, { centered: true, backdrop: 'static', size: 'lg' });
    modalRef.componentInstance.lecture = lecture;
    modalRef.componentInstance.courseId = courseId;
    modalRef.result.then(
      res => {
        if (lecture._id) {
          this.lectureService
            .update(lecture._id, Object.assign(res, { sectionId }))
            .then(resp => {
              if (resp.data) {
                lecture = resp.data;
                this.sections[indexSection].lectures = sortBy(this.sections[indexSection].lectures, ['ordering']);
                this.toasty.success('Updated successfully!');
              }
            })
            .catch(err => {
              this.toasty.error(
                err.data && err.data.data && err.data.data.message
                  ? err.data.data.message
                  : 'Something went wrong, please try again!'
              );
            });
        } else {
          this.lectureService
            .create(Object.assign(res, { sectionId }))
            .then(resp => {
              if (resp.data) {
                this.sections[indexSection].lectures.push(resp.data);
                this.sections[indexSection].totalLecture += 1;
                this.sections[indexSection].lectures = sortBy(this.sections[indexSection].lectures, ['ordering']);
                this.toasty.success('Created successfully!');
              }
            })
            .catch(err => {
              this.toasty.error(
                err.data && err.data.data && err.data.data.message
                  ? err.data.data.message
                  : 'Something went wrong, please try again!'
              );
            });
        }
      },
      () => {}
    );
  }

  removeSection(item: any, index: number) {
    if (window.confirm('Are you sure want to remove this section?')) {
      this.sectionService
        .delete(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.sections.splice(index, 1);
        })
        .catch(e => this.toasty.error(e.data.data.message));
    }
  }
  removeLecture(indexSection: number, item: any, index: number) {
    if (window.confirm('Are you sure want to remove this lecture?')) {
      this.lectureService
        .delete(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.sections[indexSection].totalLecture -= 1;
          this.sections[indexSection].lectures.splice(index, 1);
        })
        .catch(e => this.toasty.error(e.data.data.message));
    }
  }
}
