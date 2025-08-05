import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { SchoolService, FetchedSchool } from '../../services/school.service';
import { AuthModalComponent } from '../auth-modal/auth-modal';
import { AuthService } from '../../services/auth.service';
import * as L from 'leaflet';
import { Icon } from 'leaflet';

// Define a new type that extends FetchedSchool and adds coordinates.
interface SchoolWithCoords extends FetchedSchool {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, RouterLink, AuthModalComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class Home implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  currentLanguage = 'english';
  currentYear: number = new Date().getFullYear();
  showMap = false;
  fetchedSchools: SchoolWithCoords[] = [];

  selectedSchoolName = '';
  private map: any;

  successStories = [
    {
      title: 'Salem Village School Transformation',
      titleTa: 'சேலம் கிராமப் பள்ளியின் மாற்றம்',
      description: '200% increase in student enrollment after complete renovation',
      descriptionTa: 'முழுமையான புதுப்பிப்புக்குப் பிறகு வெற்றிகரமான மாணவர் சேர்க்கை 200% அதிகரித்துள்ளது',
      image: 'assets/images/salem-school.jpeg',
      date: '15 January 2023'
    },
    {
      title: 'Madurai Urban School Renewal',
      titleTa: 'மதுரை நகர்ப்புற பள்ளி புதுப்பிப்பு',
      description: 'New science lab and library enhanced student learning experience',
      descriptionTa: 'புதிய அறிவியல் ஆய்வகம் மற்றும் நூலகம் மாணவர்களின் கற்றல் அனுபவத்தை மேம்படுத்தியது',
      image: 'assets/images/success-2.jpg',
      date: '2 March 2023'
    }
  ];

  howItWorks = [
    {
      step: 1,
      title: 'Schools Register',
      titleTa: 'பள்ளிகள் பதிவு செய்கின்றன',
      description: 'Government schools register on our platform with their needs',
      descriptionTa: 'அரசு பள்ளிகள் தங்கள் தேவைகளுடன் எங்கள் தளத்தில் பதிவு செய்கின்றன'
    },
    {
      step: 2,
      title: 'Needs Assessment',
      titleTa: 'தேவை மதிப்பாய்வு',
      description: 'Our team assesses school facilities and requirements',
      descriptionTa: 'எங்கள் குழு பள்ளி வசதிகள் மற்றும் தேவைகளை மதிப்பிடுகிறது'
    },
    {
      step: 3,
      title: 'Project Listed',
      titleTa: 'திட்டம் வெளியிடப்பட்டது',
      description: 'School projects are listed for donors and volunteers',
      descriptionTa: 'பள்ளி திட்டங்கள் நன்கொடையாளர்கள் மற்றும் தன்னார்வலர்களுக்கு வெளியிடப்படுகின்றன'
    },
    {
      step: 4,
      title: 'Funding & Volunteering',
      titleTa: 'நிதி மற்றும் தன்னார்வ',
      description: 'Community members can donate funds or pledge their time',
      descriptionTa: 'சமூக உறுப்பினர்கள் நிதியளிக்கலாம் அல்லது தங்கள் நேரத்தை அர்ப்பணிக்கலாம்'
    },
    {
      step: 5,
      title: 'School Improvement',
      titleTa: 'பள்ளி மேம்பாடு',
      description: 'School facilities are upgraded and delivered to students',
      descriptionTa: 'பள்ளி வசதிகள் மேம்படுத்தப்பட்டு மாணவர்களுக்கு ஒப்படைக்கப்படுகின்றன'
    }
  ];
  currentImageIndex: number = 0;
  private imageInterval: any;
  heroBackgroundImages: string[] = [
    'assets/images/hero-slider/one.png',
    'assets/images/hero-slider/two.png',
    'assets/images/hero-slider/three.png',
    'assets/images/hero-slider/four.png',
    'assets/images/hero-slider/five.png',
    'assets/images/hero-slider/six.png',
    'assets/images/hero-slider/seven.png',
    'assets/images/hero-slider/eight.png',
    'assets/images/hero-slider/nine.png',
    'assets/images/hero-slider/ten.png',
    'assets/images/hero-slider/eleven.png'
  ];
  showAuthModal: boolean = false;
  authModalInitialTab: 'login' | 'register' = 'login';
  selectedSchoolForDonationId: string | null = null;
  private shouldRedirectAfterLogin: boolean = false;
  showRegistrationSuccessMessage: boolean = false;

