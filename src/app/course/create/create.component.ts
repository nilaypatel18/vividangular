import { TutorService } from './../../tutor/tutor.service';
import { CourseService } from './../course.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../category/category.service';
import { pick } from 'lodash';
import { from, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { GradeService } from '../../grade/grade.service';
import { MyCategoryService } from '../../shared/services/my-category.service';
import { MyTopicService } from '../../shared/services/my-topic.service';
import { MySubjectService } from '../../shared/services/my-subject.service';

@Component({
  templateUrl: './create.html'
})
export class CourseCreateComponent implements OnInit {
  public course: any = {
    tutorId: '',
    name: '',
    price: 0,
    categoryIds: [],
    description: '',
    mainImageId: '',
    introductionVideoId: '',
    alias: '',
    isFree: false,
    subjectIds: [],
    topicIds: []
  };
  public config: any;
  public tab: number = 1;
  public tutorId: string;
  public loading: boolean = false;
  public isFree: boolean = false;
  public grades: any[] = [];
  public categories: any[] = [];
  public isSubmitted: Boolean = false;
  public mainImageOptions: any;
  public videoOptions: any;
  public mainImageUrl: String = '';
  public videoUrl: String = '';
  public imageSelected: any[] = [];
  public videoSelected: any[] = [];
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

        ['clean']
        // ['image']
      ]
    },
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: (range, context) => {
            return true;
          }
        }
      }
    }
  };
  public searching = false;
  public searchFailed = false;
  public uploadingVideo: boolean = false;
  public uploadingImage: boolean = false;
  public maxFileSize: number;
  public tutor: any;
  public checkMobileBrowser: boolean = false;

  public myCategories: any[] = [];
  public mySubjects: any[] = [];
  public myTopics: any[] = [];
  public filterMyCategory: any = {
    currentPage: 1,
    pageSize: 100,
    sortOption: {
      sortBy: 'ordering',
      sortType: 'asc'
    },
    total: 0,
    loading: false
  };
  public filterMySubject: any = {
    currentPage: 1,
    pageSize: 100,
    sortOption: {
      sortBy: 'ordering',
      sortType: 'asc'
    },
    myCategoryIds: '',
    total: 0,
    loading: false
  };

  public filterMyTopic: any = {
    currentPage: 1,
    pageSize: 100,
    sortOption: {
      sortBy: 'ordering',
      sortType: 'asc'
    },
    mySubjectIds: '',
    total: 0,
    loading: false
  };
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
      // tslint:disable-next-line:semicolon
    );
  formatter = (x: { name: String }) => x.name;

  constructor(
    private courseService: CourseService,
    private toasty: ToastrService,
    private categoryService: CategoryService,
    private gradeService: GradeService,
    private tutorService: TutorService,
    private route: ActivatedRoute,
    private myCategoryService: MyCategoryService,
    private myTopicService: MyTopicService,
    private mySubjectService: MySubjectService
  ) {
    this.maxFileSize = window.appConfig.maximumFileSize;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.checkMobileBrowser = true;
    }
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.mainImageOptions = {
      url: window.appConfig.apiBaseUrl + '/media/photos',
      fileFieldName: 'file',
      onFinish: resp => {
        this.course.mainImageId = resp.data._id;
        this.mainImageUrl = resp.data.thumbUrl;
        this.uploadingImage = false;
      },
      onFileSelect: resp => (this.imageSelected = resp),
      accept: 'image/*',
      id: 'image-upload',
      onUploading: resp => (this.uploadingImage = true)
    };

    this.videoOptions = {
      url: window.appConfig.apiBaseUrl + '/media/videos',
      fileFieldName: 'file',
      onFinish: resp => {
        this.course.introductionVideoId = resp.data._id;
        this.videoUrl = resp.data.fileUrl;
        this.uploadingVideo = false;
      },
      onFileSelect: resp => (this.videoSelected = resp),
      id: 'file-upload',
      accept: 'video/*',
      onUploading: resp => (this.uploadingVideo = true)
    };
    this.queryCategories();
    this.queryGrades();
  }

  queryCategories() {
    this.categoryService.search({ take: 100 }).then(
      resp => {
        this.categories = resp.data.items;
      },
      err => this.toasty.error('Something went wrong, please try again!')
    );
  }

  queryGrades() {
    this.gradeService.search({ take: 100 }).then(
      resp => {
        this.grades = resp.data.items;
      },
      err => this.toasty.error('Something went wrong, please try again!')
    );
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid || (!this.course.isFree && this.course.price <= 0)) {
      return this.toasty.error('Invalid form, please try again.');
    }
    if (this.course.description) {
      this.course.description = this.course.description.replace(
        '<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>',
        ''
      );
    }
    if (this.course.isFree === true) this.course.price = 0;

    if (!this.course.mainImageId) this.toasty.error('Please upload main image for course!');
    if (!this.course.introductionVideoId) this.toasty.error('Please upload introduction video for course!');

    if (!this.course._id && this.course.mainImageId && this.course.introductionVideoId) {
      this.courseService.create(this.course).then(
        resp => {
          this.toasty.success('Course has been created');
          this.course = resp.data;
          this.tab = 2;
          $('html, body').animate({ scrollTop: 100 });
          //this.router.navigate(['/users/courses/' + resp.data._id]);
        },
        err => this.toasty.error(err.data.message || 'Something went wrong!')
      );
    } else if (this.course._id) {
      if (this.course.isFree === true) this.course.price = 0;
      this.courseService
        .update(
          this.course._id,
          pick(this.course, [
            'tutorId',
            'name',
            'price',
            'description',
            'alias',
            'categoryIds',
            'gradeIds',
            'introductionVideoId',
            'mainImageId',
            'isFree',
            'subjectIds',
            'topicIds'
          ])
        )
        .then(resp => {
          this.toasty.success('Updated successsfully!');
          this.tab = 2;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.toasty.error((err.data.data && err.data.data.message) || err.data.message || err.data.email);
        });
    }
  }

  selectTutor(event) {
    this.course.tutorId = event.item._id;
    this.queryMyCategories();
  }

  queryMyCategories() {
    this.filterMyCategory.loading = true;
    const params = Object.assign({
      page: this.filterMyCategory.currentPage,
      take: this.filterMyCategory.pageSize,
      sort: `${this.filterMyCategory.sortOption.sortBy}`,
      sortType: `${this.filterMyCategory.sortOption.sortType}`,
      tutorId: this.course.tutorId
    });
    this.myCategoryService
      .search(params)
      .then(resp => {
        if (resp.data && resp.data.items) {
          this.filterMyCategory.total = resp.data.count;
          this.myCategories = resp.data.items;
        }
        this.filterMyCategory.loading = false;
      })
      .catch(err => {
        this.filterMyCategory.loading = false;
        return this.toasty.error(
          err.data && err.data.data && err.data.data.message
            ? err.data.data.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  onSelectMyCategories(items) {
    if (items && items.length) {
      const ids = items.map(item => item._id);
      this.filterMySubject.myCategoryIds = ids.join(',');
      this.queryMySubjects();
    } else {
      this.mySubjects = [];
      this.myTopics = [];
      this.course.subjectIds = [];
      this.course.topicIds = [];
    }
  }

  queryMySubjects() {
    this.filterMySubject.loading = true;
    const params = Object.assign({
      page: this.filterMySubject.currentPage,
      take: this.filterMySubject.pageSize,
      sort: `${this.filterMySubject.sortOption.sortBy}`,
      sortType: `${this.filterMySubject.sortOption.sortType}`,
      myCategoryIds: this.filterMySubject.myCategoryIds,
      tutorId: this.course.tutorId
    });
    this.mySubjectService
      .search(params)
      .then(resp => {
        if (resp.data && resp.data.items) {
          this.filterMySubject.total = resp.data.count;
          this.mySubjects = resp.data.items;
          const mySubjectSelected = this.mySubjects.filter(
            item => this.course.subjectIds.indexOf(item.originalSubjectId) > -1
          );
          this.course.subjectIds = mySubjectSelected.map(item => item.originalSubjectId);
          this.filterMyTopic.mySubjectIds = mySubjectSelected.map(item => item._id).join(',');
          this.queryMyTopics();
        }
        this.filterMySubject.loading = false;
      })
      .catch(err => {
        this.filterMySubject.loading = false;
        return this.toasty.error(
          err.data && err.data.data && err.data.data.message
            ? err.data.data.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  onSelectMySubjects(items) {
    if (items && items.length) {
      const ids = items.map(item => item._id);
      this.filterMyTopic.mySubjectIds = ids.join(',');
      this.queryMyTopics();
    } else {
      this.myTopics = [];
      this.course.topicIds = [];
    }
  }

  queryMyTopics() {
    this.filterMyTopic.loading = true;
    const params = Object.assign({
      page: this.filterMyTopic.currentPage,
      take: this.filterMyTopic.pageSize,
      sort: `${this.filterMyTopic.sortOption.sortBy}`,
      sortType: `${this.filterMyTopic.sortOption.sortType}`,
      mySubjectIds: this.filterMyTopic.mySubjectIds,
      tutorId: this.course.tutorId
    });
    this.myTopicService
      .search(params)
      .then(resp => {
        this.filterMyTopic.loading = false;
        if (resp.data && resp.data.items) {
          this.filterMyTopic.total = resp.data.count;
          this.myTopics = resp.data.items;
          const myTopicSelected = this.myTopics.filter(item => this.course.topicIds.indexOf(item.originalTopicId) > -1);
          this.course.topicIds = myTopicSelected.map(item => item.originalTopicId);
        }
      })
      .catch(err => {
        this.filterMyTopic.loading = true;
        return this.toasty.error(
          err.data && err.data.data && err.data.data.message
            ? err.data.data.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  onTabSelect(tab: number) {
    this.tab = tab;
    $('html, body').animate({ scrollTop: 100 });
  }
}
