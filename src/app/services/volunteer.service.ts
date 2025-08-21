// src/app/services/volunteer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; 
@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  // Construct the full URL for the volunteer endpoint
  private volunteerApiUrl = `${environment.apiUrl}/volunteer`; // <-- THIS IS THE FIX

  constructor(private http: HttpClient) { }

  /**
   * Registers a new volunteer by sending data to the correct backend endpoint.
   * @param volunteerData The volunteer's form data.
   */
  registerVolunteer(volunteerData: any): Observable<any> {
    // Use the full, corrected URL for the POST request
    return this.http.post(this.volunteerApiUrl, volunteerData);
  }
}