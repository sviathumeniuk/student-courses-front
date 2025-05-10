// src/app/components/base/base.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { BaseComponent } from './base.component';
import { Entity } from '../../models/entity.model';

// Create a mock entity type for testing
interface TestEntity extends Entity {
  name: string;
}

// Mock entity service
class MockEntityService {
  getAll = jasmine.createSpy('getAll').and.returnValue(of([]));
  getById = jasmine.createSpy('getById').and.returnValue(of({}));
  create = jasmine.createSpy('create').and.returnValue(of({}));
  update = jasmine.createSpy('update').and.returnValue(of({}));
  delete = jasmine.createSpy('delete').and.returnValue(of({}));
}

describe('BaseComponent', () => {
  let component: BaseComponent<TestEntity>;
  let fixture: ComponentFixture<BaseComponent<TestEntity>>;
  let mockService: MockEntityService;

  beforeEach(async () => {
    mockService = new MockEntityService();

    await TestBed.configureTestingModule({
      imports: [FormsModule, BaseComponent],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(BaseComponent<TestEntity>);
    component = fixture.componentInstance;
    component.entityService = mockService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load entities on init', () => {
    const testEntities: TestEntity[] = [
      { _id: '1', name: 'Entity 1' },
      { _id: '2', name: 'Entity 2' }
    ];
    mockService.getAll.and.returnValue(of(testEntities));

    component.ngOnInit();

    expect(mockService.getAll).toHaveBeenCalled();
    expect(component.entities).toEqual(testEntities);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when loading entities', () => {
    mockService.getAll.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'log');

    component.loadEntities();

    expect(mockService.getAll).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should load entity by id', () => {
    const testEntity: TestEntity = { _id: '1', name: 'Entity 1' };
    mockService.getById.and.returnValue(of(testEntity));

    component.loadEntityById('1');

    expect(mockService.getById).toHaveBeenCalledWith('1');
    expect(component.searchedEntity).toEqual(testEntity);
    expect(component.isLoading).toBeFalse();
  });

  it('should create a new entity', () => {
    const newEntity: TestEntity = { _id: '1', name: 'New Entity' };
    mockService.create.and.returnValue(of(newEntity));
    component.formData = { name: 'New Entity' };
    spyOn(component, 'resetForm');

    component.createEntity();

    expect(mockService.create).toHaveBeenCalledWith({ name: 'New Entity' });
    expect(component.entities.length).toBe(1);
    expect(component.entities[0]).toEqual(newEntity);
    expect(component.resetForm).toHaveBeenCalled();
  });

  it('should update an entity', () => {
    const existingEntity: TestEntity = { _id: '1', name: 'Original Entity' };
    const updatedEntity: TestEntity = { _id: '1', name: 'Updated Entity' };
    
    component.entities = [existingEntity];
    component.selectedEntity = existingEntity;
    component.formData = { name: 'Updated Entity' };
    
    mockService.update.and.returnValue(of(updatedEntity));
    spyOn(component, 'cancelEdit');

    component.updateEntity();

    expect(mockService.update).toHaveBeenCalledWith('1', { name: 'Updated Entity' });
    expect(component.entities[0]).toEqual(updatedEntity);
    expect(component.cancelEdit).toHaveBeenCalled();
  });

  it('should delete an entity', () => {
    const entity1: TestEntity = { _id: '1', name: 'Entity 1' };
    const entity2: TestEntity = { _id: '2', name: 'Entity 2' };
    component.entities = [entity1, entity2];
    
    spyOn(window, 'confirm').and.returnValue(true);
    mockService.delete.and.returnValue(of(undefined));

    component.deleteEntity('1');

    expect(mockService.delete).toHaveBeenCalledWith('1');
    expect(component.entities.length).toBe(1);
    expect(component.entities[0]._id).toBe('2');
  });

  it('should set up for editing', () => {
    const entity: TestEntity = { _id: '1', name: 'Entity 1' };
    
    component.editEntity(entity);

    expect(component.selectedEntity).toBe(entity);
    expect(component.formData).toEqual(entity);
    expect(component.isEditing).toBeTrue();
  });

  it('should cancel editing', () => {
    component.selectedEntity = { _id: '1', name: 'Entity 1' };
    component.isEditing = true;
    component.formData = { name: 'Entity 1' };
    
    spyOn(component, 'resetForm');

    component.cancelEdit();

    expect(component.selectedEntity).toBeNull();
    expect(component.isEditing).toBeFalse();
    expect(component.resetForm).toHaveBeenCalled();
  });

  it('should reset the form', () => {
    component.formData = { name: 'Test Name' };
    
    component.resetForm();
    
    expect(component.formData).toEqual({});
  });
});