import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student.model';
import { StudentsService } from '../../services/students.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [StudentsService],
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedStudent: Student | null = null;
  isEditing: boolean = false;
  newStudent: Partial<Student> = {};
  searchId: string = '';
  foundStudent: Student | null = null;
  searchErrorMessage: string = '';
  selectedGroupId: string = '';

  constructor(private readonly studentService: StudentsService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.studentService.getAllStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error fetching students';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  createStudent(): void {
    if (this.newStudent) {
      this.studentService.createStudent(this.newStudent as Omit<Student, '_id'>).subscribe({
        next: (student: Student) => {
          this.students.push(student);
          this.newStudent = {};
          this.errorMessage = '';
        },
        error: (error: any) => {
          this.errorMessage = 'Error creating student';
          console.error('Error:', error);
        }
      });
    }
  }

  editStudent(student: Student): void {
    this.selectedStudent = { ...student };
    this.isEditing = true;
  }

  updateStudent(): void {
    if (this.selectedStudent?._id) {
      this.studentService.updateStudent(this.selectedStudent._id, this.selectedStudent).subscribe({
        next: (updatedStudent: Student) => {
          const index = this.students.findIndex(s => s._id === updatedStudent._id);
          if (index !== -1) {
            this.students[index] = updatedStudent;
          }
          this.selectedStudent = null;
          this.isEditing = false;
          this.errorMessage = '';
        },
        error: (error: any) => {
          this.errorMessage = 'Error updating student';
          console.error('Error:', error);
        }
      });
    }
  }

  deleteStudent(id: string): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.students = this.students.filter(s => s._id !== id);
          this.errorMessage = '';
        },
        error: (error: any) => {
          this.errorMessage = 'Error deleting student';
          console.error('Error:', error);
        }
      });
    }
  }

  cancelEdit(): void {
    this.selectedStudent = null;
    this.isEditing = false;
  }

  searchStudentById(): void {
    if (!this.searchId.trim()) {
      this.searchErrorMessage = 'Please enter a valid ID';
      this.foundStudent = null;
      return;
    }

    this.studentService.getStudentById(this.searchId).subscribe({
      next: (student: Student) => {
        this.foundStudent = student;
        this.searchErrorMessage = '';
      },
      error: (error: any) => {
        this.searchErrorMessage = 'Student not found';
        this.foundStudent = null;
        console.error('Error:', error);
      }
    });
  }

  clearFilter(): void {
    this.selectedGroupId = '';
    this.loadStudents();
  }
}