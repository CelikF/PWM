import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServerService {
  private baseUrl = 'http://example.com/api';

  constructor(private http: HttpClient) { }

  updateUser(userId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${userId}`, updatedData);
  }
}