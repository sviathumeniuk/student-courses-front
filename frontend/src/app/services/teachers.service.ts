import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Teacher } from "../models/teacher.model";
import { BaseService } from "./base.service";

@Injectable({
    providedIn: 'root'
})
export class TeachersService extends BaseService<Teacher> {
  constructor(http: HttpClient) {
    super(http, environment.endpoints.teachers);
  }
}