  constructor(
    private languageService: LanguageService,
    private schoolService: SchoolService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.currentLanguage = lang;
    });
    this.startImageSlider();

    this.schoolService.getSchools().subscribe({
      next: (schools) => {
        this.fetchedSchools = schools.map(school => ({
          ...school,
          // Assign random lat/lng if the data doesn't have it
          lat: (school as any).lat || (11.1271 + (Math.random() - 0.5) * 0.5),
          lng: (school as any).lng || (78.6569 + (Math.random() - 0.5) * 0.5)
        }));
        console.log('Fetched schools:', this.fetchedSchools);
      },
      error: (error) => {
        console.error('Error fetching schools:', error);
        alert('பள்ளி விவரங்களைப் பெறுவதில் சிக்கல் ஏற்பட்டது. பின்னர் முயற்சிக்கவும்.');
      }
    });

    const defaultIcon = Icon.Default;
    defaultIcon.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
    });
    Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.7.1/dist/images/';
  }

  ngOnDestroy(): void {
    if (this.map) {
        this.map.remove();
      }
    if (this.imageInterval) {
      clearInterval(this.imageInterval);
    }
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'english' ? 'tamil' : 'english';
    this.languageService.setLanguage(this.currentLanguage);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  getText(english: string, tamil: string): string {
    return this.currentLanguage === 'english' ? english : tamil;
  }

 showMapForSchool(school: SchoolWithCoords): void {
  this.selectedSchoolName = this.getText(school.schoolNameEn, school.schoolNameTa);
  this.showMap = true;

  // This is the critical part.
  setTimeout(() => {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('schoolMap').setView([school.lat, school.lng], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    L.marker([school.lat, school.lng])
      .addTo(this.map)
      .bindPopup(`<b>${this.selectedSchoolName}</b>`)
      .openPopup();

    this.map.invalidateSize();
  }, 500); // You can increase this delay to 700 or 1000 if needed
}

  getProgressBarStyle(school: FetchedSchool): string {
    const progress = school.studentCount ? Math.min(100, Math.floor(school.studentCount / 10) * 5) : (Math.floor(Math.random() * 80) + 10);
    return `width: ${progress}%;`;
  }

  closeMap(): void {
    this.showMap = false;
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  getDisplayProgress(school: FetchedSchool): number {
    return school.studentCount ? Math.min(100, Math.floor(school.studentCount / 10) * 5) : (Math.floor(Math.random() * 80) + 10);
  }

  getSchoolImageUrl(school: FetchedSchool): string {
    const images = [
      'assets/images/ooty-school.jpeg',
      'assets/images/mahabalipuram-school.jpeg',
      'assets/images/kanyakumari-school.jpeg',
      'assets/images/success-1.jpg',
      'assets/images/success-2.jpg',
      'assets/images/aboutschool.jpg'
    ];
    const index = parseInt(school.udiseCode.slice(-1), 10) % images.length;
    return images[index];
  }

  getNeedsText(school: FetchedSchool): string {
    if (this.currentLanguage === 'english') {
      return school.renovationAreas && school.renovationAreas.length > 0
        ? 'Needs: ' + school.renovationAreas.join(', ')
        : 'No specific needs listed.';
    } else {
      return school.renovationAreas && school.renovationAreas.length > 0
        ? 'தேவைகள்: ' + school.renovationAreas.map(area => this.getRenovationAreaTamil(area)).join(', ')
        : 'குறிப்பிட்ட தேவைகள் இல்லை.';
    }
  }

  getRenovationAreaTamil(englishArea: string): string {
    switch (englishArea) {
      case 'Classrooms': return 'வகுப்பறைகள்';
      case 'Restrooms': return 'கழிப்பறைகள்';
      case 'Library': return 'நூலகம்';
      case 'Laboratory': return 'ஆய்வகம்';
      case 'Playground': return 'விளையாட்டு மைதானம்';
      case 'Drinking Water Facilities': return 'குடிநீர் வசதிகள்';
      case 'Electricity & Lighting': return 'மின்சாரம் மற்றும் விளக்குகள்';
      case 'Roofing & Structural Repairs': return 'கூரை மற்றும் கட்டமைப்பு பழுதுகள்';
      case 'Boundary Wall': return 'சுவர்';
      case 'Drainage System': return 'கழிவுநீர் அமைப்பு';
      default: return englishArea;
    }
  }

  startImageSlider(): void {
    this.imageInterval = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.heroBackgroundImages.length;
    }, 4000);
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
}