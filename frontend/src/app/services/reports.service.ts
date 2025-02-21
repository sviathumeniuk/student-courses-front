import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http";
import { Report } from "../models/report.model"
import { environment } from "../../environments/environment"
import { BaseService } from "./base.service";

@Injectable({
    providedIn: 'root'
})
export class ReportsService extends BaseService<Report> {
    constructor(http: HttpClient) {
        super(http, environment.endpoints.reports);
    }
}