// src/app/services/school.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- Define Interfaces Here ---
// This interface defines the structure of the data that will be sent TO your Node.js backend
// It should match your Mongoose Schema fields exactly.
export interface SchoolFormData {
  schoolNameEn: string;
  schoolNameTa: string;
  udiseCode: string;
  schoolType: string;
  district: string;
  block: string;
  address: string;
  addressTa: string;
  pincode: string;
  establishedYear: number;
  studentCount: number;
  teacherCount: number;
  principalName: string;
  principalContact: string;
  principalEmail: string;
  renovationAreas: string[]; // Array of strings (labels)
  priority: string;
  budgetRange?: string; // Optional
  currentCondition: string;
  expectedOutcome?: string; // Optional
  recognitionCert?: string; // Optional, stores filename
  assessmentReport?: string; // Optional, stores filename
  conditionPhotos?: string; // Optional, stores filename
  budgetEstimates?: string; // Optional, stores filename
}

// This interface defines the structure of the data you expect to GET FROM your Node.js backend
// It should closely match your Mongoose Schema fields, including the _id and submittedAt.
export interface FetchedSchool {
  _id: string; // MongoDB auto-generated ID
  schoolNameEn: string;
  schoolNameTa: string;
  udiseCode: string;
  schoolType: string;
  district: string;
  block: string;
  address: string;
  pincode: string;
  establishedYear: number;
  studentCount: number;
  teacherCount: number;
  principalName: string;
  principalContact: string;
  principalEmail: string;
  renovationAreas: string[];
  priority: string;
  budgetRange?: string; // Use optional if it might not always be present
  currentCondition: string;
  expectedOutcome?: string; // Use optional
  recognitionCert?: string;
  assessmentReport?: string;
  conditionPhotos?: string;
  budgetEstimates?: string;
  submittedAt: Date; // From your backend schema
}
// --- End Interfaces ---


@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  // IMPORTANT: This must match the port your Node.js API is running on!
  private apiUrl = 'http://localhost:3000/api/schools';

  constructor(private http: HttpClient) { }

  /**
   * Submits school data to the backend API.
   * @param schoolData The data object to be sent, structured to match the backend schema.
   * @returns An Observable of the API response.
   */
  submitSchool(schoolData: SchoolFormData): Observable<any> { // Use SchoolFormData type
    return this.http.post<any>(this.apiUrl, schoolData);
  }

  /**
   * Fetches all school data from the backend API.
   * (Optional: useful for displaying existing submissions or testing).
   * @returns An Observable of an array of school data.
   */
  getSchools(): Observable<FetchedSchool[]> { // Use FetchedSchool[] type
    return this.http.get<FetchedSchool[]>(this.apiUrl);
  }
}