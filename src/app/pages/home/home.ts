// src/app/home/home.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { SchoolService, FetchedSchool } from '../../services/school.service'; // SchoolService மற்றும் FetchedSchool ஐ இறக்குமதி செய்யவும்

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class Home implements OnInit {
  isMobileMenuOpen = false;
  currentLanguage = 'english';
  currentYear: number = new Date().getFullYear();

  fetchedSchools: FetchedSchool[] = []; // தரவுத்தளத்திலிருந்து பெறப்பட்ட பள்ளிகளை சேமிக்க

  // முன்னதாக இருந்த hardcoded 'featuredSchools' வரிசை நீக்கப்பட்டுள்ளது.
  // இப்போது தரவுத்தளத்திலிருந்து பெறும் பள்ளிகள் 'fetchedSchools' இல் சேமிக்கப்படும்.

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

  constructor(
    private languageService: LanguageService,
    private schoolService: SchoolService // SchoolService ஐ இன்ஜெக்ட் செய்யவும்
  ) {}

  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.currentLanguage = lang;
    });

    // தரவுத்தளத்திலிருந்து பள்ளிகளைப் பெறவும்
    this.schoolService.getSchools().subscribe({
      next: (schools) => {
        this.fetchedSchools = schools;
        console.log('Fetched schools:', this.fetchedSchools);
      },
      error: (error) => {
        console.error('Error fetching schools:', error);
        // பயனருக்கு ஒரு பிழை செய்தியைக் காட்டலாம்
        alert('பள்ளி விவரங்களைப் பெறுவதில் சிக்கல் ஏற்பட்டது. பின்னர் முயற்சிக்கவும்.');
      }
    });
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'english' ? 'tamil' : 'english';
    this.languageService.setLanguage(this.currentLanguage); // மொழி மாற்றத்தை சேவை வழியாக அறிவிக்கவும்
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  getText(english: string, tamil: string): string {
    return this.currentLanguage === 'english' ? english : tamil;
  }

  // முன்னேற்ற பட்டிக்கான (progress bar) பாணியை உருவாக்கும் உதவி முறை (helper method)
  // `progress` தரவுத்தளத்திலிருந்து நேரடியாக வராததால், ஒரு தற்காலிக சீரற்ற மதிப்பை பயன்படுத்துகிறோம்.
  getProgressBarStyle(school: FetchedSchool): string {
    // தரவுத்தளத்தில் progress புலம் இருந்தால், school.progress ஐப் பயன்படுத்தவும்
    // இல்லையெனில், ஒரு சீரற்ற மதிப்பை உருவாக்குகிறோம் (உதாரணமாக)
    const progress = school.studentCount ? Math.min(100, Math.floor(school.studentCount / 10) * 5) : (Math.floor(Math.random() * 80) + 10);
    return `width: ${progress}%;`;
  }

  getDisplayProgress(school: FetchedSchool): number {
    // தரவுத்தளத்தில் progress புலம் இருந்தால், school.progress ஐப் பயன்படுத்தவும்
    // இல்லையெனில், ஒரு சீரற்ற மதிப்பை உருவாக்குகிறோம் (உதாரணமாக)
    return school.studentCount ? Math.min(100, Math.floor(school.studentCount / 10) * 5) : (Math.floor(Math.random() * 80) + 10);
  }

  // பள்ளி படத்திற்கான URL ஐ உருவாக்கும் முறை
  // உங்கள் backend இல் படங்களை எவ்வாறு கையாளுகிறீர்கள் என்பதைப் பொறுத்தது.
  // இப்போதைக்கு, ஒரு பொதுவான அல்லது placeholder படத்தைப் பயன்படுத்துவோம்.
  // 'conditionPhotos' புலம் ஒரு கோப்பு பெயராக இருக்கலாம், அதை ஒரு படமாகக் காட்ட ஒரு backend endpoint தேவைப்படலாம்.
  getSchoolImageUrl(school: FetchedSchool): string {
    // இது ஒரு உதாரணம். உங்கள் backend கோப்புகளை எவ்வாறு வழங்குகிறது என்பதைப் பொறுத்து இது வேறுபடலாம்.
    // உதாரணமாக: return `/api/uploads/${school.conditionPhotos}`;
    // இப்போதைக்கு, பொதுவான படங்களை பயன்படுத்துகிறோம்.
    const images = [
      'assets/images/ooty-school.jpeg',
      'assets/images/mahabalipuram-school.jpeg',
      'assets/images/kanyakumari-school.jpeg',
      'assets/images/success-1.jpg', // வேறு சில படங்கள்
      'assets/images/success-2.jpg',
      'assets/images/aboutschool.jpg'
    ];
    // deterministically pick an image based on school._id or udiseCode
    const index = parseInt(school.udiseCode.slice(-1), 10) % images.length;
    return images[index];
  }

  // தேவைகளை காட்டும் முறை (Renovation Areas)
  getNeedsText(school: FetchedSchool): string {
    if (this.currentLanguage === 'english') {
      return school.renovationAreas && school.renovationAreas.length > 0
        ? 'Needs: ' + school.renovationAreas.join(', ')
        : 'No specific needs listed.';
    } else {
      // தமிழ் மொழிபெயர்ப்பு தேவைப்பட்டால் இங்கே சேர்க்கலாம்
      // இப்போதைக்கு, ஆங்கில தலைப்புகளின் பட்டியலை அப்படியே காட்டுவோம்
      return school.renovationAreas && school.renovationAreas.length > 0
        ? 'தேவைகள்: ' + school.renovationAreas.map(area => this.getRenovationAreaTamil(area)).join(', ')
        : 'குறிப்பிட்ட தேவைகள் இல்லை.';
    }
  }

  // Renovation Area பெயர்களை தமிழுக்கு மாற்றுவதற்கான ஒரு மாதிரி முறை
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
}