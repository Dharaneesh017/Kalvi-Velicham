import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule

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
currentLanguage = 'english';
  currentYear: number = new Date().getFullYear();
 
  onSubmit() {
    console.log('Form Submitted!', this.formData);
    
  }
}