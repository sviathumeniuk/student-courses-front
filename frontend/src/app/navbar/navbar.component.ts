import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Додайте цей імпорт
import { GroupsComponent } from '../groups/groups.component';
import { TeachersComponent } from '../teachers/teachers.component';
import { StudentsComponent } from '../students/students.component';
import { ReportsComponent } from '../reports/reports.component';
import { PaymentComponent } from '../payments/payments.component';
import { LoadsComponent } from '../loads/loads.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    GroupsComponent, 
    TeachersComponent,
    StudentsComponent,
    ReportsComponent,
    PaymentComponent,
    LoadsComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
}