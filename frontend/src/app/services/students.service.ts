import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Student } from "../models/student.model";
import { BaseService } from "./base.service";

@Injectable({
    providedIn: 'root'
})
export class StudentsService extends BaseService<Student> {
    constructor(http: HttpClient) {
        super(http, environment.endpoints.students);
    }
}