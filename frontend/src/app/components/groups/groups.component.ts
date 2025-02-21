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