import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Teacher } from '../../models/teacher.model';
import { TeachersService } from '../../services/teachers.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
    TeachersService
  ],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent extends BaseComponent<Teacher> {
  override formData: Partial<Teacher> = {
    firstname: '',
    lastname: '',
    patronymic: '',
    email: '',
    phone: '',
    experience: 0
  };

  constructor(private readonly teacherService: TeachersService) {
    super();
    this.entityService = teacherService;
  }

  override resetForm(): void {
    this.formData = {
      firstname: '',
      lastname: '',
      patronymic: '',
      email: '',
      phone: '',
      experience: 0
    };
  }
}