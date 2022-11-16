import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { CourseService } from '../course.service';
import { CategoryService } from '../../category/category.service';
import { GradeService } from '../../grade/grade.service';
import { from } from 'rxjs';
import { MySubjectService } from '../../shared/services/my-subject.service';
import { MyTopicService } from '../../shared/services/my-topic.service';
import { MyCategoryService } from '../../shared/services/my-category.service';
declare var $: any;

@Component({
  selector: 'app-course-update',
  templateUrl: './update.html'
})
export class CourseUpdateComponent implements OnInit {
  public maxFileSize: number;
  public tab: number = 1;
  public isFree: boolean = false;
  public tutorId: string;
  public courseId: any;
  public course: any = {};
  public isSubmitted: Boolean = false;
  public loading: Boolean = false;
  public grades: any[] = [];
  public categories: any[] = [];
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
  public uploadingVideo: boolean = false;
  public uploadingImage: boolean = false;
  public checkMobileBrowser: boolean = false;

  public config: any;

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

  public myCategorySelectedIds: any[] = [];
  public mySubjectSelectedIds: any[] = [];
  constructor(
    private router: Router,
    private courseService: CourseService,
    private toasty: ToastrService,
    private gradeService: GradeService,
    private categoryService: CategoryService,
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
    this.loading = true;
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.queryCategories();
    this.queryGrades();
    this.courseService
      .findOne(this.courseId)
      .then(resp => {
        this.mainImageUrl = resp.data.mainImage.thumbUrl;
        this.videoUrl = resp.data.videoIntroduction.fileUrl;
        this.course = resp.data;
        this.queryMyCategories(true);
        this.loading = false;
      })
      .catch(e => {
        this.loading = false;
        this.toasty.error('Something went wrong, please try again!');
      });
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

    this.loading = true;

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
          'gradeIds',
          'introductionVideoId',
          'mainImageId',
          'isFree',
          'subjectIds',
          'topicIds'
        ])
      )
      .then(resp => {
        this.toasty.success('Updated successfuly!');
        this.tab = 2;
        $('html, body').animate({ scrollTop: 100 });
        //this.router.navigate(['/users/courses']);
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.toasty.error((err.data.data && err.data.data.message) || err.data.message || err.data.email);
      });
  }

  onTabSelect(tab: number) {
    this.tab = tab;
    $('html, body').animate({ scrollTop: 100 });
  }

  async queryMyCategories(init: boolean = false) {
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
          if (init) {
            const myCategorySelected = this.myCategories.filter(
              item => this.course.categoryIds.indexOf(item.originalCategoryId) > -1
            );
            this.myCategorySelectedIds = myCategorySelected.map(item => item._id);
            this.queryMySubjects(this.myCategorySelectedIds.join(','), true);
          }
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
      this.queryMySubjects(ids.join(','));
    } else {
      this.mySubjects = [];
      this.myTopics = [];
      this.course.subjectIds = [];
      this.course.topicIds = [];
    }
  }

  async queryMySubjects(myCategoryIds, init: boolean = false) {
    this.filterMySubject.loading = true;
    const params = Object.assign({
      page: this.filterMySubject.currentPage,
      take: this.filterMySubject.pageSize,
      sort: `${this.filterMySubject.sortOption.sortBy}`,
      sortType: `${this.filterMySubject.sortOption.sortType}`,
      myCategoryIds: myCategoryIds,
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

          if (init) {
            this.mySubjectSelectedIds = mySubjectSelected.map(item => item._id);
            this.queryMyTopics(this.mySubjectSelectedIds.join(','));
          } else {
            this.queryMyTopics(this.filterMyTopic.mySubjectIds);
          }
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

  async onSelectMySubjects(items) {
    if (items && items.length) {
      const ids = items.map(item => item._id);
      this.queryMyTopics(ids.join(','));
    } else {
      this.myTopics = [];
      this.course.topicIds = [];
    }
  }

  queryMyTopics(mySubjectIds) {
    this.filterMyTopic.loading = true;
    const params = Object.assign({
      page: this.filterMyTopic.currentPage,
      take: this.filterMyTopic.pageSize,
      sort: `${this.filterMyTopic.sortOption.sortBy}`,
      sortType: `${this.filterMyTopic.sortOption.sortType}`,
      mySubjectIds: mySubjectIds,
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
}
