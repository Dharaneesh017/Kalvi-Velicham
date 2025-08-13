import { Component, OnDestroy, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchoolService, FetchedSchool } from '../../services/school.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

// --- CORRECTED INTERFACE ---
// This interface is now aligned with the data structure for the image carousel.
// It only includes the 'images' array and 'currentImageIndex'.
export interface SuccessStory extends FetchedSchool {
  images: string[];
  currentImageIndex: number;
}

@Component({
  selector: 'app-successstories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './successstories.html',
  styleUrls: ['./successstories.css']
})
export class Successstories implements OnInit, OnDestroy {
  allStories: SuccessStory[] = [];
  paginatedStories: SuccessStory[] = [];
  featuredStory: SuccessStory | null = null;
  currentYear: number = new Date().getFullYear();
  currentLanguage = 'english';

  // Filtering & Search properties
  districts: string[] = ['All Districts'];
  renovationTypes: string[] = ['All Types', 'Classrooms', 'Restrooms', 'Library', 'Playground', 'Drinking Water', 'Boundary Wall'];
  selectedDistrict: string = 'All Districts';
  selectedRenovationType: string = 'All Types';
  searchQuery: string = '';
  totalStudentsImpacted: number = 0;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  // Impact Metrics
  totalSchoolsCompleted: number = 0;
  totalFundsRaised: number = 0;
  private featuredStoryInterval: any;
  private currentFeaturedIndex = 0;
  
  constructor(
    private languageService: LanguageService,
    private schoolService: SchoolService, // Inject the service
    private router: Router,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const schoolImageMap = new Map<string, string[]>([
      ['33123456807', ['assets/images/successstories/kuniyamuthur_classroom.png', 'assets/images/successstories/kuniyamuthur_drainage.png']],
      ['33123456797', ['assets/images/successstories/royapettai_ground.png', 'assets/images/successstories/royapettai_ground.png']],
      ['33123456820', ['assets/images/successstories/bhuvanagiri_water.png', 'assets/images/successstories/bhuvanagiri_water.png']],
      ['33123456810', ['assets/images/successstories/sulur_classrooms.png', 'assets/images/successstories/sulur_restrooms.png']],
    ]);

    this.schoolService.getCompletedSchools().subscribe({
      next: (schools) => {
        // This mapping logic is correct and now matches the updated interface.
        this.allStories = schools.map(school => {
          const images = schoolImageMap.get(school.udiseCode);
          return {
            ...school,
            images: images || ['assets/images/default-before.jpg', 'assets/images/default-after.jpg'],
            currentImageIndex: 0
          };
        });

        console.log('Total schools for featured carousel:', this.allStories.length);

        this.totalSchoolsCompleted = this.allStories.length;
        this.totalFundsRaised = this.allStories.reduce((sum, story) => sum + story.amountRaised, 0);
        this.totalStudentsImpacted = this.allStories.reduce((sum, story) => sum + story.studentCount, 0);

        if (this.allStories.length > 0) {
          this.featuredStory = this.allStories[0];
          // Start the carousel only if there is more than one story
          if (this.allStories.length > 1) {
              this.startFeaturedStoryCarousel();
          }
        }

        const districtSet = new Set(schools.map(school => school.district));
        this.districts = ['All Districts', ...Array.from(districtSet).sort()];
        
        this.applyFiltersAndPagination();
      },
      error: (err) => console.error('Failed to fetch success stories:', err)
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.featuredStoryInterval);
  }

  startFeaturedStoryCarousel(): void {
    this.featuredStoryInterval = setInterval(() => {
      this.currentFeaturedIndex = (this.currentFeaturedIndex + 1) % this.allStories.length;
      this.featuredStory = this.allStories[this.currentFeaturedIndex];
      this.ref.markForCheck();
    }, 5000);
  }

 showNextImage(story: SuccessStory): void {
    story.currentImageIndex = (story.currentImageIndex + 1) % story.images.length;
  }
showPrevImage(story: SuccessStory): void { 
    story.currentImageIndex = (story.currentImageIndex - 1 + story.images.length) % story.images.length;
  }
  
  applyFiltersAndPagination(): void {
    let filtered = [...this.allStories];
    if (this.searchQuery) {
      filtered = filtered.filter(story =>
        story.schoolNameEn.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    if (this.selectedDistrict !== 'All Districts') {
      filtered = filtered.filter(story => story.district === this.selectedDistrict);
    }
    if (this.selectedRenovationType !== 'All Types') {
      filtered = filtered.filter(story => story.renovationAreas.some(area => area === this.selectedRenovationType));
    }
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedStories = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFiltersAndPagination();
  }
}