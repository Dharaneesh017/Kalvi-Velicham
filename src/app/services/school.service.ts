// src/app/services/school.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Defines the structure for the data being SENT TO the server.
 * This is used when submitting the form.
 */
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
  renovationAreas: string[];
  priority: string;
  budgetRange?: string;
  currentCondition: string;
  
  expectedOutcome?: string;
  recognitionCert?: string;
  assessmentReport?: string;
  // --- CRITICAL FIX ---
  // This property now correctly expects an array of strings for the photo names.
  conditionPhotos?: string[];
  budgetEstimates?: string;
}

/**
 * Defines the structure for the data being RECEIVED FROM the server.
 * This is used when fetching existing school data.
 */
export interface FetchedSchool {
  _id: string;
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
  budgetRange?: string;
  currentCondition: string;
  expectedOutcome?: string;
  recognitionCert?: string;
  assessmentReport?: string;
  // Updated for consistency to expect an array of photo names.
 conditionPhotos?: string[];
  budgetEstimates?: string;
  submittedAt: Date;
  image?: string;
}


@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  // Ensure this URL matches your backend API endpoint
  private apiUrl = 'http://localhost:3000/api/schools';

  constructor(private http: HttpClient) { }

  /**
   * Submits the school registration form data to the backend.
   * @param schoolData The form data, matching the SchoolFormData interface.
   */
  submitSchool(schoolData: FormData): Observable<any> { // <--- CHANGE THIS LINE
    return this.http.post<any>(this.apiUrl, schoolData);
  }
  /**
   * Fetches a list of all registered schools from the backend.
   */
  getSchools(): Observable<FetchedSchool[]> {
    return this.http.get<FetchedSchool[]>(this.apiUrl);
  }
}