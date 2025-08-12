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
  conditionPhotos?: string[];
  budgetEstimates?: string;
  submittedAt: Date;
  image?: string;
  amountRaised: number;
  fundingGoal: number;
  fundingStatus: string;
}


@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  // --- FIX 1: Set the API URL to the common base path ---
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * Submits the school registration form data to the backend.
   * @param schoolData The form data, including files.
   */
  submitSchool(schoolData: FormData): Observable<any> {
    // --- FIX 2: Append the specific endpoint for this call ---
    return this.http.post<any>(`${this.apiUrl}/schools`, schoolData);
  }

  /**
   * Fetches a list of schools that are currently funding.
   */
  getSchools(): Observable<FetchedSchool[]> {
    // --- FIX 3: Append the specific endpoint for this call ---
    return this.http.get<FetchedSchool[]>(`${this.apiUrl}/schools`);
  }

  /**
  * Fetches schools whose funding goals have been completed.
  */
  getCompletedSchools(): Observable<FetchedSchool[]> {
    // --- FIX 4: Append the specific endpoint for this call ---
    return this.http.get<FetchedSchool[]>(`${this.apiUrl}/schools/completed`);
  }
}