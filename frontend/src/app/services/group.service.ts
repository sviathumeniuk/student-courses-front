import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.groups}`;

  constructor(private readonly http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getGroupById(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createGroup(group: Omit<Group, '_id'>): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, group, {
      headers: this.getHeaders(),
    });
  }

  updateGroup(id: string, group: Partial<Group>): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${id}`, group, {
      headers: this.getHeaders(),
    });
  }

  deleteGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
