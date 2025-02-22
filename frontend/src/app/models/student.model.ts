import { Entity } from './entity.model';
export interface Student extends Entity {
  firstname: string;
  lastname: string;
  patronymic: string;
  email: string;
  phone: string;
  group: string;
  status: string;
}