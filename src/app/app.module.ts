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

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    SpinnerComponent,
    FullComponent,
    BreadcrumbComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    NgbModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
  ],
  providers: [ AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
