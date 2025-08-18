// donate.ts
import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SchoolService, FetchedSchool } from '../../services/school.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../../services/language.service'; // Added LanguageService import

// 1. ADD THIS INTERFACE (COPIED FROM HOME.TS)
interface SchoolWithSlider extends FetchedSchool {
  hovering?: boolean;
  currentPhotoIndex?: number;
  conditionPhotos?: string[]; // Ensure this is here
}

@Component({
  selector: 'app-donate',
  standalone: true, // <-- ADDED STANDALONE PROPERTY
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './donate.html',
  styleUrls: ['./donate.css']
})
export class DonateComponent implements OnInit {
  donationForm!: FormGroup;
  currentStep = 1;
  selectedPayment: string = '';
  isProcessing: boolean = false;


  // tsparticles config for professional animated background
 

  schools: SchoolWithSlider[] = [];
  selectedSchool: SchoolWithSlider | null = null;
  fundingGoal = 5000000;
  raisedAmount = 3270000;
  feeAmount = 25;
  quickAmounts = [500, 1000, 2000, 5000, 10000];
  currentYear: number = new Date().getFullYear();
  currentLanguage = 'english';
  showImageModal: boolean = false;
  modalPhotos: string[] = [];
  currentModalPhotoIndex: number = 0;
  isSuccessModalVisible: boolean = false;
donationAmount: string | null = null;
schoolName: string | null = null;
  paymentMethods = [
    { id: 'credit_card', name: 'Credit/Debit Card', icon: 'fa-solid fa-credit-card', description: 'Pay with your card.' },
    { id: 'upi', name: 'UPI', icon: 'fa-solid fa-qrcode', description: 'Pay with any UPI app.' },
    { id: 'netbanking', name: 'Net Banking', icon: 'fa-solid fa-building-columns', description: 'All major banks supported.' }
  ];
  bankNames = [
    'State Bank of India', 'ICICI Bank', 'HDFC Bank', 'Axis Bank', 'Bank of Baroda', 'Canara Bank', 'Indian Bank', 'Kotak Mahindra Bank', 'Punjab National Bank', 'IDFC First Bank'
  ];
  impactImages = [
    { src: 'https://placehold.co/600x400/1a3a6a/ffffff?text=Improved+Learning', alt: 'Students studying in a renovated classroom', caption: 'Improved learning environment' },
    { src: 'https://placehold.co/600x400/1a3a6a/ffffff?text=Safe+Playground', alt: 'Children playing in a new schoolyard', caption: 'Safe playground facilities' },
    { src: 'https://placehold.co/600x400/1a3a6a/ffffff?text=Digital+Education', alt: 'Modern classroom with digital tools', caption: 'Technology-enabled education' }
  ];
  testimonials = [
    { quote: "The school renovation has completely transformed learning for our children. Attendance has increased by 40% since the upgrades.", name: "Priya Kumar", title: "Parent & Volunteer" },
    { quote: "As a teacher, I've seen firsthand how proper classrooms improve concentration and learning outcomes. Our students are thriving!", name: "Rajeshwar Yadav", title: "School Teacher" },
    { quote: "Donating to this cause was the best decision. Seeing photos of the renovated classrooms made me realize my contribution's impact.", name: "Ananya Iyer", title: "Corporate Donor" }
  ];

  constructor(private fb: FormBuilder, private schoolService: SchoolService, private http: HttpClient, public languageService: LanguageService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchSchools();
  }

