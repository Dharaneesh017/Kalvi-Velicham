import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { Volunteer } from '../volunteer/volunteer';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class Home {
  isMobileMenuOpen = false;
  currentLanguage = 'english';

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }


  featuredSchools = [
    {
      name: 'Ooty Hills Government School',
      nameTa: 'ஊட்டி மலைப்பகுதி அரசு பள்ளி',
      location: 'Ooty, Nilgiris District',
      locationTa: 'ஊட்டி, நீலகிரி மாவட்டம்',
      needs: 'Roof repair, new baseball field markings',
      needsTa: 'கூரை பழுதுபார்ப்பு, புதிய பேஸ்பால் கோடுகள்',
      progress: 35
    },
    {
      name: 'Mahabalipuram Village School',
      nameTa: 'மாமல்லபுரம் கிராமப் பள்ளி',
      location: 'Mahabalipuram, Chengalpattu District',
      locationTa: 'மாமல்லபுரம், செங்கல்பட்டு மாவட்டம்',
      needs: 'New computer lab, library upgrade',
      needsTa: 'புதிய கணினி ஆய்வகம், நூலக மேம்பாடு',
      progress: 60
    },
    {
      name: 'Kanyakumari Beachside School',
      nameTa: 'கன்னியாகுமரி கடற்கரை பள்ளி',
      location: 'Kanyakumari District',
      locationTa: 'கன்னியாகுமரி மாவட்டம்',
      needs: 'Sea-wind resistant windows, playground equipment',
      needsTa: 'கடல் காற்று எதிர்ப்பு சாளரங்கள், விளையாட்டு மைதானம்',
      progress: 20
    }
  ];

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

    toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'english' ? 'tamil' : 'english';
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  getText(english: string, tamil: string): string {
    return this.currentLanguage === 'english' ? english : tamil;
  }
}