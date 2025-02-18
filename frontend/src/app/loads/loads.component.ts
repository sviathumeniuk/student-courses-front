import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadsService } from '../services/loads.service';
import { Load } from '../models/load.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loads',
  templateUrl: './loads.component.html',
  styleUrls: ['./loads.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [LoadsService]
})
export class LoadsComponent implements OnInit {
  loads: Load[] = [];
  editingLoad: Load | null = null;
  
  loadForm: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly loadsService: LoadsService) {
    this.loadForm = this.fb.group({
      teacher: ['', Validators.required],
      group: ['', Validators.required],
      subject: ['', Validators.required],
      hours: [0, [Validators.required, Validators.min(1)]],
      typeOfClass: ['', Validators.required],
      paymentPerHour: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.getLoads();
  }

  getLoads(): void {
    this.loadsService.getLoads().subscribe({
      next: (loads: Load[]) => this.loads = loads,
      error: (error: any) => console.error('Error fetching loads:', error)
    });
  }

  onSubmit(): void {
    if (this.loadForm.invalid) return;

    const loadData = this.loadForm.value;

    if (this.editingLoad) {
      this.loadsService.updateLoad(this.editingLoad._id, loadData).subscribe({
        next: (updatedLoad: Load) => {
          const index = this.loads.findIndex(l => l._id === updatedLoad._id);
          if (index !== -1) {
            this.loads[index] = updatedLoad;
          }
          this.resetForm();
        },
        error: (error: any) => console.error('Error updating load:', error)
      });
    } else {
      this.loadsService.createLoad(loadData).subscribe({
        next: (newLoad: any) => {
          this.loads.push(newLoad);
          this.resetForm();
        },
        error: (error: any) => console.error('Error creating load:', error)
      });
    }
  }

  editLoad(load: Load): void {
    this.editingLoad = load;
    this.loadForm.patchValue({
      teacher: load.teacher,
      group: load.group,
      subject: load.subject,
      hours: load.hours,
      typeOfClass: load.typeOfClass,
      paymentPerHour: load.paymentPerHour
    });
  }

  deleteLoad(id: string): void {
    if (confirm('Are you sure you want to delete this load?')) {
      this.loadsService.deleteLoad(id).subscribe({
        next: () => {
          this.loads = this.loads.filter(load => load._id !== id);
        },
        error: (error: any) => console.error('Error deleting load:', error)
      });
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.editingLoad = null;
    this.loadForm.reset({
      hours: 0,
      paymentPerHour: 0
    });
  }

  trackById(index: number, load: Load): string {
    return load._id;
  }
}
