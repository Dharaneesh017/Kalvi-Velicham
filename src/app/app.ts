// src/app/app.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf, *ngFor etc.
import { RouterOutlet, Router } from '@angular/router'; // Import Router
import { NavigationComponent } from './pages/navigation/navigation'; // <-- Import your NavigationComponent
import { AuthModalComponent } from './pages/auth-modal/auth-modal';// <-- Import your AuthModalComponent
import { AuthService } from './services/auth.service'; // <-- Import your AuthService

@Component({
  selector: 'app-root', // Make sure this matches your index.html <app-root>
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavigationComponent, // Add NavigationComponent to imports
    AuthModalComponent   // Add AuthModalComponent to imports
  ],
  templateUrl: './app.html', // Your HTML file is app.html
  styleUrls: ['./app.css']   // Your CSS file is app.css
})
export class App implements OnInit { // Your root component class is named App
  title = 'school-renovation-app'; // Example title

  // Properties to control the Auth Modal
  showAuthModal: boolean = false;
  authModalInitialTab: 'login' | 'register' = 'login';
  selectedSchoolForDonationId: string | null = null; // To pass school ID if "Support This School" was clicked

  constructor(
    private authService: AuthService, // Inject AuthService
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    // Any initialization logic for your root App component
  }

  // Handler for opening the Auth Modal, triggered by NavigationComponent's openAuthModalRequest event
  // This method receives the event payload from the NavigationComponent
  openAuthModalHandler(event: { initialTab: 'login' | 'register', schoolId: string | null }): void {
    // Before showing the modal, check if the user is already logged in
    // This handles cases where a user clicks "Donate" from navigation while already logged in
    if (this.authService.isLoggedIn()) {
      // If logged in, directly navigate to the donate page
      // Use event.schoolId if it came from a specific "Support This School" button (though navigation usually doesn't have it)
      this.router.navigate(['/donate', event.schoolId || 'general']);
      return; // Exit as we are redirecting
    }

    // If not logged in, proceed to show the modal
    this.authModalInitialTab = event.initialTab;
    this.selectedSchoolForDonationId = event.schoolId; // Store the school ID for post-login redirection
    this.showAuthModal = true; // Set to true to display the modal
    document.body.classList.add('modal-open'); // Optional: Add class to body to prevent scrolling
  }

  // Handler for when the Auth Modal requests to be closed (e.g., user clicks X or overlay)
  onAuthModalClose(): void {
    this.showAuthModal = false; // Set to false to hide the modal
    this.selectedSchoolForDonationId = null; // Clear selected school ID
    document.body.classList.remove('modal-open'); // Remove body class
  }

  // Handler for successful authentication from the modal
  // This method is only triggered by successful LOGIN from the modal now
  onAuthSuccess(event: { type: 'login' | 'register', user: any }): void {
    // This method should only be called for 'login' events from auth-modal.component.ts
    // (because we removed the emit for 'register' in auth-modal.component.ts)
    this.showAuthModal = false; // Close the modal for successful login

    if (event.type === 'login') {
      // Redirect to the donate page after successful login
      if (this.selectedSchoolForDonationId) {
        this.router.navigate(['/donate', this.selectedSchoolForDonationId]);
      } else {
        this.router.navigate(['/donate']); // Default for general donate button
      }
    }
    this.selectedSchoolForDonationId = null; // Clear selected school ID
  }
}