import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { RouterModule } from '@angular/router';
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

  // ✅ Declare it here
  private langSubscription!: Subscription;

  constructor(private languageService: LanguageService) {}

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

  ngOnDestroy(): void {
    // Cleanup
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
