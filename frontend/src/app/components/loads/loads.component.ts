import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Load } from '../../models/load.model';
import { LoadsService } from '../../services/loads.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-loads',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    LoadsService
  ],
  templateUrl: './loads.component.html',
  styleUrls: ['./loads.component.css'],
})
export class LoadsComponent extends BaseComponent<Load> {
  override formData: Partial<Load> = {
    teacher: '',
    group: '',
    subject: '',
    hours: 0,
    typeOfClass: '',
    paymentPerHour: 0,
  };

  constructor(private readonly loadsService: LoadsService) {
    super();
    this.entityService = loadsService;
  }

  override resetForm(): void {
    this.formData = {
      teacher: '',
      group: '',
      subject: '',
      hours: 0,
      typeOfClass: '',
      paymentPerHour: 0,
    };
  }
}
