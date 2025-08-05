import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SchoolService, FetchedSchool } from '../../services/school.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-donate',
  imports:[FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './donate.html',
  styleUrls: ['./donate.css']
})
export class DonateComponent implements OnInit {
  donationForm!: FormGroup;
  currentStep = 1;
  selectedPayment: string = '';
  isProcessing: boolean = false;

  // The heroImageUrl property holds the path to your static image.
  // Make sure you place your image in the assets/images folder of your project.
  heroImageUrl: string = 'assets/images/your-background-image.jpg'; // <-- REPLACE THIS PATH WITH YOUR IMAGE

  // Mock Data (replace with real data from your service)
  schools: FetchedSchool[] = [];
  selectedSchool: FetchedSchool | null = null;

  fundingGoal = 5000000;
  raisedAmount = 3270000;
  feeAmount = 25;
  quickAmounts = [500, 1000, 2000, 5000, 10000];
  currentYear: number = new Date().getFullYear();
  currentLanguage = 'english';
  handleInputFocus(controlName: string) {
    this.donationForm.get(controlName)?.markAsTouched();
}
  paymentMethods = [
    { id: 'credit_card', name: 'Credit/Debit Card', icon: 'fa-solid fa-credit-card', description: 'Visa, Mastercard, Amex, etc.' },
    { id: 'upi', name: 'UPI', icon: 'fa-solid fa-qrcode', description: 'Scan QR or enter UPI ID' },
    { id: 'netbanking', name: 'Net Banking', icon: 'fa-solid fa-building-columns', description: 'Direct bank transfer from major banks' },
    { id: 'wallet', name: 'Digital Wallet', icon: 'fa-solid fa-wallet', description: 'Paytm, PhonePe, and other wallets' }
  ];

  impactImages = [
    {
      src: 'https://placehold.co/600x400/1a3a6a/ffffff?text=Improved+Learning',
      alt: 'Students studying in a renovated classroom',
      caption: 'Improved learning environment'
    },
    {
      src: 'https://placehold.co/600x400/1a3a6a/ffffff?text=Safe+Playground',
      alt: 'Children playing in a new schoolyard',
      caption: 'Safe playground facilities'
    },
    {
      src: 'https://placehold.co/600x400/1a3a6a/ffffff?text=Digital+Education',
      alt: 'Modern classroom with digital tools',
      caption: 'Technology-enabled education'
    }
  ];

  testimonials = [
    {
      quote: "The school renovation has completely transformed learning for our children. Attendance has increased by 40% since the upgrades.",
      name: "Priya Kumar",
      title: "Parent & Volunteer"
    },
    {
      quote: "As a teacher, I've seen firsthand how proper classrooms improve concentration and learning outcomes. Our students are thriving!",
      name: "Rajeshwar Yadav",
      title: "School Teacher"
    },
    {
      quote: "Donating to this cause was the best decision. Seeing photos of the renovated classrooms made me realize my contribution's impact.",
      name: "Ananya Iyer",
      title: "Corporate Donor"
    }
  ];

  constructor(private fb: FormBuilder, private schoolService: SchoolService) { }

  ngOnInit(): void {
    this.initializeForm();
    // In a real application, you would uncomment the line below to fetch data
     this.fetchSchools();
  }

  private initializeForm(): void {
    this.donationForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      amount: ['', [Validators.required, Validators.min(100)]],
      recurring: [false],
      dedication: [''],
      paymentMethod: ['', Validators.required],
      cardNumber: [''],
      cardName: [''],
      expiry: [''],
      cvv: [''],
      coverFees: [false]
    });
  }

  fetchSchools(): void {
    this.schoolService.getSchools().subscribe({
      next: (data) => {
        this.schools = data;
      },
      error: (err) => {
        console.error('Failed to fetch schools', err);
      }
    });
  }

  // Opens the donation modal
  selectSchool(school: FetchedSchool): void {
    this.selectedSchool = school;
    this.currentStep = 1;
    this.donationForm.reset();
    this.donationForm.get('recurring')?.setValue(false);
    this.donationForm.get('coverFees')?.setValue(false);
  }

  // Closes the donation modal
  closeModal(): void {
    this.selectedSchool = null;
  }

  // Opens Google Maps to the school's location
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
    if (methodId === 'credit_card') {
      this.donationForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{16}$/)]);
      this.donationForm.get('cardName')?.setValidators([Validators.required]);
      this.donationForm.get('expiry')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]);
      this.donationForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]);
    } else {
      this.donationForm.get('cardNumber')?.clearValidators();
      this.donationForm.get('cardName')?.clearValidators();
      this.donationForm.get('expiry')?.clearValidators();
      this.donationForm.get('cvv')?.clearValidators();
    }
    this.donationForm.get('cardNumber')?.updateValueAndValidity();
    this.donationForm.get('cardName')?.updateValueAndValidity();
    this.donationForm.get('expiry')?.updateValueAndValidity();
    this.donationForm.get('cvv')?.updateValueAndValidity();
  }

  isCurrentStepValid(): boolean {
    if (!this.donationForm) return false;
    switch (this.currentStep) {
      case 1:
        return (this.donationForm.get('name')?.valid || false) && (this.donationForm.get('email')?.valid || false);
      case 2:
        return (this.donationForm.get('amount')?.valid || false);
      case 3:
        return (this.donationForm.get('paymentMethod')?.valid || false) && (this.selectedPayment !== 'credit_card' || (this.donationForm.get('cardNumber')?.valid || false));
      default:
        return false;
    }
  }

  nextStep(): void {
    // Manually mark controls as touched to trigger validation messages
    if (this.currentStep === 1) {
      this.donationForm.get('name')?.markAsTouched();
      this.donationForm.get('email')?.markAsTouched();
      this.donationForm.get('phone')?.markAsTouched();
      if ((this.donationForm.get('name')?.valid || false) && (this.donationForm.get('email')?.valid || false) && (this.donationForm.get('phone')?.valid || false)) {
        this.currentStep++;
      }
    } else if (this.currentStep === 2) {
      this.donationForm.get('amount')?.markAsTouched();
      if ((this.donationForm.get('amount')?.valid || false)) {
        this.currentStep++;
      }
    } else {
      if (this.isCurrentStepValid()) {
        this.currentStep++;
      }
    }
  }

  prevStep(): void {
    this.currentStep--;
  }

  onSubmit(): void {
    this.isProcessing = true;
    if (this.donationForm.invalid) {
      this.isProcessing = false;
      return;
    }

    const donationAmount = this.donationForm.value.coverFees ?
                          this.donationForm.value.amount + this.feeAmount :
                          this.donationForm.value.amount;

    console.log('Processing donation:', {
      ...this.donationForm.value,
      finalAmount: donationAmount,
      selectedSchoolId: this.selectedSchool?._id,
      selectedSchoolName: this.selectedSchool?.schoolNameEn
    });

    setTimeout(() => {
        this.isProcessing = false;
        alert(`Thank you for your donation of ₹${donationAmount} to ${this.selectedSchool?.schoolNameEn}!`);

        this.closeModal(); // Close the modal after a successful donation
        this.currentStep = 1;
        this.selectedPayment = '';
        this.selectedSchool = null;
        this.donationForm.reset({
          recurring: false,
          coverFees: false
        });
        this.donationForm.clearValidators();
        this.initializeForm();
    }, 2000);
  }
}
