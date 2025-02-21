import { Component, Input, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Entity } from '../../models/entity.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent<T extends Entity> implements OnInit {
  @Input() entityService: any;
  entities: T[] = [];
  isLoading: boolean = false;
  isEditing: boolean = false;
  selectedEntity: T | null = null;
  formData: Partial<T> = {};

  constructor() {}

  ngOnInit(): void {
    this.loadEntities();
  }

  loadEntities(): void {
    this.isLoading = true;
    this.entityService.getAll().subscribe({
      next: (data: T[]) => {
        this.entities = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.log('Error loading entities: ', error);
        this.isLoading = false;
      }
    });
  }

  createEntity(): void {
    this.entityService.create(this.formData as Omit<T, 'id'>).subscribe({
      next: (entity: T) => {
        this.entities.push(entity);
        this.resetForm();
      },
      error: (error: any) => console.log('Error creating entity: ', error)
    });
  }

  updateEntity(): void {
    if (this.selectedEntity?._id) {
      this.entityService.update(this.selectedEntity._id, this.formData).subscribe({
        next: (updatedEntity: T) => {
          const index = this.entities.findIndex(e => e._id === updatedEntity._id);
          if (index !== -1) {
            this.entities[index] = updatedEntity;
          }
          this.cancelEdit();
        },
        error: (error: any) => console.log('Error updating entity: ', error)
      });
    }
  }

  editEntity(entity: T): void {
    this.selectedEntity = entity;
    this.formData = { ...entity };
    this.isEditing = true;
  }

  deleteEntity(id: string): void {
    if (confirm('Are you sure you want to delete this entity?')) {
      this.entityService.delete(id).subscribe({
        next: () => {
          this.entities = this.entities.filter(e => e._id !== id);
        },
        error: (error: any) => console.log('Error deleting entity: ', error)
      });
    }
  }

  cancelEdit(): void {
    this.selectedEntity = null;
    this.isEditing = false;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {};
  }
}
