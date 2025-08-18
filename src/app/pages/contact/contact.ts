// contact.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service'; // Import LanguageService

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
 
  constructor(public languageService: LanguageService) {} // Make LanguageService public

  onSubmit() {
    console.log('Form Submitted!', this.formData);
    
  }
}