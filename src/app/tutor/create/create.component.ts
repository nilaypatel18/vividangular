import { Component, OnInit } from '@angular/core';
import { TutorService } from '../tutor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
//import { SubjectService } from '../../subject/subject.service';
import { LanguageService } from '../../shared/services';
import * as _ from 'lodash';


@Component({
  selector: 'app-tutor-create',
  templateUrl: '../form.html',
})
export class TutorCreateComponent implements OnInit {
  public info: any = {
    name: '',
    username: '',
    password: '',
    email: '',
    isActive: false,
    phoneNumber: '',
    phoneVerified: false,
    address: '',
    bio: '',
    languages: [],
    zipCode: '',
    idYoutube: '',
    avatar: '',
    avatarUrl: '',
    timezone: '',
    urlYoutube: '',
  };
  public urlYoutube: any;
  public languages: any;
  public subjects: any;
  public isSubmitted: any = false;
  public options: Object = {
    placeholderText: 'Enter bio',
    charCounterCount: false,
    imageUpload: false,
  };
  public config: any;
  public loading: boolean = false;
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

  constructor(
    private router: Router,
    private tutorService: TutorService,
    private toasty: ToastrService,
    //private subjectService: SubjectService,
    private languageService: LanguageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.querySubjects();
    this.languages = this.languageService.getLang();
    this.config = this.route.snapshot.data['appConfig'];
  }

  querySubjects() {
    // this.subjectService.search({ take: 100 }).then(resp => {
    //   this.subjects = resp.data.items;
    // });
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid || !this.info.timezone) {
      return this.toasty.error('Please complete the required fields!');
    }
    var data = _.pick(this.info, [
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

    data.createdAt = new Date()

    var tableData = localStorage.getItem('TutorData')
      ? JSON.parse(localStorage.getItem('TutorData') || '')
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

    data.id = maxId + 1

    tableData.push(data);
    localStorage.setItem('TutorData', JSON.stringify(tableData));
    this.router.navigate(['/tutor/list']);
  }
  afterUpload(evt) {
    if (!this.info._id) {
      this.info.avatar = evt;
    }
  }
  changeTimezone(event) {
    if (event === 'Asia/Saigon') {
      this.info.timezone = 'Asia/Ho_Chi_Minh';
    } else {
      this.info.timezone = event;
    }
  }
}
