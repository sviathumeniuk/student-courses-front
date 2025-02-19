// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter, RouterModule } from '@angular/router';
// import { AppComponent } from './app/app.component';
// import { HomeComponent } from './app/home/home.component';
// import { LoginComponent } from './app/login/login.component';
// import { RegisterComponent } from './app/register/register.component';
// import { TeachersComponent } from './app/teachers/teachers.component';
// import { StudentsComponent } from './app/students/students.component';
// import { ReportsComponent } from './app/reports/reports.component';
// import { PaymentComponent } from './app/payments/payments.component';
// import { LoadsComponent } from './app/loads/loads.component';
// import { GroupsComponent } from './app/groups/groups.component';
// import { HttpClientModule } from '@angular/common/http'; // Імпортуємо HttpClientModule

// // Налаштовуємо маршрути
// const routes = [
//   { path: '', component: HomeComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: 'teachers', component: TeachersComponent },
//   { path: 'students', component: StudentsComponent },
//   { path: 'reports', component: ReportsComponent },
//   { path: 'payments', component: PaymentComponent },
//   { path: 'loads', component: LoadsComponent },
//   { path: 'groups', component: GroupsComponent }
// ];

// // Налаштовуємо конфігурацію
// const appConfig = {
//   providers: [
//     provideRouter(routes),
//     HttpClientModule, // Залишаємо тут HttpClientModule
//     RouterModule
//   ]
// };

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));


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
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

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
    HttpClientModule,
    RouterModule,
    provideHttpClient()
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));