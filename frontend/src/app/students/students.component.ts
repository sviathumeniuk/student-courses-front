import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

interface Student {
  _id: string;          // Унікальний ідентифікатор студента
  firstname: string;    // Ім'я студента
  lastname: string;     // Прізвище студента
  patronymic: string;   // По-батькові студента (якщо є)
  email: string;        // Email студента
  phone: string;        // Номер телефону студента
  group: string;        // ID групи, до якої належить студент
  status: string;       // Статус студента (наприклад, "enrolled" - зарахований)
}

@Injectable()
class StudentService {
  private apiUrl = 'http://localhost:5000/api/students';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createStudent(student: Omit<Student, '_id'>): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student, { headers: this.getHeaders() });
  }

  updateStudent(id: string, student: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student, { headers: this.getHeaders() });
  }

  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getStudentsByGroup(groupId: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/group/${groupId}`, { headers: this.getHeaders() });
  }
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  providers: [StudentService],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
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

  constructor(private studentService: StudentService) {}

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
    if (this.selectedStudent && this.selectedStudent._id) {
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

  filterByGroup(): void {
    if (!this.selectedGroupId.trim()) {
      this.loadStudents(); // Якщо група не вибрана, завантажуємо всіх студентів
      return;
    }

    this.isLoading = true;
    this.studentService.getStudentsByGroup(this.selectedGroupId).subscribe({
      next: (students: Student[]) => {
        this.students = students;
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (error: any) => {
        this.errorMessage = 'Error filtering students by group';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  clearFilter(): void {
    this.selectedGroupId = '';
    this.loadStudents();
  }
}