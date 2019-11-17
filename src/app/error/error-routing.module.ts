import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './error-page/error-page.component';
import { NotAllowedPageComponent } from './not-allowed-page/not-allowed-page.component';
import { ErrorWrapperComponent } from './error-wrapper/error-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: ErrorWrapperComponent,
    children: [
      {path: 'recognition-error', component: ErrorPageComponent},
      {path: 'not-allowed', component: NotAllowedPageComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes, /*{ enableTracing: true }*/)],
  exports: [RouterModule]
})
export class ErrorRoutingModule {
}
