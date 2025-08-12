import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchoolService, FetchedSchool } from '../../services/school.service';
import { AuthService } from '../../services/auth.service';
import { AuthModalComponent } from '../auth-modal/auth-modal';
import { Router,RouterLink, RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
// Interface to add a 'before' image for a more compelling story
export interface SuccessStory extends FetchedSchool {
  imageBefore?: string; // URL for a "before renovation" image
}

@Component({
  selector: 'app-successstories',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink,RouterModule],
  templateUrl: './successstories.html',
  styleUrls: ['./successstories.css']
})
export class Successstories implements OnInit {
  // Data Storage
  allStories: SuccessStory[] = [];
  paginatedStories: SuccessStory[] = [];
  featuredStory: SuccessStory | null = null;
  currentYear: number = new Date().getFullYear();
  currentLanguage = 'english';
  // Filtering & Search
  districts: string[] = [];
  renovationTypes: string[] = ['All Types', 'Classrooms', 'Restrooms', 'Library', 'Playground', 'Drinking Water', 'Boundary Wall'];
  selectedDistrict: string = 'All Districts';
  selectedRenovationType: string = 'All Types';
  searchQuery: string = '';
totalStudentsImpacted: number = 0;
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6; // Show 6 stories per page
  totalPages: number = 0;
 showAuthModal: boolean = false;
  authModalInitialTab: 'login' | 'register' = 'login';
   private shouldRedirectAfterLogin: boolean = false;
  showRegistrationSuccessMessage: boolean = false;
  // Impact Metrics
  totalSchoolsCompleted: number = 0;
  totalFundsRaised: number = 0;
selectedSchoolForDonationId: string | null = null;
   constructor(
      private languageService: LanguageService,
      private schoolService: SchoolService,
      private authService: AuthService,
      private router: Router
    ) {}

  ngOnInit(): void {
    this.schoolService.getCompletedSchools().subscribe({
      next: (schools) => {
        // Assign a placeholder 'before' image to each story for demonstration
        this.allStories = schools.map(school => ({
          ...school,
          imageBefore: 'assets/images/placeholder-before.jpg' // Placeholder path
        }));
        
      this.totalSchoolsCompleted = this.allStories.length;
        this.totalFundsRaised = this.allStories.reduce((sum, school) => sum + school.amountRaised, 0);
        // --- ADD THIS LINE TO CALCULATE THE STUDENT TOTAL ---
        this.totalStudentsImpacted = this.allStories.reduce((sum, school) => sum + school.studentCount, 0);

        // Set the most recently completed school as the featured story
        if (this.allStories.length > 0) {
          this.featuredStory = this.allStories[0]; 
        }

        // Populate district filter
        const districtSet = new Set(schools.map(school => school.district));
        this.districts = ['All Districts', ...Array.from(districtSet).sort()];
        
        this.applyFiltersAndPagination();
      },
      error: (err) => console.error('Failed to fetch success stories:', err)
    });
  }
openAuthModal(initialTab: 'login' | 'register', schoolId: string | null = null): void {
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
  viewOnMap(school: FetchedSchool): void {
    const query = `${school.schoolNameEn}, ${school.district}, ${school.pincode}`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  }
  onAuthModalClose(): void {
    this.showAuthModal = false;
    this.selectedSchoolForDonationId = null;
    this.shouldRedirectAfterLogin = false;
    document.body.classList.remove('modal-open');
  }
  onAuthSuccess(event: { type: 'login' | 'register', user: any }): void {
    this.showAuthModal = false;
    if (event.type === 'login') {
      if (this.selectedSchoolForDonationId) {
        this.router.navigate(['/donate', this.selectedSchoolForDonationId]);
      } else {
        this.router.navigate(['/donate']);
      }
    }
    this.selectedSchoolForDonationId = null;
  }
  applyFiltersAndPagination(): void {
    // 1. Apply Search Filter
    let filtered = this.searchQuery
      ? this.allStories.filter(story =>
          story.schoolNameEn.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      : [...this.allStories];

    // 2. Apply District Filter
    if (this.selectedDistrict !== 'All Districts') {
      filtered = filtered.filter(story => story.district === this.selectedDistrict);
    }

    // 3. Apply Renovation Type Filter
    if (this.selectedRenovationType !== 'All Types') {
      filtered = filtered.filter(story => story.renovationAreas.includes(this.selectedRenovationType));
    }

    // 4. Calculate Pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page after filtering

    // 5. Slice data for the current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedStories = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFiltersAndPagination(); // Re-apply to get the correct slice
  }

  getStoryImage(story: SuccessStory): string {
    if (story.conditionPhotos && story.conditionPhotos.length > 0) {
      return `http://localhost:3000/uploads/${story.conditionPhotos[0]}`;
    }
    return 'assets/images/placeholder-after.jpg'; // Default "after" image
  }
}