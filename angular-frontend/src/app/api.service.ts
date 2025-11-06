import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    return headers;
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login/`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register/`, userData);
  }

  getStrategies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/strategies/user-strategies/`, { headers: this.getHeaders() });
  }

  createStrategy(strategy: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/strategies/user-strategies/`, strategy, { headers: this.getHeaders() });
  }

  getStocks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/options/stocks/`, { headers: this.getHeaders() });
  }
}