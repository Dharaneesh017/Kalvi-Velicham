import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { LanguageService } from '../../services/language.service'; // Adjust path as needed
import { AuthService } from '../../services/auth.service'; // We will create this service

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './auth-modal.html',
  styleUrls: ['./auth-modal.css'],
  encapsulation: ViewEncapsulation.None // Ensure modal styles can affect global if needed
})
export class AuthModalComponent implements OnInit {
  @Input() initialTab: 'login' | 'register' = 'login'; // Allow parent to set initial tab
  @Output() closeModalEvent = new EventEmitter<void>();
  // Change the type of authSuccess to emit an object
  @Output() authSuccess = new EventEmitter<{ type: 'login' | 'register', user: any }>(); // Event to emit on successful login/register

  activeTab: 'login' | 'register' = 'login';
  currentLanguage: string = 'english';

  loginForm = {
    email: '',
    password: ''
  };
  registerForm = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    termsAgree: false
  };

  loginError: string = '';
  registerError: string = '';
  registrationSuccessMessage: string = '';
  constructor(
    private languageService: LanguageService,
    private authService: AuthService // Inject the AuthService
  ) {}

  ngOnInit(): void {
    this.activeTab = this.initialTab;
    this.languageService.language$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

   setActiveTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    // Clear all messages/errors when switching tabs
    this.loginError = '';
    this.registerError = '';
    this.registrationSuccessMessage = '';
  }

    closeModal(): void {
    this.closeModalEvent.emit();
    // Clear all messages/errors when closing the modal
    this.loginError = '';
    this.registerError = '';
    this.registrationSuccessMessage = '';
  }

  async onLogin(): Promise<void> {
    this.loginError = '';
    this.registrationSuccessMessage = ''; // Clear any registration success message on login attempt
    if (!this.loginForm.email || !this.loginForm.password) {
      this.loginError = this.currentLanguage === 'english' ? 'Please enter both email and password.' : 'மின்னஞ்சல் மற்றும் கடவுச்சொல் இரண்டையும் உள்ளிடவும்.';
      return;
    }

    try {
      const response = await this.authService.login(this.loginForm.email, this.loginForm.password).toPromise();
      this.authSuccess.emit({ type: 'login', user: response.user }); // Emit for parent to handle redirection
      this.closeModal(); // Close modal on successful login
    } catch (error: any) {
      console.error('Login error:', error);
      this.loginError = this.currentLanguage === 'english' ?
        (error.error?.message || 'Invalid credentials. Please try again.') :
        (error.error?.messageTa || 'தவறான உள்நுழைவு விவரங்கள். மீண்டும் முயற்சிக்கவும்.');
    }
  }


  async onRegister(): Promise<void> {
    this.registerError = '';
    this.registrationSuccessMessage = ''; // Clear previous errors/messages
    if (!this.registerForm.fullName || !this.registerForm.email || !this.registerForm.password || !this.registerForm.confirmPassword || !this.registerForm.termsAgree) {
      this.registerError = this.currentLanguage === 'english' ? 'Please fill in all required fields and agree to the terms.' : 'அனைத்து தேவையான புலங்களையும் நிரப்பி விதிமுறைகளை ஒப்புக்கொள்ளவும்.';
      return;
    }
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.registerError = this.currentLanguage === 'english' ? 'Passwords do not match.' : 'கடவுச்சொற்கள் பொருந்தவில்லை.';
      return;
    }

    try {
      const response = await this.authService.register(this.registerForm).toPromise();

      // SUCCESSFUL REGISTRATION:
      this.registrationSuccessMessage = this.currentLanguage === 'english' ?
        'Registration successful! Please login to proceed.' :
        'பதிவு வெற்றிகரமாக முடிந்தது! உள்நுழையவும்.';
      this.registerForm = { // Clear the form after successful registration
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        termsAgree: false
      };
      // Automatically switch to the Login tab
      // *** DO NOT CALL this.authSuccess.emit() here ***
      // *** DO NOT CALL this.closeModal() here ***
      // This ensures the modal stays open with the success message and switches to login.

    } catch (error: any) {
      console.error('Registration error:', error);
      this.registerError = this.currentLanguage === 'english' ?
        (error.error?.message || 'Registration failed. Please try again.') :
        (error.error?.messageTa || 'பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.');
    }
  }
  
}