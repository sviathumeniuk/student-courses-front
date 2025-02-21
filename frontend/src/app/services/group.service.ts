import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { Group } from "../models/group.model";

@Injectable({
  providedIn: 'root'
})
export class GroupsService extends BaseService<Group> {
  constructor(http: HttpClient) {
    super(http, environment.endpoints.groups);
  }
}