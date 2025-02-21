import { Entity } from "./entity.model";
export interface Report extends Entity {
    group: string;
    teacher: string;
    totalHours: number;
    payment: number;
    startDate: Date;
    endDate: Date;
  }