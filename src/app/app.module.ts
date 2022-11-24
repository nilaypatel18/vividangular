import * as $ from 'jquery';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthLayoutComponent } from './layouts/auth/auth.component';
import { SpinnerComponent } from './shared/spinner.component';
import { FullComponent } from './layouts/full/full.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { NgSelectModule } from '@ng-select/ng-select';
import { MediaModule } from './media/media.module';
import { AngularcomponantsComponent } from './angularcomponants/angularcomponants.component';
import { UtilsModule } from './utils/utils.module';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    SpinnerComponent,
    FullComponent,
    BreadcrumbComponent,
    SidebarComponent,
    AngularcomponantsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    NgbModule,
    AppRoutingModule,
    NgSelectModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    MediaModule,
    UtilsModule
  ],
  providers: [ AuthGuard,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
