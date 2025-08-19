// src/app/volunteer/volunteer.component.ts
import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, ViewEncapsulation, Renderer2, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, FormsModule, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { VolunteerService } from '../../services/volunteer.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface VolunteerOpportunity {
  id: string;
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  icon: string;
}

interface WhyVolunteerItem {
  id: string;
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  icon: string;
}

@Component({
  selector: 'app-volunteer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './volunteer.html',
  styleUrls: ['./volunteer.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VolunteerComponent implements OnInit {
  volunteerForm!: FormGroup;
  currentLanguage = 'english';
  currentYear: number = new Date().getFullYear();
  isSubmitting: boolean = false; // New variable to track submission state

  whyVolunteerItems: WhyVolunteerItem[] = [
    {
      id: 'impact',
      titleEn: 'Make a Real Impact',
      titleTa: 'உண்மையான தாக்கத்தை ஏற்படுத்துங்கள்',
      descriptionEn: 'Your efforts directly contribute to improving school infrastructure and student learning environments.',
      descriptionTa: 'உங்கள் முயற்சிகள் பள்ளி உள்கட்டமைப்பு மற்றும் மாணவர் கற்றல் சூழலை மேம்படுத்துவதற்கு நேரடியாக பங்களிக்கின்றன.',
      icon: 'heart'
    },
    {
      id: 'community',
      titleEn: 'Join a Vibrant Community',
      titleTa: 'துடிப்பான சமூகத்தில் இணையுங்கள்',
      descriptionEn: 'Connect with like-minded individuals, educators, and community leaders dedicated to education.',
      descriptionTa: 'கல்விக்கு அர்ப்பணிக்கப்பட்ட ஒத்த எண்ணம் கொண்ட தனிநபர்கள், கல்வியாளர்கள் மற்றும் சமூகத் தலைவர்களுடன் இணையுங்கள்.',
      icon: 'users'
    },
    {
      id: 'skills',
      titleEn: 'Develop New Skills',
      titleTa: 'புதிய திறன்களை வளர்த்துக் கொள்ளுங்கள்',
      descriptionEn: 'Gain valuable experience in project management, teaching, community outreach, and more.',
      descriptionTa: 'திட்ட மேலாண்மை, கற்பித்தல், சமூக அவுட்ரீச் மற்றும் பலவற்றில் மதிப்புமிக்க அனுபவத்தைப் பெறுங்கள்.',
      icon: 'lightbulb'
    }
  ];

  opportunities: VolunteerOpportunity[] = [
    {
      id: 'teaching',
      titleEn: 'Teaching Support',
      titleTa: 'கற்பித்தல் ஆதரவு',
      descriptionEn: 'Assist teachers in classrooms, conduct extra-curricular activities, or provide tutoring.',
      descriptionTa: 'வகுப்பறைகளில் ஆசிரியர்களுக்கு உதவுங்கள், பாடநெறி நடவடிக்கைகளை நடத்துங்கள் அல்லது பயிற்சி அளியுங்கள்.',
      icon: 'chalkboard-teacher'
    },
    {
      id: 'infrastructure',
      titleEn: 'Infrastructure Help',
      titleTa: 'உள்கட்டமைப்பு உதவி',
      descriptionEn: 'Participate in renovation projects, painting, gardening, or minor repairs.',
      descriptionTa: 'புதுப்பித்தல் திட்டங்கள், ஓவியம், தோட்டக்கலை அல்லது சிறிய பழுதுபார்ப்புகளில் பங்கேற்கவும்.',
      icon: 'tools'
    },
    {
      id: 'awareness',
      titleEn: 'Awareness Drives',
      titleTa: 'விழிப்புணர்வு இயக்கங்கள்',
      descriptionEn: 'Organize and participate in campaigns to promote education and school enrollment.',
      descriptionTa: 'கல்வி மற்றும் பள்ளி சேர்க்கையை ஊக்குவிக்க பிரச்சாரங்களை ஏற்பாடு செய்து பங்கேற்கவும்.',
      icon: 'bullhorn'
    },
    {
      id: 'event',
      titleEn: 'Event Management',
      titleTa: 'நிகழ்வு மேலாண்மை',
      descriptionEn: 'Help plan and execute school events, fundraisers, or community gatherings.',
      descriptionTa: 'பள்ளி நிகழ்வுகள், நிதி திரட்டுபவர்கள் அல்லது சமூகக் கூட்டங்களை திட்டமிடவும் செயல்படுத்தவும் உதவுங்கள்.',
      icon: 'calendar-alt'
    }
  ];

  districts: string[] = [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
    'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram',
    'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
    'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
    'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
    'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
    'Tirupattur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
    'Vellore', 'Viluppuram', 'Virudhunagar'
  ];

  areasOfInterest: { id: string, labelEn: string, labelTa: string }[] = [
    { id: 'teaching_support', labelEn: 'Teaching Support', labelTa: 'கற்பித்தல் ஆதரவு' },
    { id: 'infrastructure_help', labelEn: 'Infrastructure Help', labelTa: 'உள்கட்டமைப்பு உதவி' },
    { id: 'awareness_drives', labelEn: 'Awareness Drives', labelTa: 'விழிப்புணர்வு இயக்கங்கள்' },
    { id: 'event_management', labelEn: 'Event Management', labelTa: 'நிகழ்வு மேலாண்மை' },
    { id: 'admin_support', labelEn: 'Administrative Support', labelTa: 'நிர்வாக ஆதரவு' },
    { id: 'fundraising', labelEn: 'Fundraising', labelTa: 'நிதி திரட்டுதல்' },
  ];

  isFormModalOpen = false;
  submissionMessage = '';
  showSubmissionSuccess = false;

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private languageService: LanguageService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private volunteerService: VolunteerService,
    private http: HttpClient,
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.currentLanguage = lang;
      this.cdRef.detectChanges();
    });
  }

  private initializeForm(): void {
    this.volunteerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      district: ['', Validators.required],
      areasOfInterest: this.fb.array([], this.minSelectedCheckboxes(1)),
      availability: ['', Validators.required],
      message: ['']
    });

    this.areasOfInterest.forEach(() => {
      (this.volunteerForm.get('areasOfInterest') as FormArray).push(new FormControl(false));
    });
  }

  minSelectedCheckboxes(min: number): ValidatorFn {
    return (formArray: AbstractControl): { [key: string]: any } | null => {
      if (!(formArray instanceof FormArray)) return null;
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + 1 : prev, 0);
      return totalSelected >= min ? null : { required: true };
    };
  }

  getAreaOfInterestControl(index: number): FormControl {
    return (this.volunteerForm.get('areasOfInterest') as FormArray).at(index) as FormControl;
  }

  getSelectedAreasOfInterest(): string[] {
    const selectedAreas: string[] = [];
    const areasFormArray = this.volunteerForm.get('areasOfInterest') as FormArray;

    this.areasOfInterest.forEach((area, index) => {
      if (areasFormArray.controls[index] && areasFormArray.controls[index].value) {
        selectedAreas.push(this.currentLanguage === 'english' ? area.labelEn : area.labelTa);
      }
    });
    return selectedAreas;
  }

   onSubmit(): void {
    // A. Check if the form is valid before proceeding
    if (this.volunteerForm.invalid) {
      this.volunteerForm.markAllAsTouched();
      this.isSubmitting = false; 
      this.submissionMessage =
        this.currentLanguage === 'english'
          ? 'Please complete all required fields correctly before submitting.'
          : 'சமர்ப்பிக்கும் முன் தேவையான அனைத்து புலங்களையும் சரியாக நிரப்பவும்.';
      this.showSubmissionSuccess = false;
      this.cdRef.detectChanges();
      return; // Stop the function here if the form is invalid
    }

    // B. If the form is valid, start the submission process
    this.isSubmitting = true; 
    const formData = {
      ...this.volunteerForm.value,
      areasOfInterest: this.getSelectedAreasOfInterest()
    };

    // C. Post data to the server and handle the response
    this.http.post('http://localhost:3000/api/volunteer', formData).subscribe({
      next: (response: any) => {
        console.log('Volunteer registered successfully:', response);
        this.submissionMessage =
          this.currentLanguage === 'english'
            ? 'Thank you for volunteering! We have received your application and will reach out to you soon.'
            : 'தன்னார்வத் தொண்டில் இணைந்ததற்கு நன்றி! உங்கள் விண்ணப்பம் பெறப்பட்டது, விரைவில் உங்களை தொடர்புகொள்வோம்.';
        this.showSubmissionSuccess = true;
        this.isSubmitting = false; 
        this.resetForm();
      },
      error: (error) => {
        console.error('Error during volunteer registration:', error);
        let errorMessage = this.currentLanguage === 'english'
          ? 'Volunteer registration failed. Please try again.'
          : 'தன்னார்வலர் பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.';

        if (error.status === 409) {
          errorMessage = this.currentLanguage === 'english'
            ? 'Registration failed: This email is already registered.'
            : 'பதிவு தோல்வியடைந்தது: இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.';
        } else if (error.error && error.error.message) {
          errorMessage = this.currentLanguage === 'english'
            ? `Registration failed: ${error.error.message}`
            : `பதிவு தோல்வியடைந்தது: ${error.error.message}`;
        }

        this.submissionMessage = errorMessage;
        this.showSubmissionSuccess = false;
        this.isSubmitting = false; 
        this.cdRef.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.volunteerForm.reset();
    const areasFormArray = this.volunteerForm.get('areasOfInterest') as FormArray;
    areasFormArray.clear();
    this.areasOfInterest.forEach(() => {
      areasFormArray.push(new FormControl(false));
    });
    this.cdRef.detectChanges();
  }

  openFormModal(): void {
    this.isFormModalOpen = true;
    this.showSubmissionSuccess = false;
    this.submissionMessage = '';
    this.volunteerForm.reset();
    const areasFormArray = this.volunteerForm.get('areasOfInterest') as FormArray;
    areasFormArray.clear();
    this.areasOfInterest.forEach(() => {
      areasFormArray.push(new FormControl(false));
    });
    this.cdRef.detectChanges();
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.showSubmissionSuccess = false;
    this.submissionMessage = '';
    this.resetForm();
    this.cdRef.detectChanges();
    this.renderer.removeStyle(this.document.body, 'overflow');
  }

  getTranslatedText(english: string, tamil: string): string {
    return this.currentLanguage === 'english' ? english : tamil;
  }
}
