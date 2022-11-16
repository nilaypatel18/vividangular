import { LectureMediaService } from './../shared/services/lecture-media.service';
import { AnswerService } from './answer.service';
import { QuestionService } from './question.service';
import { CouponService } from './../coupon/coupon.service';
import { CourseCouponComponent } from './course-coupon/course-coupon.component';
import { LectureFormComponent } from './modal-lecture/lecture-form';
import { SectionFormComponent } from './model-section/section-form';
import { LectureService } from './lecture.service';
import { CourseLetureComponent } from './course-lecture/course-lecture.component';
import { SectionService } from './section.service';
import { CourseService } from './course.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MediaModule } from '../media/media.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';

import { CourseListingComponent } from './list/list.coponent';
import { CourseCreateComponent } from './create/create.component';
import { CourseUpdateComponent } from './update/update.component';

import { GradeService } from '../grade/grade.service';
import { CategoryService } from '../category/category.service';
import { CourseRoutingModule } from './course.routing';
import { TutorService } from '../tutor/tutor.service';
import { CoursePreviewComponent, RejectComponent } from './preview/preview.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';
import { CourseGoalComponent } from './course-goal/course-goal.component';
import { MyCategoryService } from '../shared/services/my-category.service';
import { MySubjectService } from '../shared/services/my-subject.service';
import { MyTopicService } from '../shared/services/my-topic.service';
import { CourseQAComponent } from './course-QA/QA.component';
import { QuestionFormComponent } from './modal-question/question-form';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    CourseRoutingModule,
    MediaModule,
    NgSelectModule,
    NgxExtendedPdfViewerModule,
    FroalaEditorModule,
    QuillModule.forRoot()
  ],
  declarations: [
    CourseListingComponent,
    CourseUpdateComponent,
    CourseCreateComponent,
    CoursePreviewComponent,
    RejectComponent,
    CourseGoalComponent,
    CourseLetureComponent,
    SectionFormComponent,
    LectureFormComponent,
    CourseCouponComponent,
    CourseQAComponent,
    QuestionFormComponent
  ],
  providers: [
    CourseService,
    CategoryService,
    TutorService,
    SectionService,
    LectureService,
    CouponService,
    GradeService,
    MyCategoryService,
    MySubjectService,
    MyTopicService,
    LectureMediaService,
    QuestionService,
    AnswerService
  ],
  exports: [CourseGoalComponent, CourseLetureComponent, CourseCouponComponent, CourseQAComponent],
  entryComponents: []
})
export class CourseModule {}
