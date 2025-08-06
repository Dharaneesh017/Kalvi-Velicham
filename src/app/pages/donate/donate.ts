import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SchoolService, FetchedSchool } from '../../services/school.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // <-- IMPORT HTTPCLIENT

@Component({
  selector: 'app-donate',
  // Your imports might need to be standalone: true if you are on a newer Angular version
  imports: [FormsModule, ReactiveFormsModule, CommonModule], 
  templateUrl: './donate.html',
  styleUrls: ['./donate.css']
})
export class DonateComponent implements OnInit {
  donationForm!: FormGroup;
  currentStep = 1;
  selectedPayment: string = '';
  isProcessing: boolean = false;
  heroImageUrl: string = 'assets/images/your-background-image.jpg';
  schools: FetchedSchool[] = [];
  selectedSchool: FetchedSchool | null = null;
  fundingGoal = 5000000;
  raisedAmount = 3270000;
  feeAmount = 25;
  quickAmounts = [500, 1000, 2000, 5000, 10000];
  currentYear: number = new Date().getFullYear();
  currentLanguage = 'english';

  paymentMethods = [
    { id: 'credit_card', name: 'Credit/Debit Card', icon: 'fa-solid fa-credit-card', description: 'Pay with your card.' },
    { id: 'upi', name: 'UPI', icon: 'fa-solid fa-qrcode', description: 'Pay with any UPI app.' },
    { id: 'netbanking', name: 'Net Banking', icon: 'fa-solid fa-building-columns', description: 'All major banks supported.' }
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

  // <-- INJECT HTTPCLIENT
  constructor(private fb: FormBuilder, private schoolService: SchoolService, private http: HttpClient) { }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchSchools();
  }

  // <-- UPDATED to be simpler
  private initializeForm(): void {
    this.donationForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      amount: ['', [Validators.required, Validators.min(100)]],
      dedication: [''],
      paymentMethod: ['', Validators.required],
      coverFees: [false]
    });
  }

  fetchSchools(): void {
    this.schoolService.getSchools().subscribe({
      next: (data) => { this.schools = data; },
      error: (err) => { console.error('Failed to fetch schools', err); }
    });
  }

  selectSchool(school: FetchedSchool): void {
    this.selectedSchool = school;
    this.currentStep = 1;
    this.donationForm.reset({ coverFees: false });
  }

  closeModal(): void {
    this.selectedSchool = null;
  }

  viewOnMap(school: FetchedSchool): void {
    const query = `${school.schoolNameEn}, ${school.district}, ${school.pincode}`;
    window.open(`https://maps.google.com/?q=${encodeURIComponent(query)}`, '_blank');
  }

  selectAmount(amount: number): void {
    this.donationForm.patchValue({ amount });
  }

  // <-- UPDATED to be simpler
  selectPaymentMethod(methodId: string): void {
    this.selectedPayment = methodId;
    this.donationForm.patchValue({ paymentMethod: methodId });
    this.donationForm.get('paymentMethod')?.markAsTouched();
  }

  isCurrentStepValid(): boolean {
    if (!this.donationForm) return false;
    switch (this.currentStep) {
      case 1:
        return this.donationForm.get('name')?.valid && this.donationForm.get('email')?.valid && this.donationForm.get('phone')?.valid || false;
      case 2:
        return this.donationForm.get('amount')?.valid || false;
      case 3:
        return this.donationForm.get('paymentMethod')?.valid || false;
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
    }
    
    if (this.isCurrentStepValid()) {
        this.currentStep++;
    }
  }

  prevStep(): void {
    this.currentStep--;
  }

  // <-- UPDATED to call the backend mock endpoint
  onSubmit(): void {
    if (this.donationForm.invalid) {
      this.donationForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;
    
    const donationData = {
      ...this.donationForm.value,
      finalAmount: this.donationForm.value.coverFees ? this.donationForm.value.amount + this.feeAmount : this.donationForm.value.amount,
      selectedSchoolId: this.selectedSchool?._id,
      selectedSchoolName: this.selectedSchool?.schoolNameEn
    };
    
    const apiUrl = 'http://localhost:3000/api/donations/submit-mock-payment';

    this.http.post<any>(apiUrl, donationData).subscribe({
      next: (response) => {
        console.log('Mock payment successful:', response);
        alert(`Thank you! Your donation of ₹${donationData.finalAmount} to ${this.selectedSchool?.schoolNameEn} has been recorded.`);
        
        this.isProcessing = false;
        this.closeModal();
        this.currentStep = 1;
        this.donationForm.reset();
      },
      error: (err) => {
        console.error('Payment submission failed', err);
        this.isProcessing = false;
        alert('There was an error processing your donation. Please try again.');
      }
    });
  }
}