import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TeachersComponent } from './teachers/teachers.component';
import { StudentsComponent } from './students/students.component';
import { ReportsComponent } from './reports/reports.component';
import { PaymentComponent } from './payments/payments.component';
import { LoadsComponent } from './loads/loads.component';
import { GroupsComponent } from './groups/groups.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent, GroupsComponent, LoadsComponent, HomeComponent, LoginComponent, TeachersComponent, StudentsComponent, ReportsComponent, PaymentComponent], // Імпортуємо компоненти
  templateUrl: '/app.component.html',
})
export class AppComponent {}
