import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Student } from "../models/student.model";

@Injectable({
    providedIn: 'root'
})
export class StudentsService {
    private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.students}`;

    constructor(private readonly http: HttpClient) {}

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
}