import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { WebcamSnapshotComponent } from './login-page/webcam-snapshot/webcam-snapshot.component';
import { FormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DashboardPageComponent } from './dashboard/dashboard-page/dashboard-page.component';
import { UserNameComponent } from './user-name/user-name.component';
import { AppPasswordDirective } from './directives/app-password.directive';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { ErrorModule } from './error/error.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    WebcamSnapshotComponent,
    DashboardPageComponent,
    UserNameComponent,
    AppPasswordDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    WebcamModule,
    HttpClientModule,
    ErrorModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
