import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student.model';
import { StudentsService } from '../../services/students.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
    StudentsService
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent extends BaseComponent<Student> {
  override formData: Partial<Student> = {
    firstname: '',
    lastname: '',
    patronymic: '',
    email: '',
    phone: '',
    group: '',
    status: ''
  };

  constructor(private readonly studentService: StudentsService) {
    super();
    this.entityService = studentService;
  }

  override resetForm(): void {
    this.formData = {
      firstname: '',
      lastname: '',
      patronymic: '',
      email: '',
      phone: '',
      group: '',
      status: ''
    };
  }
}