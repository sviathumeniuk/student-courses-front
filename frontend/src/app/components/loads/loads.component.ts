// import { Component, OnInit } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { LoadsService } from '../../services/loads.service';
// import { Load } from '../../models/load.model';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-loads',
//   templateUrl: './loads.component.html',
//   styleUrls: ['./loads.component.css'],
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   providers: [LoadsService],
// })
// export class LoadsComponent implements OnInit {
//   loads: Load[] = [];
//   editingLoad: Load | null = null;

//   loadForm: FormGroup;
//   errorMessage: string | null = null;

//   constructor(
//     private readonly fb: FormBuilder,
//     private readonly loadsService: LoadsService
//   ) {
//     this.loadForm = this.fb.group({
//       teacher: ['', Validators.required],
//       group: ['', Validators.required],
//       subject: ['', Validators.required],
//       hours: [0, [Validators.required, Validators.min(1)]],
//       typeOfClass: ['', Validators.required],
//       paymentPerHour: [0, [Validators.required, Validators.min(0)]],
//     });
//   }

//   ngOnInit(): void {
//     this.getLoads();
//   }

//   getLoads(): void {
//     this.loadsService.getLoads().subscribe({
//       next: (loads: Load[]) => (this.loads = loads),
//       error: (errorMessage) => console.error('Error fetching loads:', errorMessage),
//     });
//   }

//   onSubmit(): void {
//     if (this.loadForm.invalid) return;

//     const loadData = this.loadForm.value;

//     if (this.editingLoad) {
//       this.loadsService.updateLoad(this.editingLoad._id, loadData).subscribe({
//         next: (updatedLoad: Load) => {
//           const index = this.loads.findIndex((l) => l._id === updatedLoad._id);
//           if (index !== -1) {
//             this.loads[index] = updatedLoad;
//           }
//           this.resetForm();
//         },
//         error: (errorMessage) => console.error('Error updating load:', errorMessage),
//       });
//     } else {
//       this.loadsService.createLoad(loadData).subscribe({
//         next: (newLoad: any) => {
//           this.loads.push(newLoad);
//           this.resetForm();
//         },
//         error: (errorMessage) => console.error('Error creating load:', errorMessage),
//       });
//     }
//   }

//   editLoad(load: Load): void {
//     this.editingLoad = load;
//     this.loadForm.patchValue({
//       teacher: load.teacher,
//       group: load.group,
//       subject: load.subject,
//       hours: load.hours,
//       typeOfClass: load.typeOfClass,
//       paymentPerHour: load.paymentPerHour,
//     });
//   }

//   deleteLoad(id: string): void {
//     if (confirm('Are you sure you want to delete this load?')) {
//       this.loadsService.deleteLoad(id).subscribe({
//         next: () => {
//           this.loads = this.loads.filter((load) => load._id !== id);
//         },
//         error: (errorMessage) => console.error('Error deleting load:', errorMessage),
//       });
//     }
//   }

//   cancelEdit(): void {
//     this.resetForm();
//   }

//   private resetForm(): void {
//     this.editingLoad = null;
//     this.loadForm.reset({
//       hours: 0,
//       paymentPerHour: 0,
//     });
//   }

//   trackById(index: number, load: Load): string {
//     return load._id;
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Load } from '../../models/load.model';
import { LoadsService } from '../../services/loads.service';

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
  styleUrls: ['./loads.component.css']
})
export class LoadsComponent implements OnInit {
  loads: Load[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  isEditing: boolean = false;
  selectedLoad: Load | null = null;
  formData: Partial<Load> = {
    teacher: '',
    group: '',
    subject: '',
    hours: 0,
    typeOfClass: '',
    paymentPerHour: 0
  }

  constructor(private readonly loadsService: LoadsService) {}

  ngOnInit(): void {
    this.loadLoads();
  }

  resetForm(): void {
    this.formData = { teacher: '', group: '', subject: '', hours: 0, typeOfClass: '', paymentPerHour: 0 };
  }

  loadLoads(): void {
    this.isLoading = true;
    this.loadsService.getAll().subscribe({
      next: (data: Load[]) => {
        this.loads = data;
        this.isLoading = false;
      },
      error: (errorMessage) => console.error('Error fetching loads:', errorMessage)
    });
  }

  createLoad(): void {
    this.loadsService.create(this.formData as Omit<Load, '_id'>).subscribe({
      next: (load: Load) => {
        this.loads.push(load);
        this.resetForm();
      },
      error: (errorMessage) => console.error('Error creating load:', errorMessage)
    });
  }

  updateLoad(): void {
    if (this.selectedLoad?._id) {
      this.loadsService.update(this.selectedLoad._id, this.formData).subscribe({
        next: (updatedLoad: Load) => {
          const index = this.loads.findIndex(l => l._id === updatedLoad._id);
          if (index !== -1) {
            this.loads[index] = updatedLoad;
          }
          this.cancelEdit();
          this.errorMessage = '';
        },
        error: (errorMessage) => console.error('Error updating load:', errorMessage)
      });
    }
  }

  editLoad(load: Load): void {
    this.selectedLoad = load;
    this.isEditing = true;
    this.formData = { ...load };
  }

  deleteLoad(id: string): void {
    if (confirm('Are you sure you want to delete this load?')) {
      this.loadsService.delete(id).subscribe({
        next: () => {
          this.loads = this.loads.filter(l => l._id !== id);
        },
        error: (errorMessage) => console.error('Error deleting load:', errorMessage)
      });
    }
  }

  cancelEdit(): void {
    this.selectedLoad = null;
    this.isEditing = false;
    this.resetForm();
  }
}