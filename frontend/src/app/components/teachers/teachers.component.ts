import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Teacher } from '../../models/teacher.model';
import { TeachersService } from '../../services/teachers.service';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [TeachersService],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedTeacher: Teacher | null = null;
  isEditing: boolean = false;
  newTeacher: Partial<Teacher> = {};
  searchId: string = '';
  foundTeacher: Teacher | null = null;
  searchErrorMessage: string = '';

  constructor(private readonly teacherService: TeachersService) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.isLoading = true;
    this.teacherService.getAll().subscribe({
      next: (data: Teacher[]) => {
        this.teachers = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error fetching teachers';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  createTeacher(): void {
    if (this.newTeacher) {
      this.teacherService.create(this.newTeacher as Omit<Teacher, 'id'>).subscribe({
        next: (teacher: Teacher) => {
          this.teachers.push(teacher);
          this.newTeacher = {};
          this.errorMessage = '';
        },
        error: (error: any) => {
          this.errorMessage = 'Error creating teacher';
          console.error('Error:', error);
        }
      });
    }
  }

  editTeacher(teacher: Teacher): void {
    this.selectedTeacher = { ...teacher };
    this.isEditing = true;
  }

  updateTeacher(): void {
    if (this.selectedTeacher?._id) {
      this.teacherService.update(this.selectedTeacher._id, this.selectedTeacher).subscribe({
        next: (updatedTeacher: Teacher) => {
          const index = this.teachers.findIndex(t => t._id === updatedTeacher._id);
          if (index !== -1) {
            this.teachers[index] = updatedTeacher;
          }
          this.selectedTeacher = null;
          this.isEditing = false;
          this.errorMessage = '';
        },
        error: (error: any) => {
          this.errorMessage = 'Error updating teacher';
          console.error('Error:', error);
        }
      });
    }
  }

  deleteTeacher(id: string): void {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.teacherService.delete(id).subscribe({
        next: () => {
          this.teachers = this.teachers.filter(t => t._id !== id);
          this.errorMessage = '';
        },
        error: (error: any) => {
          this.errorMessage = 'Error deleting teacher';
          console.error('Error:', error);
        }
      });
    }
  }

  cancelEdit(): void {
    this.selectedTeacher = null;
    this.isEditing = false;
  }

}
