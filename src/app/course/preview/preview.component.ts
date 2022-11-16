import { AuthService } from './../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { SectionService } from './../section.service';
import { CourseService } from './../course.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var jQuery: any;

@Component({
  templateUrl: './preview.html'
})
export class CoursePreviewComponent implements OnInit {
  public course: any;
  public courseId: string;
  public sections: any;
  public createdBy: string;
  public adminId: string;

  public indexSection: number = -1;
  public indexLecture: number = -1;
  public indexMedia: number = -1;

  public shownItem: any = {
    title: 'Introduction Video',
    type: 'video',
    url: ''
  };
  public openLectureId: string;
  constructor(
    private auth: AuthService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private sectionService: SectionService,
    private toasty: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.auth.getCurrentUser().then(resp => {
      this.adminId = resp.id;
    });
    this.courseService
      .findOne(this.courseId)
      .then(resp => {
        this.course = resp.data;
        this.course.totalLecture = 0;
        this.course.totalLength = 0;
        this.shownItem.url = resp.data.videoIntroduction.fileUrl;
        this.createdBy = resp.data.createBy;
        this.sectionService
          .search({ courseId: this.courseId, take: 100, sort: 'ordering', sortType: 'asc' })
          .then(res => {
            if (res.data) {
              this.sections = res.data.items;
              this.sections.map(item => {
                this.calDuration(item);
                this.course.totalLength += item.duration;
                this.course.totalLecture += item.totalLecture;
              });
            }
          })
          .catch(err => {
            this.toasty.error(
              err.data && err.data.data && err.data.data.message
                ? err.data.data.message
                : 'Something went wrong, please try again!'
            );
          });
      })
      .catch(e => {
        this.toasty.error(
          e.data && e.data.data && e.data.data.message ? e.data.data.message : 'Something went wrong, please try again!'
        );
      });

    (function ($) {
      $(document).ready(function () {
        $('#accordion').on('hide.bs.collapse show.bs.collapse', e => {
          $(e.target).prev().find('.btn-collapse i:last-child').toggleClass('fa-minus fa-plus');
        });
      });
    })(jQuery);
  }

  returnDuration(seconds: number) {
    if (seconds == 0) return '00:00';
    else if (seconds < 10) return '00:0' + seconds;
    var duration: string = '';
    if (seconds < 60) return '00:' + seconds;
    else {
      var hour, minute, second;
      hour = seconds < 3600 ? 0 : Math.floor(seconds / 3600);
      if (hour > 0) {
        if (hour < 10) hour = '0' + hour;
        duration = hour + ':';
      }
      var remainSecond = seconds - parseInt(hour) * 3600;
      minute = Math.floor(remainSecond / 60) < 10 ? '0' + Math.floor(remainSecond / 60) : Math.floor(remainSecond / 60);
      second = seconds - parseInt(hour) * 3600 - minute * 60;
      if (second < 10) second = '0' + second;
      return duration + minute + ':' + second;
    }
  }
  calDuration(section: any) {
    let countMedia = 0;
    const lectures = section.lectures || [];
    let duration = 0;
    lectures.forEach(item => {
      let lectureDuration = 0;
      item.medias.forEach(media => {
        countMedia++;
        if (media.mediaType === 'pdf') {
          duration += media.totalLength;
          lectureDuration += media.totalLength;
        } else {
          duration += media.media.duration;
          lectureDuration += media.media.duration;
        }
      });
      item.duration = lectureDuration;
    });
    section.duration = duration;
    this.course.totalMedia = countMedia;
  }

  openLecture(lecture: any, iSection: number, iLecture: number) {
    this.indexLecture = iLecture;
    this.indexSection = iSection;
    if (this.openLectureId !== lecture._id) {
      this.openLectureId = lecture._id;
    } else this.openLectureId = null;
  }

  returnDurationString(seconds: number) {
    if (seconds == 0) return '0h:0m';
    else {
      var h, m, s: number;
      h = Math.floor(seconds / 3600);
      m = Math.floor((seconds - h * 3600) / 60);
      s = seconds - h * 3600 - m * 60;
      if (h > 0) {
        return h + 'h' + m + 'm';
      } else {
        return m + 'm' + s + 's';
      }
    }
  }

  viewMedia(lectureMedia: any, iSection: number, iLecture: number, iMedia: number) {
    this.indexLecture = iLecture;
    this.indexSection = iSection;
    this.indexMedia = iMedia;
    this.shownItem.title = lectureMedia.name;
    this.shownItem.type = lectureMedia.mediaType;
    this.shownItem.url = lectureMedia.media.fileUrl;
  }

  approve() {
    if (window.confirm('Are you sure want to approve this course?')) {
      this.courseService
        .approve(this.courseId)
        .then(resp => {
          this.course.approved = true;
          this.toasty.success('Approve successfully');
        })
        .catch(err => this.toasty.error('Something went wrong, please check and try again!'));
    }
  }

  reject() {
    const modalRef = this.modalService.open(RejectComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.courseId = this.courseId;
    modalRef.result.then(
      res => {
        if (res.success) {
          this.course.approved = false;
          this.toasty.success('Rejected course successfully');
        }
      },
      () => {}
    );
  }
}

@Component({
  selector: 'app-reject-modal',
  template: `
    <div class="modal-header">
      <h2 class="modal-title">Reason</h2>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <h4>Why you want to reject this course ?</h4>
      <input
        type="text"
        class="form-control"
        placeholder="Write the reason"
        required
        name="name"
        [(ngModel)]="reason"
      />
    </div>
    <div class="modal-footer">
      <button type="submit" class="btn btn-outline-dark" (click)="submit()">Submit</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss('Cross click')">Close</button>
    </div>
  `
})
export class RejectComponent {
  @Input() courseId: string;
  public reason: String = '';
  constructor(
    private toasty: ToastrService,
    public activeModal: NgbActiveModal,
    private courseService: CourseService
  ) {}

  submit() {
    if (!this.reason) return this.toasty.error('Please enter reason!');
    this.courseService
      .reject(this.courseId, { reason: this.reason })
      .then(resp => {
        this.activeModal.close(resp.data);
      })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
  }
}
