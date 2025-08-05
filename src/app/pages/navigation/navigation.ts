import { Component,EventEmitter, OnInit,Output, OnDestroy, ViewEncapsulation } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthModalComponent } from '../auth-modal/auth-modal';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule,AuthModalComponent],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit, OnDestroy {
  currentLanguage = 'english';
  isMobileMenuOpen = false;
  showAuthModal: boolean = false;
  authModalInitialTab: 'login' | 'register' = 'login';
  selectedSchoolForDonationId: string | null = null; 
  private shouldRedirectAfterLogin: boolean = false;
  showRegistrationSuccessMessage: boolean = false;
  @Output() openAuthModalRequest = new EventEmitter<{ initialTab: 'login' | 'register', schoolId: string | null }>();

  // ✅ Declare it here
  private langSubscription!: Subscription;

  constructor(
     private authService: AuthService, // <-- 2. Inject AuthService here
    private router:Router,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Subscribe to language changes
    this.langSubscription = this.languageService.language$.subscribe(language => {
      this.currentLanguage = language;
    });
  }

  toggleLanguage(event: any): void {
    const selected = event.target.value;
    const lang = selected === 'ta' ? 'tamil' : 'english';
    this.languageService.setLanguage(lang);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
   openAuthModal(initialTab: 'login' | 'register', schoolId: string | null = null): void {
    // REMOVE THIS LINE: this.showRegistrationSuccessMessage = false;

    if (this.authService.isLoggedIn() && schoolId) {
      this.router.navigate(['/donate', schoolId]);
      return;
    }

    this.authModalInitialTab = initialTab;
    this.selectedSchoolForDonationId = schoolId;
    this.showAuthModal = true;
    this.shouldRedirectAfterLogin = (initialTab === 'login');

    document.body.classList.add('modal-open');
  }
    onAuthSuccess(event: { type: 'login' | 'register', user: any }): void {
    // This method will now ONLY be called for 'login' events from auth-modal.component.ts
    // because we removed the emit for 'register' in auth-modal.component.ts.
    this.showAuthModal = false; // Close the modal for successful login

    if (event.type === 'login') {
      if (this.selectedSchoolForDonationId) {
        this.router.navigate(['/donate', this.selectedSchoolForDonationId]);
      } else {
        this.router.navigate(['/donate']);
      }
    }
    // No else if (event.type === 'register') block needed here anymore as it won't be triggered
    this.selectedSchoolForDonationId = null;
  }
   onAuthModalClose(): void {
    this.showAuthModal = false;
    this.selectedSchoolForDonationId = null;
    this.shouldRedirectAfterLogin = false;
    document.body.classList.remove('modal-open');
  }
  ngOnDestroy(): void {
    // Cleanup
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
