import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResClientService {

  constructor(private http: HttpClient) {}

  // Méthode GET
  get<T>(url: string, params?: any, headers?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    const httpHeaders = new HttpHeaders(headers || {});
    return this.http.get<T>(url, { params: httpParams, headers: httpHeaders });
  }

  // Méthode POST
  post<T>(url: string, body: any, headers?: any): Observable<T> {
    const httpHeaders = new HttpHeaders(headers || {});
    return this.http.post<T>(url, body, { headers: httpHeaders });
  }

  // Méthode PUT
  put<T>(url: string, body: any, headers?: any): Observable<T> {
    const httpHeaders = new HttpHeaders(headers || {});
    return this.http.put<T>(url, body, { headers: httpHeaders });
  }

  // Méthode PATCH
  patch<T>(url: string, body: any, headers?: any): Observable<T> {
    const httpHeaders = new HttpHeaders(headers || {});
    return this.http.patch<T>(url, body, { headers: httpHeaders });
  }

  // Méthode DELETE
  delete<T>(url: string, params?: any, headers?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    const httpHeaders = new HttpHeaders(headers || {});
    return this.http.delete<T>(url, { params: httpParams, headers: httpHeaders });
  }
}