  private initializeForm(): void {
    this.donationForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      image: [null],
      amount: ['', [Validators.required, Validators.min(100)]],
      dedication: [''],
      paymentMethod: ['', Validators.required],
      coverFees: [false],
      // Payment details
      cardNumber: ['', []],
      expiry: ['', []],
      cvv: ['', []],
      bankName: ['', []],
      accountNumber: ['', []],
      ifsc: ['', []],
      upiId: ['', []]
    });
  }

  // 3. REPLACE THE fetchSchools METHOD WITH THIS LOGIC FROM HOME.TS
  fetchSchools(): void {
    this.schoolService.getSchools().subscribe({
      next: (schools) => {
        this.schools = schools.map(school => {
          const serverUrl = 'http://localhost:3000/uploads/';
          const realConditionPhotos = school.conditionPhotos
            ? school.conditionPhotos.map(photoName => serverUrl + photoName)
            : [];
          return {
            ...school,
            conditionPhotos: realConditionPhotos,
            hovering: false,
            currentPhotoIndex: 0
          };
        });
      },
      error: (err) => { console.error('Failed to fetch schools', err); }
    });
  }
  
  // 4. ADD THESE SLIDER METHODS (COPIED FROM HOME.TS)
  onSchoolHover(school: SchoolWithSlider, hovering: boolean): void {
    school.hovering = hovering;
    if (!hovering) {
        school.currentPhotoIndex = 0;
    }
  }

  previousPhoto(school: SchoolWithSlider, event: Event): void {
      event.stopPropagation();
      if (school.conditionPhotos && school.conditionPhotos.length > 0) {
          school.currentPhotoIndex = (school.currentPhotoIndex === 0)
              ? school.conditionPhotos.length - 1
              : school.currentPhotoIndex! - 1;
      }
  }

  nextPhoto(school: SchoolWithSlider, event: Event): void {
      event.stopPropagation();
      if (school.conditionPhotos && school.conditionPhotos.length > 0) {
          school.currentPhotoIndex = (school.currentPhotoIndex === school.conditionPhotos.length - 1)
              ? 0
              : school.currentPhotoIndex! + 1;
      }
  }
  
  // ... (rest of your existing methods like selectSchool, closeModal, onSubmit, etc., are fine) ...
  selectSchool(school: SchoolWithSlider): void {
    this.selectedSchool = school;
    this.currentStep = 1;
    this.donationForm.reset({ coverFees: false });
  }
    openImageModal(school: any, clickedPhotoIndex: number, event: Event): void {
    event.stopPropagation();
    this.modalPhotos = school.conditionPhotos;
    this.currentModalPhotoIndex = clickedPhotoIndex;
    this.showImageModal = true;
  }

  // Replace the old closeImageModal method with this one
  closeImageModal(): void {
    this.showImageModal = false;
    this.modalPhotos = [];
    this.currentModalPhotoIndex = 0;
  }

  // Add these two new methods for navigation
  previousModalPhoto(event: Event): void {
    event.stopPropagation();
    this.currentModalPhotoIndex = (this.currentModalPhotoIndex === 0)
      ? this.modalPhotos.length - 1
      : this.currentModalPhotoIndex - 1;
  }
  getFundingProgress(school: FetchedSchool): number {
  if (!school.fundingGoal || school.fundingGoal === 0) {
    return 0; // Avoid division by zero
  }
  const progress = (school.amountRaised / school.fundingGoal) * 100;
  return Math.min(100, Math.floor(progress)); // Cap at 100%
}
  getProgressBarStyle(school: FetchedSchool): string {
  const progress = this.getFundingProgress(school);
  return `width: ${progress}%;`;
}
  nextModalPhoto(event: Event): void {
    event.stopPropagation();
    this.currentModalPhotoIndex = (this.currentModalPhotoIndex === this.modalPhotos.length - 1)
      ? 0
      : this.currentModalPhotoIndex + 1;
  }

  closeModal(): void {
    this.selectedSchool = null;
  }

  viewOnMap(school: FetchedSchool): void {
    const query = `${school.schoolNameEn}, ${school.district}, ${school.pincode}`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  }

  selectAmount(amount: number): void {
    this.donationForm.patchValue({ amount });
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedPayment = methodId;
    this.donationForm.patchValue({ paymentMethod: methodId });
    this.donationForm.get('paymentMethod')?.markAsTouched();

    // Reset payment detail fields and validators
    this.resetPaymentValidators();
    if (methodId === 'credit_card') {
      this.donationForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{16,19}$/)]);
      this.donationForm.get('expiry')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/(\d{2})$/)]);
      this.donationForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
    } else if (methodId === 'netbanking') {
      this.donationForm.get('bankName')?.setValidators([Validators.required]);
      this.donationForm.get('accountNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{9,18}$/)]);
      this.donationForm.get('ifsc')?.setValidators([Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/i)]);
    } else if (methodId === 'upi') {
      this.donationForm.get('upiId')?.setValidators([Validators.required, Validators.pattern(/^\w+@[a-zA-Z]+$/)]);
    }
    // Update validity
    this.donationForm.get('cardNumber')?.updateValueAndValidity();
    this.donationForm.get('expiry')?.updateValueAndValidity();
    this.donationForm.get('cvv')?.updateValueAndValidity();
    this.donationForm.get('bankName')?.updateValueAndValidity();
    this.donationForm.get('accountNumber')?.updateValueAndValidity();
    this.donationForm.get('ifsc')?.updateValueAndValidity();
    this.donationForm.get('upiId')?.updateValueAndValidity();
  }

  resetPaymentValidators(): void {
    // Remove validators for all payment fields
    this.donationForm.get('cardNumber')?.clearValidators();
    this.donationForm.get('expiry')?.clearValidators();
    this.donationForm.get('cvv')?.clearValidators();
    this.donationForm.get('bankName')?.clearValidators();
    this.donationForm.get('accountNumber')?.clearValidators();
    this.donationForm.get('ifsc')?.clearValidators();
    this.donationForm.get('upiId')?.clearValidators();
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
        const file = input.files[0];
        this.donationForm.patchValue({
            image: file
        });
    }
}
  isCurrentStepValid(): boolean {
    if (!this.donationForm) return false;
    switch (this.currentStep) {
      case 1:
        return this.donationForm.get('name')?.valid && this.donationForm.get('email')?.valid && this.donationForm.get('phone')?.valid || false;
      case 2:
        return this.donationForm.get('amount')?.valid || false;
      case 3:
        if (!this.donationForm.get('paymentMethod')?.valid) return false;
        if (this.selectedPayment === 'credit_card') {
          return this.donationForm.get('cardNumber')?.valid && this.donationForm.get('expiry')?.valid && this.donationForm.get('cvv')?.valid || false;
        } else if (this.selectedPayment === 'netbanking') {
          return this.donationForm.get('bankName')?.valid && this.donationForm.get('accountNumber')?.valid && this.donationForm.get('ifsc')?.valid || false;
        } else if (this.selectedPayment === 'upi') {
          return this.donationForm.get('upiId')?.valid || false;
        }
        return true;
      default:
        return false;
    }
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      this.donationForm.get('name')?.markAsTouched();
      this.donationForm.get('email')?.markAsTouched();
      this.donationForm.get('phone')?.markAsTouched();
    } else if (this.currentStep === 2) {
      this.donationForm.get('amount')?.markAsTouched();
      this.donationForm.get('amount')?.updateValueAndValidity();
    }
    
    if (this.isCurrentStepValid()) {
        this.currentStep++;
    }
  }

  prevStep(): void {
    this.currentStep--;
  }
  
  onSubmit(): void {
    if (this.donationForm.invalid || !this.isCurrentStepValid()) {
      this.donationForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;
    const formValue = this.donationForm.value;

    // Create FormData to send files and text
    const formData = new FormData();
    formData.append('name', formValue.name);
    formData.append('email', formValue.email);
    formData.append('phone', formValue.phone);
    formData.append('amount', formValue.amount);
    formData.append('dedication', formValue.dedication);
    formData.append('paymentMethod', formValue.paymentMethod);
    formData.append('coverFees', formValue.coverFees);
    formData.append('finalAmount', formValue.coverFees ? formValue.amount + this.feeAmount : formValue.amount);
    formData.append('selectedSchoolId', this.selectedSchool?._id || '');
    formData.append('selectedSchoolName', this.selectedSchool?.schoolNameEn || '');

    // Payment details
    if (formValue.paymentMethod === 'credit_card') {
      formData.append('cardNumber', formValue.cardNumber);
      formData.append('expiry', formValue.expiry);
      formData.append('cvv', formValue.cvv);
    } else if (formValue.paymentMethod === 'netbanking') {
      formData.append('bankName', formValue.bankName);
      formData.append('accountNumber', formValue.accountNumber);
      formData.append('ifsc', formValue.ifsc);
    } else if (formValue.paymentMethod === 'upi') {
      formData.append('upiId', formValue.upiId);
    }

    // Append the image file if it exists
    if (formValue.image) {
      formData.append('image', formValue.image);
    }

    const apiUrl = 'http://localhost:3000/api/donations/submit-mock-payment';

    this.http.post<any>(apiUrl, formData).subscribe({
      next: (response) => {
        console.log('Mock payment successful:', response);
        this.isProcessing = false;
        
        // Populate the success modal data and show it
        this.donationAmount = formData.get('finalAmount') as string;
        this.schoolName = this.selectedSchool?.schoolNameEn || 'a school';
        this.isSuccessModalVisible = true;
        
        // We'll reset the form and close the main modal in closeSuccessModal()
        // No other actions needed here.
        
      },
      error: (err) => {
        console.error('Payment submission failed', err);
        this.isProcessing = false;
        alert('There was an error processing your donation. Please try again.');
      }
    });
  }
  closeSuccessModal(): void {
    this.isSuccessModalVisible = false;
    this.selectedSchool = null; // This closes the main donation modal
    this.currentStep = 1;
    this.donationForm.reset();
    this.selectedPayment = '';
    this.fetchSchools(); 
    // No need to call fetchSchools() again here as it's already done in the success handler
  }
  // Angular Animations for modal and payment details
  // Add this to your @Component decorator:
  // animations: [ ... ]

    // ...existing code...

}