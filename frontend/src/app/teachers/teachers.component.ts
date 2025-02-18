// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
// import { NgIf } from '@angular/common';
// import { CommonModule } from '@angular/common';
// import { catchError, tap } from 'rxjs/operators';  // Add this import

// @Component({
//   selector: 'app-teachers',
//   standalone: true,
//   imports: [HttpClientModule,
//     CommonModule
//   ],
//   templateUrl: './teachers.component.html',
//   styleUrls: ['./teachers.component.css']
// })
// export class TeachersComponent implements OnInit {

//   teachers: any[] = [];
//   isLoading: boolean = true;
//   errorMessage: string = '';

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.getTeachers();
//   }

//   getTeachers(): void {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       this.errorMessage = 'No JWT token found';
//       this.isLoading = false;
//       console.log('No token found in localStorage');
//       return;
//     }

//     console.log('Token found:', token); // Log the token (be careful with this in production)
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

//     this.http.get<any>('http://localhost:5000/api/teachers', { headers })
//       .pipe(
//         tap(response => {
//           console.log('Server Response:', response);
//           console.log('Response Headers:', response.headers);
//           console.log('Response Status:', response.status);
//         }),
//         catchError(error => {
//           console.error('Error details:', {
//             error: error,
//             status: error.status,
//             statusText: error.statusText,
//             message: error.message,
//             url: error.url,
//             headers: error.headers,
//             error_body: error.error
//           });
//           throw error;
//         })
//       )
//       .subscribe({
//         next: (data) => {
//           console.log('Received teachers data:', data);
//           this.teachers = data;
//           this.isLoading = false;
//         },
//         error: (error) => {
//           console.error('Error in subscribe:', error);
//           this.errorMessage = `Error fetching data: ${error.message}`;
//           this.isLoading = false;
//         }
//       });
//   }
// }

import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

// Interface definition
interface Teacher {
  _id: string;
  firstname: string;
  lastname: string;
  patronymic: string;
  email: string;
  phone: string;
  experience: number;
}

// Service class with Injectable decorator
@Injectable()
class TeacherService {
  private apiUrl = 'http://localhost:5000/api/teachers';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getTeacherById(id: string): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createTeacher(teacher: Omit<Teacher, '_id'>): Observable<Teacher> {
    return this.http.post<Teacher>(this.apiUrl, teacher, { headers: this.getHeaders() });
  }

  updateTeacher(id: string, teacher: Partial<Teacher>): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.apiUrl}/${id}`, teacher, { headers: this.getHeaders() });
  }

  deleteTeacher(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  providers: [TeacherService], // Service is provided here
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
  searchId: string = ''; // Поле для введення ID пошуку
  foundTeacher: Teacher | null = null; // Знайдений вчитель за ID
  searchErrorMessage: string = ''; // Повідомлення про помилку

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.isLoading = true;
    this.teacherService.getAllTeachers().subscribe({
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
      this.teacherService.createTeacher(this.newTeacher as Omit<Teacher, 'id'>).subscribe({
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
    if (this.selectedTeacher && this.selectedTeacher._id) {
      this.teacherService.updateTeacher(this.selectedTeacher._id, this.selectedTeacher).subscribe({
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
      this.teacherService.deleteTeacher(id).subscribe({
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

  // Функція пошуку за ID
  searchTeacherById(): void {
    if (!this.searchId.trim()) {
      this.searchErrorMessage = 'Please enter a valid ID';
      this.foundTeacher = null;
      return;
    }

    this.teacherService.getTeacherById(this.searchId).subscribe({
      next: (teacher: Teacher) => {
        this.foundTeacher = teacher;
        this.searchErrorMessage = '';
      },
      error: (error: any) => {
        this.searchErrorMessage = 'Teacher not found';
        this.foundTeacher = null;
        console.error('Error:', error);
      }
    });
  }
}
