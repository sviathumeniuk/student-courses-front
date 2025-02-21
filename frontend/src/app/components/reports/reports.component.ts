import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Report } from '../../models/report.model';
import { ReportsService } from '../../services/reports.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
    ReportsService
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent extends BaseComponent<Report> {
  override formData: Partial<Report> = {
    group: '',
    teacher: '',
    totalHours: 0,
    payment: 0,
    startDate: new Date(),
    endDate: new Date()
  };

  constructor(private readonly reportService: ReportsService) {
    super();
    this.entityService = reportService;
  }

  override resetForm(): void {
    this.formData = {
      group: '',
      teacher: '',
      totalHours: 0,
      payment: 0,
      startDate: new Date(),
      endDate: new Date()
    };
  }
}
