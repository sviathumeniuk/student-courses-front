import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Entity } from "../models/entity.model";

@Injectable()
export abstract class BaseService<T extends Entity> {
    protected constructor(
        private readonly http: HttpClient,
        private readonly endpoint: string
    ) {}

    protected get apiUrl(): string {
        return `${environment.apiUrl}${this.endpoint}`;
    }

    protected getHeaders(): HttpHeaders {
        const token = localStorage.getItem("token");
        return new HttpHeaders().set("Authorization", `Bearer ${token}`);
    }

    getAll(): Observable<T[]> {
        return this.http.get<T[]>(this.apiUrl, {
            headers: this.getHeaders()
        });
    }

    getById(id: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }

    create(entity: Omit<T, "_id">): Observable<T> {
        return this.http.post<T>(this.apiUrl, entity, {
            headers: this.getHeaders()
        });
    }

    update(id: string, entity: Partial<T>): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}/${id}`, entity, {
            headers: this.getHeaders()
        });
    }

    delete(id: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }
}