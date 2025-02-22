import { Entity } from './entity.model';
export interface Group extends Entity {
  speciality: string;
  department: string;
  numberOfStudents: number;
  startDate: Date;
  endDate: Date;
}