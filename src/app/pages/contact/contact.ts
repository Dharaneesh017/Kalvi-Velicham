// contact.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service'; // Import LanguageService
import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  currentYear: number = new Date().getFullYear();
  isSubmitting: boolean = false;
  showSuccessPopup: boolean = false;
 
  constructor(public languageService: LanguageService, private http: HttpClient) {}

  onSubmit() {
    this.isSubmitting = true;

    // Replace with your actual API endpoint
    const apiUrl = 'http://localhost:3000/api/contact-message';

    this.http.post(apiUrl, this.formData).subscribe({
      next: (response) => {
        console.log('Message sent successfully!', response);
        this.isSubmitting = false;
        this.showSuccessPopup = true; // Show the pop-up
      },
      error: (err) => {
        console.error('Error sending message:', err);
        this.isSubmitting = false;
        // Optionally show an error message
        alert('There was an error sending your message. Please try again.');
      }
    });
  }

  closePopup() {
    this.showSuccessPopup = false;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}
