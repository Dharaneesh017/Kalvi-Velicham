// src/app/services/volunteer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; 
@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
 private apiUrl = environment.apiUrl; // Match your backend URL

  constructor(private http: HttpClient) { }

  registerVolunteer(volunteerData: any): Observable<any> {
    return this.http.post(this.apiUrl, volunteerData);
  }
}