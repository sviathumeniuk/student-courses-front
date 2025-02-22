import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/components/login/login.component';
import { TeachersComponent } from './app/components/teachers/teachers.component';
import { StudentsComponent } from './app/components/students/students.component';
import { ReportsComponent } from './app/components/reports/reports.component';
import { PaymentComponent } from './app/components/payments/payments.component';
import { LoadsComponent } from './app/components/loads/loads.component';
import { GroupsComponent } from './app/components/groups/groups.component';
import { LayoutComponent } from './app/components/layout/layout.component';
import { HttpClient, provideHttpClient } from '@angular/common/http';

const routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'teachers', component: TeachersComponent },
      { path: 'students', component: StudentsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'payments', component: PaymentComponent },
      { path: 'loads', component: LoadsComponent },
      { path: 'groups', component: GroupsComponent }
    ]
  }
];

const appConfig = {
  providers: [
    provideRouter(routes),
    HttpClient,
    RouterModule,
    provideHttpClient()
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));