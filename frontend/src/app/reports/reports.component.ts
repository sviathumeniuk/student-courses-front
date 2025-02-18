import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

// Інтерфейс для репорту
interface Report {
  _id: string;
  group: string;
  teacher: string;
  totalHours: number;
  payment: number;
  startDate: Date;
  endDate: Date;
}

@Injectable()
class ReportService {
  private apiUrl = 'http://localhost:5000/api/reports';

  constructor(private http: HttpClient) {}

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

  getReportsByGroup(groupId: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/group/${groupId}`, { headers: this.getHeaders() });
  }

  getReportsByTeacher(teacherId: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/teacher/${teacherId}`, { headers: this.getHeaders() });
  }
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  providers: [ReportService],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reports: Report[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedReport: Report | null = null;
  isEditing: boolean = false;
  formData: Partial<Report> = {
    startDate: new Date(),
    endDate: new Date()
  };
  searchId: string = '';
  foundReport: Report | null = null;
  searchErrorMessage: string = '';
  filterGroupId: string = '';
  filterTeacherId: string = '';

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading = true;
    this.reportService.getAllReports().subscribe({
      next: (data: Report[]) => {
        this.reports = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error fetching reports';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  createReport(): void {
    this.reportService.createReport(this.formData as Omit<Report, '_id'>).subscribe({
      next: (report: Report) => {
        this.reports.push(report);
        this.formData = { startDate: new Date(), endDate: new Date() }; // Reset form
        this.errorMessage = '';
      },
      error: (error: any) => {
        this.errorMessage = 'Error creating report';
        console.error('Error:', error);
      }
    });
  }

  editReport(report: Report): void {
    this.selectedReport = report;
    this.isEditing = true;
    this.formData = { ...report }; // Copy data for editing
  }

  updateReport(): void {
    if (this.selectedReport && this.selectedReport._id) {
      this.reportService.updateReport(this.selectedReport._id, this.formData).subscribe({
        next: (updatedReport: Report) => {
          const index = this.reports.findIndex(r => r._id === updatedReport._id);
          if (index !== -1) {
            this.reports[index] = updatedReport;
          }
          this.selectedReport = null;
          this.isEditing = false;
          this.formData = { startDate: new Date(), endDate: new Date() }; // Reset form
          this.errorMessage = '';
        },
        error: (error: any) => {
          this.errorMessage = 'Error updating report';
          console.error('Error:', error);
        }
      });
    }
  }

  deleteReport(id: string): void {
    if (confirm('Are you sure you want to delete this report?')) {
      this.reportService.deleteReport(id).subscribe({
        next: () => {
          this.reports = this.reports.filter(r => r._id !== id);
          this.errorMessage = '';
        },
        error: (error: any) => {
          this.errorMessage = 'Error deleting report';
          console.error('Error:', error);
        }
      });
    }
  }

  searchReportById(): void {
    if (!this.searchId.trim()) {
      this.searchErrorMessage = 'Please enter a valid ID';
      this.foundReport = null;
      return;
    }

    this.reportService.getReportById(this.searchId).subscribe({
      next: (report: Report) => {
        this.foundReport = report;
        this.searchErrorMessage = '';
      },
      error: (error: any) => {
        this.searchErrorMessage = 'Report not found';
        this.foundReport = null;
        console.error('Error:', error);
      }
    });
  }

  filterByGroup(): void {
    if (!this.filterGroupId.trim()) {
      this.loadReports();
      return;
    }

    this.isLoading = true;
    this.reportService.getReportsByGroup(this.filterGroupId).subscribe({
      next: (reports: Report[]) => {
        this.reports = reports;
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (error: any) => {
        this.errorMessage = 'Error filtering reports by group';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  filterByTeacher(): void {
    if (!this.filterTeacherId.trim()) {
      this.loadReports();
      return;
    }

    this.isLoading = true;
    this.reportService.getReportsByTeacher(this.filterTeacherId).subscribe({
      next: (reports: Report[]) => {
        this.reports = reports;
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (error: any) => {
        this.errorMessage = 'Error filtering reports by teacher';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  clearFilters(): void {
    this.filterGroupId = '';
    this.filterTeacherId = '';
    this.loadReports();
  }

  cancelEdit(): void {
    this.selectedReport = null;
    this.isEditing = false;
    this.formData = { startDate: new Date(), endDate: new Date() }; // Reset form
  }
}
