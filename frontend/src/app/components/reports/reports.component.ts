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

  constructor(private readonly reportService: ReportsService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  resetForm(): void {
    this.formData = { startDate: new Date(), endDate: new Date() };
  }

  loadReports(): void {
    this.isLoading = true;
    this.reportService.getAll().subscribe({
      next: (data: Report[]) => {
        this.reports = data;
        this.isLoading = false;
      },
      error: (errorMessage) => this.handleError('Error fetching reports:', errorMessage)
    });
  }

  createReport(): void {
    this.reportService.create(this.formData as Omit<Report, '_id'>).subscribe({
      next: (report: Report) => {
        this.reports.push(report);
        this.resetForm();
      },
      error: (errorMessage) => this.handleError('Error creating report:', errorMessage)
    });
  }

  updateReport(): void {
    if (this.selectedReport?._id) {
      this.reportService.update(this.selectedReport._id, this.formData).subscribe({
        next: (updatedReport: Report) => {
          const index = this.reports.findIndex(r => r._id === updatedReport._id);
          if (index !== -1) {
            this.reports[index] = updatedReport;
          }
          this.cancelEdit();
          this.errorMessage = '';
        },
        error: (errorMessage) => this.handleError('Error updating report:', errorMessage)
      });
    }
  }

  editReport(report: Report): void {
    this.selectedReport = report;
    this.isEditing = true;
    this.formData = { ...report };
  }

  deleteReport(id: string): void {
    if (confirm('Are you sure you want to delete this report?')) {
      this.reportService.delete(id).subscribe({
        next: () => {
          this.reports = this.reports.filter(r => r._id !== id);
          this.errorMessage = '';
        },
        error: (errorMessage) => this.handleError('Error deleting report:', errorMessage),
      });
    }
  }

  handleError(message: string, error: any): void {
    this.errorMessage = message;
    console.error('Error:', error);
  }

  cancelEdit(): void {
    this.selectedReport = null;
    this.isEditing = false;
    this.resetForm();
  }
}
