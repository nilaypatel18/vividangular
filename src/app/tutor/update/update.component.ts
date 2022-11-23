import { DocumentModalComponent } from './../view-document-modal/view-document.componet';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TutorService } from '../tutor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { SubjectService } from '../../subject/subject.service';
import { LanguageService } from '../../shared/services';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tutor-update',
  templateUrl: '../form.html',
})
export class TutorUpdateComponent implements OnInit {
  @Output() afterReject = new EventEmitter();

  public info: any = {};
  public avatarUrl = '';
  public isSubmitted = false;
  public tutorId: any;
  public subjects: any;
  public languages: any;
  public config: any;
  public urlYoutube: any;
  public loading: boolean = false;
  public tutorSubjects: any[] = [];
  public categories: any[] = [];
  public selectedCategory: any;
  public selectedSubject: any;
  public myCategories: any[] = [];
  public mySubjects: any[] = [];
  public myTopics: any[] = [];
  public active: any;
  public quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['code-block'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ font: [] }],
        [{ align: [] }],

        ['clean'],
        // ['image']
      ],
    },
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: (range, context) => {
            return true;
          },
        },
      },
    },
  };

  // tslint:disable-next-line:max-line-length
  constructor(
    private router: Router,
    private tutorService: TutorService,
    private toasty: ToastrService,
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) {
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.languages = this.languageService.getLang();
    this.tutorId = this.route.snapshot.paramMap.get('id');

    var tableData = localStorage.getItem('TutorData')
      ? JSON.parse(localStorage.getItem('TutorData') || '')
      : [];

    var data;
    if (tableData.length > 0) {
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].id == this.tutorId) {
          data = tableData[i];
        }
      }
    }

    this.info = _.pick(data, [
      'id',
      'name',
      'username',
      'bio',
      'email',
      'isActive',
      'address',
      'emailNotification',
      'phoneNumber',
      'languages',
      'password',
      'zipCode',
      'country',
      'avatar',
      'state',
      'city',
      'timezone',
      'commissionRate',
      'enable2fa',
      'accountVerified',
    ]);
    this.loading = false;
    if (this.info.introYoutubeId)
      this.urlYoutube = this.setUrl(this.info.introYoutubeId);
    if (this.info.enable2fa == null) this.info.enable2fa = true;
  }

  isImage(document: any) {
    return document.mimeType.includes('image');
  }

  isDoc(document: any) {
    return (
      document.mimeType === 'application/msword' ||
      document.mimeType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      document.mimeType === 'application/pdf'
    );
  }
  showDocument(document) {
    const modalRef = this.modalService.open(DocumentModalComponent, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
    });
    modalRef.componentInstance.fileUrl = document.fileUrl;
  }
  submit(frm: any) {
    this.isSubmitted = true;

    if (!frm.valid || !this.info.timezone) {
      return this.toasty.error('Please complete the required fields!');
    }

    const data = _.pick(this.info, [
      'id',
      'name',
      'username',
      'bio',
      'email',
      'isActive',
      'address',
      'emailNotification',
      'phoneNumber',
      'languages',
      'password',
      'zipCode',
      'country',
      'avatar',
      'state',
      'city',
      'timezone',
      'commissionRate',
      'enable2fa',
      'accountVerified',
    ]);

    var tableData = localStorage.getItem('TutorData')
      ? JSON.parse(localStorage.getItem('TutorData') || '')
      : [];

    if (tableData.length > 0) {
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].id == this.info.id) {
          tableData[i] = data;
          break;
        }
      }
    }

    localStorage.setItem('TutorData', JSON.stringify(tableData));
    this.router.navigate(['/tutor/list']);
  }

  afterUpload(evt) {
    if (!this.info._id) {
      this.info.avatar = evt;
    }
  }

  approve() {
    if (window.confirm('Are you sure want to approve this tutor?')) {
      this.info.rejected = false;
      this.info.pendingApprove = false;
    }
  }

  reject() {
    if (window.confirm('Are you sure want to reject this tutor?')) {
      this.info.rejected = true;
      this.info.pendingApprove = false;
    }
  }

  setUrl(idYoutube) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${idYoutube}`
    );
  }
  changeTimezone(event) {
    if (event === 'Asia/Saigon') {
      this.info.timezone = 'Asia/Ho_Chi_Minh';
    } else {
      this.info.timezone = event;
    }
  }

  // inviteTutorJoinZoom() {
  //   this.tutorService
  //     .inviteZoom(this.info.email)
  //     .then((resp) => {
  //       console.log(resp);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // }
}

// @Component({
//   selector: 'app-reject-modal',
//   template: `
//     <div class="modal-header">
//       <h2 class="modal-title">Reason</h2>
//       <button
//         type="button"
//         class="close"
//         aria-label="Close"
//         (click)="activeModal.dismiss('Cross click')"
//       >
//         <span aria-hidden="true">&times;</span>
//       </button>
//     </div>
//     <div class="modal-body">
//       <h4>Why you want to reject this tutor ?</h4>
//       <input
//         type="text"
//         class="form-control"
//         placeholder="Write the reason"
//         required
//         name="name"
//         [(ngModel)]="reason"
//       />
//     </div>
//     <div class="modal-footer">
//       <button type="submit" class="btn btn-outline-dark" (click)="submit()">
//         Submit
//       </button>
//       <button
//         type="button"
//         class="btn btn-outline-dark"
//         (click)="activeModal.dismiss('Cross click')"
//       >
//         Close
//       </button>
//     </div>
//   `,
// })
// export class RejectComponent {
//   @Input() tutorId: any;
//   public reason: String = '';

//   constructor(
//     private toasty: ToastrService,
//     public activeModal: NgbActiveModal,
//     private tutorService: TutorService
//   ) {}

//   submit() {
//     if (!this.reason) {
//       return this.toasty.error('Please enter reason.');
//     }
//     this.tutorService
//       .reject(this.tutorId, { reason: this.reason })
//       .then((resp) => {
//         this.activeModal.close(resp.data);
//         this.toasty.success('Reject successfully!');
//       })
//       .catch(() =>
//         this.toasty.error('Something went wrong, please try again!')
//       );
//   }
// }
