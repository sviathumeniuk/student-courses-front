import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Load } from '../models/load.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoadsService {
  private readonly apiUrl = `${environment.apiUrl}/${environment.endpoints.loads}`;

  constructor(private readonly http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  getLoads(): Observable<Load[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Load[]>(this.apiUrl, { headers });
  }

  createLoad(loadData: Load): Observable<Load> {
    const headers = this.getAuthHeaders();
    return this.http.post<Load>(this.apiUrl, loadData, { headers });
  }

  updateLoad(id: string, loadData: Load): Observable<Load> {
    const headers = this.getAuthHeaders();
    return this.http.put<Load>(`${this.apiUrl}/${id}`, loadData, { headers });
  }

  deleteLoad(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
