import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { LoggedGuard } from './guards/logged.guard';
import { ErrorPageComponent } from './error-page/error-page.component';
import { NotAllowedPageComponent } from './not-allowed-page/not-allowed-page.component';


const routes: Routes = [
  {path: '', redirectTo: 'login-page', pathMatch: 'full'},
  {path: 'login-page', component: LoginPageComponent},
  {path: 'dashboard', component: DashboardPageComponent, canActivate: [LoggedGuard]},
  {path: 'recognition-error', component: ErrorPageComponent},
  {path: 'not-allowed', component: NotAllowedPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
