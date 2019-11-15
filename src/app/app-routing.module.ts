import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardPageComponent } from './dashboard/dashboard-page/dashboard-page.component';
import { ErrorModule } from './error/error.module';


const routes: Routes = [
  {path: '', redirectTo: 'login-page', pathMatch: 'full'},
  {path: 'login-page', component: LoginPageComponent},
  {path: 'dashboard', component: DashboardPageComponent, /*canActivate: [LoggedGuard]*/},
  {path: 'error', loadChildren: () => ErrorModule}
  //{path: 'recognition-error', component: ErrorPageComponent},
  //{path: 'not-allowed', component: NotAllowedPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules}/*{ enableTracing: true }*/)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
