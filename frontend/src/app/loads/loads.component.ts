import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

interface Load {
  _id: string;
  teacher: string;
  group: string;
  subject: string;
  hours: number;
  typeOfClass: string;
  paymentPerHour: number;
}

@Component({
  selector: 'app-loads',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Teaching Loads Management</h2>
      
      <!-- Load Form -->
      <div class="bg-white p-4 rounded shadow mb-6">
        <h3 class="text-xl font-semibold mb-4">{{ editingLoad ? 'Edit Load' : 'Add New Load' }}</h3>
        <form [formGroup]="loadForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Teacher ID</label>
              <input type="text" formControlName="teacher" 
                     class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Group ID</label>
              <input type="text" formControlName="group" 
                     class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Subject</label>
              <input type="text" formControlName="subject" 
                     class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Hours</label>
              <input type="number" formControlName="hours" 
                     class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Type of Class</label>
              <input type="text" formControlName="typeOfClass" 
                     class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Payment per Hour</label>
              <input type="number" formControlName="paymentPerHour" 
                     class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          
          <div class="flex gap-2">
            <button type="submit" 
                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              {{ editingLoad ? 'Update' : 'Create' }}
            </button>
            <button *ngIf="editingLoad" type="button" 
                    (click)="cancelEdit()" 
                    class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Loads List -->
      <div class="bg-white rounded shadow">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">Subject</th>
              <th class="px-4 py-2 text-left">Hours</th>
              <th class="px-4 py-2 text-left">Type</th>
              <th class="px-4 py-2 text-left">Payment/Hour</th>
              <th class="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let load of loads; trackBy: trackById">
              <td class="px-4 py-2">{{ load.subject }}</td>
              <td class="px-4 py-2">{{ load.hours }}</td>
              <td class="px-4 py-2">{{ load.typeOfClass }}</td>
              <td class="px-4 py-2">{{ load.paymentPerHour }}</td>
              <td class="px-4 py-2">
                <button (click)="editLoad(load)" 
                        class="text-blue-500 hover:text-blue-700 mr-2">
                  Edit
                </button>
                <button (click)="deleteLoad(load._id)" 
                        class="text-red-500 hover:text-red-700">
                  Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="loads.length === 0">
              <td colspan="5" class="px-4 py-2 text-center">No loads found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class LoadsComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  loads: Load[] = [];
  editingLoad: Load | null = null;
  
  loadForm = this.fb.group({
    teacher: ['', Validators.required],
    group: ['', Validators.required],
    subject: ['', Validators.required],
    hours: [0, [Validators.required, Validators.min(1)]],
    typeOfClass: ['', Validators.required],
    paymentPerHour: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    this.fetchLoads();
  }

  // Helper function to get JWT token from localStorage
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  fetchLoads() {
    const headers = this.getAuthHeaders(); // Get JWT token headers
    this.http.get<Load[]>('http://localhost:5000/api/loads', { headers }).subscribe({
      next: (loads) => this.loads = loads,
      error: (error) => console.error('Error fetching loads:', error)
    });
  }

  onSubmit() {
    if (this.loadForm.invalid) return;

    const loadData = this.loadForm.value;
    const headers = this.getAuthHeaders(); // Get JWT token headers

    if (this.editingLoad) {
      this.http.put<Load>(`http://localhost:5000/api/loads/${this.editingLoad._id}`, loadData, { headers }).subscribe({
        next: (updatedLoad) => {
          const index = this.loads.findIndex(l => l._id === updatedLoad._id);
          if (index !== -1) {
            this.loads[index] = updatedLoad;
          }
          this.resetForm();
        },
        error: (error) => console.error('Error updating load:', error)
      });
    } else {
      this.http.post<Load>('http://localhost:5000/api/loads', loadData, { headers }).subscribe({
        next: (newLoad) => {
          this.loads.push(newLoad);
          this.resetForm();
        },
        error: (error) => console.error('Error creating load:', error)
      });
    }
  }

  editLoad(load: Load) {
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

  deleteLoad(id: string) {
    if (confirm('Are you sure you want to delete this load?')) {
      const headers = this.getAuthHeaders(); // Get JWT token headers
      this.http.delete<Load>(`http://localhost:5000/api/loads/${id}`, { headers }).subscribe({
        next: () => {
          this.loads = this.loads.filter(load => load._id !== id);
        },
        error: (error) => console.error('Error deleting load:', error)
      });
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.editingLoad = null;
    this.loadForm.reset({
      hours: 0,
      paymentPerHour: 0
    });
  }

  // Optional: Track by function for better performance with ngFor
  trackById(index: number, load: Load) {
    return load._id;
  }
}
