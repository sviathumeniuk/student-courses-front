import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Report } from '../../models/report.model';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    ReportsService
  ],
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

  constructor(private readonly reportService: ReportsService) {}

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
    this.formData = { ...report };
  }

  updateReport(): void {
    if (this.selectedReport?._id) {
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
