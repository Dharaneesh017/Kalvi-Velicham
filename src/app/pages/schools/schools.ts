import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.html',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule,RouterLink],
  styleUrls: ['./schools.css']
})
export class SchoolsComponent implements OnInit {
  schoolForm!: FormGroup; // ✅ Fixed: Added '!' 
   currentLanguage = 'english';
   isMobileMenuOpen = false;
  districts = [
    'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli',
    'Tirunelveli', 'Vellore', 'Erode', 'Tirupur', 'Thanjavur'
  ];
  priorityLevels = [
    { value: 'low', label: 'Low Priority', class: 'low' },
    { value: 'medium', label: 'Medium Priority', class: 'medium' },
    { value: 'high', label: 'High Priority', class: 'high' }
  ];
  budgetRanges = [
    { value: 'below_1_lakh', label: 'Below ₹1 Lakh' },
    { value: '1_5_lakh', label: '₹1 - 5 Lakh' },
    { value: '5_10_lakh', label: '₹5 - 10 Lakh' },
    { value: '10_25_lakh', label: '₹10 - 25 Lakh' },
    { value: '25_50_lakh', label: '₹25 - 50 Lakh' },
    { value: 'above_50_lakh', label: 'Above ₹50 Lakh' }
  ];
  renovationAreas = [
    { id: 'classrooms', label: 'Classrooms' },
    { id: 'toilets', label: 'Toilets & Sanitation' },
    { id: 'kitchen', label: 'Kitchen & Dining Hall' },
    { id: 'library', label: 'Library' },
    { id: 'laboratory', label: 'Science Laboratory' },
    { id: 'playground', label: 'Playground' },
    { id: 'boundary', label: 'Boundary Wall' },
    { id: 'water', label: 'Water Supply' },
    { id: 'electricity', label: 'Electrical Work' },
    { id: 'roof', label: 'Roof & Ceiling' },
    { id: 'windows', label: 'Windows & Doors' },
    { id: 'flooring', label: 'Flooring' }
  ];
  currentStep = 1;
  totalSteps = 4;
  currentYear: number = new Date().getFullYear();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.schoolForm = this.fb.group({
      basicInfo: this.fb.group({
        schoolNameEn: ['', Validators.required],
        schoolNameTa: ['', Validators.required],
        udiseCode: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
        schoolType: ['', Validators.required],
        district: ['', Validators.required],
        block: ['', Validators.required],
        address: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
        establishedYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
        studentCount: ['', [Validators.required, Validators.min(1)]],
        teacherCount: ['', [Validators.required, Validators.min(1)]],
        principalName: ['', Validators.required],
        principalContact: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        principalEmail: ['', [Validators.required, Validators.email]]
      }),
      infrastructure: this.fb.group({
        renovationAreas: this.fb.array([]),
        priority: ['', Validators.required],
        budgetRange: [''],
        currentCondition: ['', Validators.required],
        expectedOutcome: ['']
      }),
      documentation: this.fb.group({
        recognitionCert: [null, Validators.required],
        assessmentReport: [null],
        conditionPhotos: [null, Validators.required],
        budgetEstimates: [null]
      }),
      additionalInfo: this.fb.group({
        communityContribution: [''],
        renovationHistory: [''],
        specialRequirements: [''],
        timeline: ['']
      })
    });

    // Initialize checkboxes
    this.renovationAreas.forEach(() => this.renovationAreasFormArray.push(new FormControl(false)));
  }

  get renovationAreasFormArray(): FormArray {
    return this.schoolForm.get('infrastructure.renovationAreas') as FormArray;
  }

  getSelectedRenovationAreas(): string[] {
    return this.renovationAreas
      .filter((item, i) => this.renovationAreasFormArray.at(i).value)
      .map(item => item.label);
  }

  setPriority(priority: string): void {
    this.schoolForm.get('infrastructure.priority')?.setValue(priority);
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  onFileChange(event: any, controlName: string, groupName: string): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.schoolForm.get(`${groupName}.${controlName}`)?.setValue(file);
    }
  }
getRenovationAreaControl(index: number): FormControl {
  return this.renovationAreasFormArray.at(index) as FormControl;
}
  onSubmit(): void {
    if (this.schoolForm.valid) {
      console.log('Form submitted:', this.schoolForm.value);
      alert('School registration submitted successfully!');
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
}
