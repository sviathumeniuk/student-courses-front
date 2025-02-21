import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Load } from "../models/load.model";

@Injectable({
  providedIn: 'root'
})
export class LoadsService extends BaseService<Load> {
  constructor(http: HttpClient) {
    super(http, environment.endpoints.loads);
  }
}