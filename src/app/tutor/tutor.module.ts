import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TutorRoutingModule } from './tutor.routing';
import { MediaModule } from '../media/media.module';
import { QuillModule } from 'ngx-quill';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { TutorCreateComponent } from './create/create.component';
import { TutorListingComponent } from './list/listing.component';
import { ProfileCardCustomComponent } from './profile-card/profile-card.component';
import { TutorGradeComponent } from './grades/grade.component';
import { TutorService } from './tutor.service';
import { DocumentModalComponent } from './view-document-modal/view-document.componet';
import { TimezoneComponent } from './timezone.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MySubjectFormComponent } from './modal-mysubject/my-subject';
import { TutorUpdateComponent } from './update/update.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TutorRoutingModule,
    NgbModule,
    MediaModule,
    QuillModule.forRoot(),
    NgxDocViewerModule,
    NgSelectModule,
  ],
  declarations: [
    TutorUpdateComponent,
    TutorCreateComponent,
    TutorListingComponent,
    ProfileCardCustomComponent,
    TutorGradeComponent,
    DocumentModalComponent,
    TimezoneComponent,
    MySubjectFormComponent
  ],
  providers: [TutorService],
  exports: [ProfileCardCustomComponent],
  entryComponents: [],
})
export class TutorModule {}
