import { Entity } from './entity.model';
export interface Teacher extends Entity {
  firstname: string;
  lastname: string;
  patronymic: string;
  email: string;
  phone: string;
  experience: number;
}