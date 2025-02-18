// groups.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

interface Group {
  _id: string;
  speciality: string;
  department: string;
  numberOfStudents: number;
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Groups Management</h2>

      <!-- Group Form -->
      <div class="bg-white p-4 rounded shadow mb-6">
        <h3 class="text-xl font-semibold mb-4">{{ editingGroup ? 'Edit Group' : 'Add New Group' }}</h3>
        <form [formGroup]="groupForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Speciality*</label>
              <input type="text" 
                     formControlName="speciality"
                     class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              @if (groupForm.get('speciality')?.touched && groupForm.get('speciality')?.invalid) {
                <span class="text-red-500 text-sm">Speciality is required</span>
              }
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Department*</label>
              <input type="text" 
                     formControlName="department"
                     class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              @if (groupForm.get('department')?.touched && groupForm.get('department')?.invalid) {
                <span class="text-red-500 text-sm">Department is required</span>
              }
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Number of Students*</label>
              <input type="number" 
                     formControlName="numberOfStudents"
                     class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              @if (groupForm.get('numberOfStudents')?.touched && groupForm.get('numberOfStudents')?.invalid) {
                <span class="text-red-500 text-sm">Number of students is required</span>
              }
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Start Date*</label>
              <input type="date" 
                     formControlName="startDate"
                     class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              @if (groupForm.get('startDate')?.touched && groupForm.get('startDate')?.invalid) {
                <span class="text-red-500 text-sm">Start date is required</span>
              }
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">End Date*</label>
              <input type="date" 
                     formControlName="endDate"
                     class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              @if (groupForm.get('endDate')?.touched && groupForm.get('endDate')?.invalid) {
                <span class="text-red-500 text-sm">End date is required</span>
              }
            </div>
          </div>

          <div class="flex gap-2">
            <button type="submit" 
                    [disabled]="groupForm.invalid"
                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300">
              {{ editingGroup ? 'Update' : 'Create' }}
            </button>
            @if (editingGroup) {
              <button type="button" 
                      (click)="cancelEdit()"
                      class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                Cancel
              </button>
            }
          </div>
        </form>
      </div>

      <!-- Groups List -->
      <div class="bg-white rounded shadow overflow-hidden">
        @if (loading) {
          <div class="p-4 text-center">Loading...</div>
        } @else {
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">Speciality</th>
                <th class="px-4 py-2 text-left">Department</th>
                <th class="px-4 py-2 text-left">Students</th>
                <th class="px-4 py-2 text-left">Start Date</th>
                <th class="px-4 py-2 text-left">End Date</th>
                <th class="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (group of groups; track group._id) {
                <tr class="border-t hover:bg-gray-50">
                  <td class="px-4 py-2">{{ group.speciality }}</td>
                  <td class="px-4 py-2">{{ group.department }}</td>
                  <td class="px-4 py-2">{{ group.numberOfStudents }}</td>
                  <td class="px-4 py-2">{{ group.startDate | date:'mediumDate' }}</td>
                  <td class="px-4 py-2">{{ group.endDate | date:'mediumDate' }}</td>
                  <td class="px-4 py-2">
                    <button (click)="editGroup(group)"
                            class="text-blue-500 hover:text-blue-700 mr-2">
                      Edit
                    </button>
                    <button (click)="deleteGroup(group._id)"
                            class="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-4 py-2 text-center">No groups found</td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>

      <!-- Error Message -->
      @if (error) {
        <div class="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {{ error }}
        </div>
      }
    </div>
  `
})
export class GroupsComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private apiUrl = 'http://localhost:5000/api/groups';

  groups: Group[] = [];
  editingGroup: Group | null = null;
  loading = false;
  error: string | null = null;

  groupForm = this.fb.group({
    speciality: ['', [Validators.required]],
    department: ['', [Validators.required]],
    numberOfStudents: [null as number | null, [Validators.required, Validators.min(1)]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]]
  });

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  ngOnInit() {
    this.fetchGroups();
  }

  fetchGroups() {
    this.loading = true;
    this.error = null;
    
    this.http.get<Group[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (groups) => {
        this.groups = groups;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load groups. Please try again later.';
        this.loading = false;
        if (err.status === 401) {
          this.error = 'Your session has expired. Please log in again.';
        }
        console.error('Error fetching groups:', err);
      }
    });
  }

  onSubmit() {
    if (this.groupForm.invalid) return;

    const groupData = {
      ...this.groupForm.value,
      startDate: new Date(this.groupForm.value.startDate as string),
      endDate: new Date(this.groupForm.value.endDate as string)
    };
    
    this.error = null;

    if (this.editingGroup) {
      this.http.put<Group>(`${this.apiUrl}/${this.editingGroup._id}`, groupData, { headers: this.getHeaders() }).subscribe({
        next: (updatedGroup) => {
          const index = this.groups.findIndex(g => g._id === updatedGroup._id);
          if (index !== -1) {
            this.groups[index] = updatedGroup;
          }
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Failed to update group. Please try again.';
          if (err.status === 401) {
            this.error = 'Your session has expired. Please log in again.';
          }
          console.error('Error updating group:', err);
        }
      });
    } else {
      this.http.post<Group>(this.apiUrl, groupData, { headers: this.getHeaders() }).subscribe({
        next: (newGroup) => {
          this.groups.push(newGroup);
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Failed to create group. Please try again.';
          if (err.status === 401) {
            this.error = 'Your session has expired. Please log in again.';
          }
          console.error('Error creating group:', err);
        }
      });
    }
  }

  editGroup(group: Group) {
    this.editingGroup = group;
    this.groupForm.patchValue({
      speciality: group.speciality,
      department: group.department,
      numberOfStudents: group.numberOfStudents,
      startDate: new Date(group.startDate).toISOString().split('T')[0],
      endDate: new Date(group.endDate).toISOString().split('T')[0]
    });
  }

  deleteGroup(id: string) {
    if (confirm('Are you sure you want to delete this group?')) {
      this.http.delete<Group>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.groups = this.groups.filter(group => group._id !== id);
        },
        error: (err) => {
          this.error = 'Failed to delete group. Please try again.';
          if (err.status === 401) {
            this.error = 'Your session has expired. Please log in again.';
          }
          console.error('Error deleting group:', err);
        }
      });
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.editingGroup = null;
    this.groupForm.reset({
      numberOfStudents: null
    });
    this.error = null;
  }
}