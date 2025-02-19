import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { StudentsComponent } from './components/students/students.component';
import { ReportsComponent } from './components/reports/reports.component';
import { PaymentComponent } from './components/payments/payments.component';
import { LoadsComponent } from './components/loads/loads.component';
import { GroupsComponent } from './components/groups/groups.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent, GroupsComponent, LoadsComponent, LoginComponent, TeachersComponent, StudentsComponent, ReportsComponent, PaymentComponent], // Імпортуємо компоненти
  templateUrl: '/app.component.html',
})
export class AppComponent {}
