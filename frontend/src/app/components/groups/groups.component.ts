import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupsService } from '../../services/group.service';
import { Group } from '../../models/group.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  standalone: true,
  imports: [
      CommonModule,
      ReactiveFormsModule
    ],
  providers: [
    GroupsService,
    DatePipe
  ]
})
export class GroupsComponent implements OnInit {
  groups: Group[] = [];
  selectedGroup: Group | null = null;
  groupForm: FormGroup;
  isEditing = false;

  constructor(
    private groupsService: GroupsService,
    private fb: FormBuilder
  ) {
    this.groupForm = this.fb.group({
      speciality: ['', Validators.required],
      department: ['', Validators.required],
      numberOfStudents: ['', [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupsService.getGroups().subscribe({
      next: (groups: Group[]) => {
        this.groups = groups;
      },
      error: (error: any) => {
        console.error('Error loading groups:', error);
        // Тут можна додати відображення помилки користувачу
      }
    });
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      if (this.isEditing && this.selectedGroup) {
        this.groupsService.updateGroup(this.selectedGroup._id, this.groupForm.value)
          .subscribe({
            next: () => {
              this.loadGroups();
              this.resetForm();
            },
            error: (error: any) => console.error('Error updating group:', error)
          });
      } else {
        this.groupsService.createGroup(this.groupForm.value)
          .subscribe({
            next: () => {
              this.loadGroups();
              this.resetForm();
            },
            error: (error: any) => console.error('Error creating group:', error)
          });
      }
    }
  }

  editGroup(group: Group): void {
    this.selectedGroup = group;
    this.isEditing = true;
    this.groupForm.patchValue({
      speciality: group.speciality,
      department: group.department,
      numberOfStudents: group.numberOfStudents,
      startDate: new Date(group.startDate).toISOString().split('T')[0],
      endDate: new Date(group.endDate).toISOString().split('T')[0]
    });
  }

  deleteGroup(id: string): void {
    if (confirm('Ви впевнені, що хочете видалити цю групу?')) {
      this.groupsService.deleteGroup(id).subscribe({
        next: () => {
          this.loadGroups();
        },
        error: (error: any) => console.error('Error deleting group:', error)
      });
    }
  }

  resetForm(): void {
    this.groupForm.reset();
    this.selectedGroup = null;
    this.isEditing = false;
  }
}