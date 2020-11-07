import { AlertService } from './shared/services/alert.service';
import { SearchPipe } from './shared/search.pipe';
import { AuthGuard } from './shared/services/auth.guard';
import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { AdminLayoutComponent } from './shared/components/admin-layout/admin-layout.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './shared/components/alert/alert.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    LoginPageComponent,
    DashboardPageComponent,
    CreatePageComponent,
    EditPageComponent,
    SearchPipe,
    AlertComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
    {
      path: '',
      component: AdminLayoutComponent,
      children: [
        // TODO: Если пользователь авторизован, то не давать ему переходить на страницу авторизации, (/admin/login) а редиректить его на главную страницу админки
        {path: 'login', component: LoginPageComponent},
        {path: '', redirectTo: '/admin/login', pathMatch: 'full'},
        {path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuard]},
        {path: 'create', component: CreatePageComponent, canActivate: [AuthGuard]},
        {path: 'post/:id/edit', component: EditPageComponent, canActivate: [AuthGuard]},
        {path: '**', redirectTo: '/admin/login'},
      ]
    },
  ])],
  exports: [
    RouterModule,
  ],
  providers: [
    AuthGuard,
    AlertService,
  ]
})
export class AdminModule {

}
