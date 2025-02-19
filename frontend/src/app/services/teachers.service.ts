import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Teacher } from "../models/teacher.model";

@Injectable({
    providedIn: 'root'
})
export class TeachersService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.teachers}`;

  constructor(private readonly http: HttpClient) {}

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
