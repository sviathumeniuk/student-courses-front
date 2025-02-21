// // import { Component, OnInit } from '@angular/core';
// // import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// // import { GroupsService } from '../../services/group.service';
// // import { Group } from '../../models/group.model';
// // import { CommonModule, DatePipe } from '@angular/common';

// // @Component({
// //   selector: 'app-groups',
// //   templateUrl: './groups.component.html',
// //   styleUrls: ['./groups.component.scss'],
// //   standalone: true,
// //   imports: [
// //       CommonModule,
// //       ReactiveFormsModule
// //     ],
// //   providers: [
// //     GroupsService,
// //     DatePipe
// //   ]
// // })
// // export class GroupsComponent implements OnInit {
// //   groups: Group[] = [];
// //   selectedGroup: Group | null = null;
// //   groupForm: FormGroup;
// //   isEditing = false;

// //   constructor(
// //     private groupsService: GroupsService,
// //     private fb: FormBuilder
// //   ) {
// //     this.groupForm = this.fb.group({
// //       speciality: ['', Validators.required],
// //       department: ['', Validators.required],
// //       numberOfStudents: ['', [Validators.required, Validators.min(1)]],
// //       startDate: ['', Validators.required],
// //       endDate: ['', Validators.required]
// //     });
// //   }

// //   ngOnInit(): void {
// //     this.loadGroups();
// //   }

// //   loadGroups(): void {
// //     this.groupsService.getGroups().subscribe({
// //       next: (groups: Group[]) => {
// //         this.groups = groups;
// //       },
// //       error: (error: any) => {
// //         console.error('Error loading groups:', error);
// //       }
// //     });
// //   }

// //   onSubmit(): void {
// //     if (this.groupForm.valid) {
// //       if (this.isEditing && this.selectedGroup) {
// //         this.groupsService.updateGroup(this.selectedGroup._id, this.groupForm.value)
// //           .subscribe({
// //             next: () => {
// //               this.loadGroups();
// //               this.resetForm();
// //             },
// //             error: (error: any) => console.error('Error updating group:', error)
// //           });
// //       } else {
// //         this.groupsService.createGroup(this.groupForm.value)
// //           .subscribe({
// //             next: () => {
// //               this.loadGroups();
// //               this.resetForm();
// //             },
// //             error: (error: any) => console.error('Error creating group:', error)
// //           });
// //       }
// //     }
// //   }

// //   editGroup(group: Group): void {
// //     this.selectedGroup = group;
// //     this.isEditing = true;
// //     this.groupForm.patchValue({
// //       speciality: group.speciality,
// //       department: group.department,
// //       numberOfStudents: group.numberOfStudents,
// //       startDate: new Date(group.startDate).toISOString().split('T')[0],
// //       endDate: new Date(group.endDate).toISOString().split('T')[0]
// //     });
// //   }

// //   deleteGroup(id: string): void {
// //     if (confirm('Ви впевнені, що хочете видалити цю групу?')) {
// //       this.groupsService.deleteGroup(id).subscribe({
// //         next: () => {
// //           this.loadGroups();
// //         },
// //         error: (error: any) => console.error('Error deleting group:', error)
// //       });
// //     }
// //   }

// //   resetForm(): void {
// //     this.groupForm.reset();
// //     this.selectedGroup = null;
// //     this.isEditing = false;
// //   }
// // }


// import { Component, OnInit } from "@angular/core";
// import { CommonModule } from "@angular/common";
// import { FormsModule } from "@angular/forms";
// import { Group } from "../../models/group.model";
// import { GroupsService } from "../../services/group.service";

// @Component({
//   selector: 'app-groups',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//   ],
//   providers: [
//     GroupsService
//   ],
//   templateUrl: './groups.component.html',
//   styleUrls: ['./groups.component.css']
// })
// export class GroupsComponent implements OnInit {
//   groups: Group[] = [];
//   isLoading: boolean = false;
//   errorMessage: string = '';
//   isEditing: boolean = false;
//   selectedGroup: Group | null = null;
//   formData: Partial<Group> = {
//     speciality: '',
//     department: '',
//     numberOfStudents: 0,
//     startDate: new Date(),
//     endDate: new Date()
//   }

//   constructor(private readonly groupService: GroupsService) {}

//   ngOnInit(): void {
//     this.loadGroups();
//   }

//   resetForm(): void {
//     this.formData = { speciality: '', department: '', numberOfStudents: 0, startDate: new Date(), endDate: new Date() };
//   }

//   loadGroups(): void {
//     this.isLoading = true;
//     this.groupService.getAll().subscribe({
//       next: (data: Group[]) => {
//         console.log("Received data:", data); // Додайте лог для перевірки отриманих даних
//         this.groups = data;
//         this.isLoading = false;
//       },
//       error: (errorMessage) => {
//         console.error('Error fetching groups:', errorMessage);
//         this.isLoading = false;
//       }
//     });
//   }
  
//   createGroup(): void {
//     this.groupService.create(this.formData as Omit<Group, '_id'>).subscribe({
//       next: (group: Group) => {
//         this.groups.push(group);
//         this.resetForm();
//       },
//       error: (errorMessage) => console.error('Error creating group:', errorMessage)
//     });
//   }

//   updateGroup(): void {
//     if (this.selectedGroup?._id) {
//       this.groupService.update(this.selectedGroup._id, this.formData).subscribe({
//         next: (updateGroup: Group) => {
//           const index = this.groups.findIndex(g => g._id === updateGroup._id);
//           if (index !== -1) {
//             this.groups[index] = updateGroup;
//           }
//           this.cancelEdit();
//           this.errorMessage = '';
//         },
//         error: (errorMessage) => console.error('Error updating group:', errorMessage)
//       });
//     }
//   }

//   editGroup(group: Group): void {
//     this.selectedGroup = group;
//     this.isEditing = true;
//     this.formData = { ...group };
//   }

//   deleteGroup(id: string): void {
//     if (confirm('Are you sure you want to delete this group?')) {
//       this.groupService.delete(id).subscribe({
//         next: () => {
//           this.groups = this.groups.filter(g => g._id !== id);
//           this.errorMessage = '';
//         },
//         error: (errorMessage) => console.error('Error deleting group:', errorMessage)
//       });
//     }
//   }

//   cancelEdit(): void {
//     this.selectedGroup = null;
//     this.isEditing = false;
//     this.resetForm();
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../models/group.model';
import { GroupsService } from '../../services/group.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
    GroupsService
  ],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent extends BaseComponent<Group> {
  override formData: Partial<Group> = {
    speciality: '',
    department: '',
    numberOfStudents: 0,
    startDate: new Date(),
    endDate: new Date()
  };

  constructor(private readonly groupService: GroupsService) {
    super();
    this.entityService = groupService;
  }

  override resetForm(): void {
    this.formData = {
      speciality: '',
      department: '',
      numberOfStudents: 0,
      startDate: new Date(),
      endDate: new Date()
    };
  }
}