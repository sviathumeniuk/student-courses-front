export interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    password: string;
    __v: number;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }