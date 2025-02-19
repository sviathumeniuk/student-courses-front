import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Report } from "../models/report.model"
import { environment } from "../../environments/environment"
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ReportsService {
    private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.reports}`;

    constructor(private readonly http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getAllReports(): Observable<Report[]> {
        return this.http.get<Report[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    getReportById(id: string): Observable<Report> {
        return this.http.get<Report>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    createReport(report: Omit<Report, '_id'>): Observable<Report> {
        return this.http.post<Report>(this.apiUrl, report, { headers: this.getHeaders() });
    }

    updateReport(id: string, report: Partial<Report>): Observable<Report> {
        return this.http.put<Report>(`${this.apiUrl}/${id}`, report, { headers: this.getHeaders() });
    }

    deleteReport(id: string): Observable<Report> {
        return this.http.delete<Report>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}