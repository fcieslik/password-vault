import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ErrorWrapperComponent } from './error-wrapper/error-wrapper.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NotAllowedPageComponent } from './not-allowed-page/not-allowed-page.component';
import { ErrorRoutingModule } from './error-routing.module';


@NgModule({
  declarations: [
    ErrorWrapperComponent,
    ErrorPageComponent,
    NotAllowedPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ErrorRoutingModule
  ],
  exports: [
    ErrorWrapperComponent,
    ErrorPageComponent,
    NotAllowedPageComponent
  ]
})
export class ErrorModule {
}
