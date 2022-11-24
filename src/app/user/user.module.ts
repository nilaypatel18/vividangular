import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { UserRoutingModule } from './user.routing';
import { UserService } from './user.service';
import { ProfileUpdateComponent } from './profile/profile-update.component';
import { MediaModule } from '../media/media.module';
import { TutorModule } from '../tutor/tutor.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UserRoutingModule,
    NgbModule,
    MediaModule,
    TutorModule,
    QuillModule.forRoot(),
  ],
  declarations: [ProfileUpdateComponent],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
