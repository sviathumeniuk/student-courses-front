import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { User, LoginCredentials, LoginResponse } from "../models/auth.models";
import { tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.auth.login}`;
    private readonly currentUserSubject = new BehaviorSubject<User | null>(null);

    currentUser$ = this.currentUserSubject.asObservable();

    constructor (private readonly http: HttpClient) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.currentUserSubject.next(JSON.parse(savedUser));
        }
    }

    login(credentials: LoginCredentials): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}`, credentials)
        .pipe(
          tap((response) => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          })
        );
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    isLoggedIn(): boolean {
        return !!this.getToken() && !!this.getCurrentUser();
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }

    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        return user ? user.role === role : false;
    }
}