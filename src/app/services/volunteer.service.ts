// src/app/services/volunteer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private apiUrl = 'http://localhost:3000/api/volunteer'; // Match your backend URL

  constructor(private http: HttpClient) { }

  registerVolunteer(volunteerData: any): Observable<any> {
    return this.http.post(this.apiUrl, volunteerData);
  }
}