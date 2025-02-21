import { Entity } from "./entity.model";
export interface Load extends Entity {
    teacher: string;
    group: string;
    subject: string;
    hours: number;
    typeOfClass: string;
    paymentPerHour: number;
  }
  