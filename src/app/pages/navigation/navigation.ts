import { Component,EventEmitter, OnInit,Output, OnDestroy, ViewEncapsulation } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit, OnDestroy {
  currentLanguage = 'english';
  isMobileMenuOpen = false;
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
  openAuthModalForDonate(): void {
    if (this.authService.isLoggedIn()) {
      // If already logged in, navigate directly to the donate page
      this.router.navigate(['/donate']);
    } else {
      // If not logged in, request parent to open the auth modal for login
      this.openAuthModalRequest.emit({ initialTab: 'login', schoolId: null });
    }
  }
  ngOnDestroy(): void {
    // Cleanup
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
