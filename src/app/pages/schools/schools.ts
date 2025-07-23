// src/app/schools/schools.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, FormsModule, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SchoolService, SchoolFormData } from '../../services/school.service'; // <-- Import SchoolFormData from SchoolService

// Interfaces for dummy data structure (remains here)
interface School {
  id: string;
  name: string;
  type: string;
  district: string;
  block: string;
  udiseCode: string;
  address?: string;
  pincode?: string; // Added to interface for dummy data
  establishedYear?: number; // Added to interface for dummy data
  studentCount?: number; // Added to interface for dummy data
  teacherCount?: number; // Added to interface for dummy data
  principalName?: string; // Added to interface for dummy data
  principalContact?: string; // Added to interface for dummy data
  principalEmail?: string; // Added to interface for dummy data
}

interface RenovationArea {
  id: string;
  label: string;
}

interface PriorityLevel {
  value: string;
  label: string;
}

interface BudgetRange {
  value: string;
  label: string;
}

@Component({
  selector: 'app-schools',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './schools.html',
  styleUrls: ['./schools.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolsComponent implements OnInit {
  schoolForm!: FormGroup;
  currentStep: number = 1;
  currentYear: number = new Date().getFullYear();
  currentLanguage = 'english';

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

  // Enhanced dummy data for allSchools to include all fields for auto-population
  allSchools: School[] = [
    // Ariyalur
    { id: 'ARL001', name: 'Govt. Higher Secondary School, Ariyalur', type: 'higher_secondary', district: 'Ariyalur', block: 'Ariyalur', udiseCode: '33123456789', address: 'Main Road, Ariyalur', pincode: '621704', establishedYear: 1985, studentCount: 500, teacherCount: 30, principalName: 'R. Kumar', principalContact: '9876500001', principalEmail: 'ariyalur.hss@example.com' },
    { id: 'ARL002', name: 'Govt. Primary School, Jayankondam', type: 'primary', district: 'Ariyalur', block: 'Jayankondam', udiseCode: '33123456780', address: 'Near Bus Stand, Jayankondam', pincode: '621802', establishedYear: 1960, studentCount: 150, teacherCount: 8, principalName: 'S. Devi', principalContact: '9876500002', principalEmail: 'jayankondam.ps@example.com' },

    // Chennai
    { id: 'CHN001', name: 'Govt. Primary School, Mylapore', type: 'primary', district: 'Chennai', block: 'Mylapore', udiseCode: '33123456791', address: '12, Santhome High Road, Mylapore', pincode: '600004', establishedYear: 1955, studentCount: 200, teacherCount: 10, principalName: 'A. Rajan', principalContact: '9876510001', principalEmail: 'mylapore.ps@example.com' },
    { id: 'CHN002', name: 'Govt. Middle School, Adyar', type: 'middle', district: 'Chennai', block: 'Adyar', udiseCode: '33123456792', address: 'Gandhi Nagar, Adyar', pincode: '600020', establishedYear: 1970, studentCount: 350, teacherCount: 15, principalName: 'B. Priya', principalContact: '9876510002', principalEmail: 'adyar.ms@example.com' },
    { id: 'CHN003', name: 'Govt. High School, T. Nagar', type: 'high', district: 'Chennai', block: 'T. Nagar', udiseCode: '33123456793', address: 'Usman Road, T. Nagar', pincode: '600017', establishedYear: 1980, studentCount: 600, teacherCount: 25, principalName: 'C. Suresh', principalContact: '9876510003', principalEmail: 'tnagar.hs@example.com' },
    { id: 'CHN004', name: 'Govt. Higher Secondary School, Anna Nagar', type: 'higher_secondary', district: 'Chennai', block: 'Anna Nagar', udiseCode: '33123456794', address: '4th Avenue, Anna Nagar', pincode: '600040', establishedYear: 1990, studentCount: 800, teacherCount: 40, principalName: 'D. Karthik', principalContact: '9876510004', principalEmail: 'annanagar.hss@example.com' },
    { id: 'CHN005', name: 'Govt. Primary School, Velachery', type: 'primary', district: 'Chennai', block: 'Velachery', udiseCode: '33123456795', address: 'Velachery Main Road', pincode: '600042', establishedYear: 1965, studentCount: 220, teacherCount: 12, principalName: 'E. Lakshmi', principalContact: '9876510005', principalEmail: 'velachery.ps@example.com' },
    { id: 'CHN006', name: 'Govt. Middle School, Perambur', type: 'middle', district: 'Chennai', block: 'Perambur', udiseCode: '33123456796', address: 'Perambur Barracks Road', pincode: '600011', establishedYear: 1975, studentCount: 380, teacherCount: 18, principalName: 'F. Vignesh', principalContact: '9876510006', principalEmail: 'perambur.ms@example.com' },
    { id: 'CHN007', name: 'Govt. High School, Royapettah', type: 'high', district: 'Chennai', block: 'Royapettah', udiseCode: '33123456797', address: 'Peters Road, Royapettah', pincode: '600014', establishedYear: 1982, studentCount: 550, teacherCount: 28, principalName: 'G. Swetha', principalContact: '9876510007', principalEmail: 'royapettah.hs@example.com' },
    { id: 'CHN008', name: 'Govt. Higher Secondary School, Tambaram', type: 'higher_secondary', district: 'Chennai', block: 'Tambaram', udiseCode: '33123456798', address: 'GST Road, Tambaram', pincode: '600045', establishedYear: 1995, studentCount: 750, teacherCount: 35, principalName: 'H. Anand', principalContact: '9876510008', principalEmail: 'tambaram.hss@example.com' },
    { id: 'CHN009', name: 'Govt. Primary School, Ambattur', type: 'primary', district: 'Chennai', block: 'Ambattur', udiseCode: '33123456799', address: 'Ambattur Old Town', pincode: '600053', establishedYear: 1962, studentCount: 180, teacherCount: 9, principalName: 'I. Meena', principalContact: '9876510009', principalEmail: 'ambattur.ps@example.com' },
    { id: 'CHN010', name: 'Govt. Middle School, Guindy', type: 'middle', district: 'Chennai', block: 'Guindy', udiseCode: '33123456800', address: 'Mount Road, Guindy', pincode: '600032', establishedYear: 1978, studentCount: 320, teacherCount: 14, principalName: 'J. Bala', principalContact: '9876510010', principalEmail: 'guindy.ms@example.com' },

    // Coimbatore
    { id: 'CBE001', name: 'Govt. Primary School, Gandhipuram', type: 'primary', district: 'Coimbatore', block: 'Gandhipuram', udiseCode: '33123456801', address: 'Cross Cut Road, Gandhipuram', pincode: '641012', establishedYear: 1958, studentCount: 210, teacherCount: 11, principalName: 'K. Raja', principalContact: '9876520001', principalEmail: 'gandhipuram.ps@example.com' },
    { id: 'CBE002', name: 'Govt. Middle School, Peelamedu', type: 'middle', district: 'Coimbatore', block: 'Peelamedu', udiseCode: '33123456802', address: 'Avinashi Road, Peelamedu', pincode: '641004', establishedYear: 1972, studentCount: 360, teacherCount: 16, principalName: 'L. Deviya', principalContact: '9876520002', principalEmail: 'peelamedu.ms@example.com' },
    { id: 'CBE003', name: 'Govt. High School, Saibaba Colony', type: 'high', district: 'Coimbatore', block: 'Saibaba Colony', udiseCode: '33123456803', address: 'Mettupalayam Road', pincode: '641011', establishedYear: 1988, studentCount: 580, teacherCount: 27, principalName: 'M. Ganesh', principalContact: '9876520003', principalEmail: 'saibaba.hs@example.com' },
    { id: 'CBE004', name: 'Govt. Higher Secondary School, R.S. Puram', type: 'higher_secondary', district: 'Coimbatore', block: 'R.S. Puram', udiseCode: '33123456804', address: 'DB Road, R.S. Puram', pincode: '641002', establishedYear: 1992, studentCount: 780, teacherCount: 38, principalName: 'N. Sarala', principalContact: '9876520004', principalEmail: 'rspuram.hss@example.com' },
    { id: 'CBE005', name: 'Govt. Primary School, Podanur', type: 'primary', district: 'Coimbatore', block: 'Podanur', udiseCode: '33123456805', address: 'Podanur Main Road', pincode: '641023', establishedYear: 1968, studentCount: 190, teacherCount: 10, principalName: 'O. Velu', principalContact: '9876520005', principalEmail: 'podanur.ps@example.com' },
    { id: 'CBE006', name: 'Govt. Middle School, Singanallur', type: 'middle', district: 'Coimbatore', block: 'Singanallur', udiseCode: '33123456806', address: 'Trichy Road, Singanallur', pincode: '641005', establishedYear: 1977, studentCount: 330, teacherCount: 15, principalName: 'P. Kavitha', principalContact: '9876520006', principalEmail: 'singanallur.ms@example.com' },
    { id: 'CBE007', name: 'Govt. High School, Kuniyamuthur', type: 'high', district: 'Coimbatore', block: 'Kuniyamuthur', udiseCode: '33123456807', address: 'Palakkad Main Road, Kuniyamuthur', pincode: '641008', establishedYear: 1985, studentCount: 520, teacherCount: 25, principalName: 'Q. Murugan', principalContact: '9876520007', principalEmail: 'kuniyamuthur.hs@example.com' },
    { id: 'CBE008', name: 'Govt. Higher Secondary School, Pollachi', type: 'higher_secondary', district: 'Coimbatore', block: 'Pollachi', udiseCode: '33123456808', address: 'Coimbatore Road, Pollachi', pincode: '642001', establishedYear: 1998, studentCount: 700, teacherCount: 33, principalName: 'R. Gayathri', principalContact: '9876520008', principalEmail: 'pollachi.hss@example.com' },
    { id: 'CBE009', name: 'Govt. Primary School, Mettupalayam', type: 'primary', district: 'Coimbatore', block: 'Mettupalayam', udiseCode: '33123456809', address: 'Ooty Road, Mettupalayam', pincode: '641301', establishedYear: 1963, studentCount: 200, teacherCount: 10, principalName: 'S. Ramu', principalContact: '9876520009', principalEmail: 'mettupalayam.ps@example.com' },
    { id: 'CBE010', name: 'Govt. Middle School, Sulur', type: 'middle', district: 'Coimbatore', block: 'Sulur', udiseCode: '33123456810', address: 'Kangeyam Road, Sulur', pincode: '641401', establishedYear: 1979, studentCount: 300, teacherCount: 13, principalName: 'T. Indu', principalContact: '9876520010', principalEmail: 'sulur.ms@example.com' },

    // Cuddalore
    { id: 'CDL001', name: 'Govt. Primary School, Cuddalore Port', type: 'primary', district: 'Cuddalore', block: 'Cuddalore Port', udiseCode: '33123456811', address: 'Port Road, Cuddalore', pincode: '607001', establishedYear: 1950, studentCount: 250, teacherCount: 12, principalName: 'U. Gopal', principalContact: '9876530001', principalEmail: 'cuddaloreport.ps@example.com' },
    { id: 'CDL002', name: 'Govt. Middle School, Chidambaram', type: 'middle', district: 'Cuddalore', block: 'Chidambaram', udiseCode: '33123456812', address: 'East Car Street, Chidambaram', pincode: '608001', establishedYear: 1970, studentCount: 400, teacherCount: 18, principalName: 'V. Sundari', principalContact: '9876530002', principalEmail: 'chidambaram.ms@example.com' },
    { id: 'CDL003', name: 'Govt. High School, Neyveli', type: 'high', district: 'Cuddalore', block: 'Neyveli', udiseCode: '33123456813', address: 'Block 1, Neyveli', pincode: '607801', establishedYear: 1980, studentCount: 650, teacherCount: 30, principalName: 'W. Prakash', principalContact: '9876530003', principalEmail: 'neyveli.hs@example.com' },
    { id: 'CDL004', name: 'Govt. Higher Secondary School, Virudhachalam', type: 'higher_secondary', district: 'Cuddalore', block: 'Virudhachalam', udiseCode: '33123456814', address: 'Salem Main Road, Virudhachalam', pincode: '606001', establishedYear: 1990, studentCount: 850, teacherCount: 42, principalName: 'X. Revathi', principalContact: '9876530004', principalEmail: 'virudhachalam.hss@example.com' },
    { id: 'CDL005', name: 'Govt. Primary School, Panruti', type: 'primary', district: 'Cuddalore', block: 'Panruti', udiseCode: '33123456815', address: 'Panruti Town', pincode: '607106', establishedYear: 1960, studentCount: 230, teacherCount: 11, principalName: 'Y. Sakthi', principalContact: '9876530005', principalEmail: 'panruti.ps@example.com' },
    { id: 'CDL006', name: 'Govt. Middle School, Kurinjipadi', type: 'middle', district: 'Cuddalore', block: 'Kurinjipadi', udiseCode: '33123456816', address: 'Near Railway Station, Kurinjipadi', pincode: '607302', establishedYear: 1975, studentCount: 390, teacherCount: 16, principalName: 'Z. Bala', principalContact: '9876530006', principalEmail: 'kurinjipadi.ms@example.com' },
    { id: 'CDL007', name: 'Govt. High School, Parangipettai', type: 'high', district: 'Cuddalore', block: 'Parangipettai', udiseCode: '33123456817', address: 'Parangipettai Coastal Area', pincode: '608502', establishedYear: 1983, studentCount: 560, teacherCount: 27, principalName: 'AA. Devi', principalContact: '9876530007', principalEmail: 'parangipettai.hs@example.com' },
    { id: 'CDL008', name: 'Govt. Higher Secondary School, Kattumannarkoil', type: 'higher_secondary', district: 'Cuddalore', block: 'Kattumannarkoil', udiseCode: '33123456818', address: 'Kattumannarkoil Town', pincode: '608301', establishedYear: 1993, studentCount: 720, teacherCount: 34, principalName: 'BB. Kumar', principalContact: '9876530008', principalEmail: 'kattumannarkoil.hss@example.com' },
    { id: 'CDL009', name: 'Govt. Primary School, Sethiyathope', type: 'primary', district: 'Cuddalore', block: 'Sethiyathope', udiseCode: '33123456819', address: 'Sethiyathope Village', pincode: '608102', establishedYear: 1968, studentCount: 210, teacherCount: 10, principalName: 'CC. Anitha', principalContact: '9876530009', principalEmail: 'sethiyathope.ps@example.com' },
    { id: 'CDL010', name: 'Govt. Middle School, Bhuvanagiri', type: 'middle', district: 'Cuddalore', block: 'Bhuvanagiri', udiseCode: '33123456820', address: 'Bhuvanagiri Town', pincode: '608601', establishedYear: 1979, studentCount: 350, teacherCount: 15, principalName: 'DD. Prabhu', principalContact: '9876530010', principalEmail: 'bhuvanagiri.ms@example.com' }
  ];

  filteredSchools: School[] = []; // Stores schools filtered by district
  selectedSchoolDetails: School | null = null; // Holds the full details of the selected school

  renovationAreas: RenovationArea[] = [
    { id: 'classrooms', label: 'Classrooms' },
    { id: 'restrooms', label: 'Restrooms' },
    { id: 'library', label: 'Library' },
    { id: 'laboratory', label: 'Laboratory' },
    { id: 'playground', label: 'Playground' },
    { id: 'drinking_water', label: 'Drinking Water Facilities' },
    { id: 'electricity', label: 'Electricity & Lighting' },
    { id: 'roofing', label: 'Roofing & Structural Repairs' },
    { id: 'boundary_wall', label: 'Boundary Wall' },
    { id: 'drainage', label: 'Drainage System' }
  ];

  priorityLevels: PriorityLevel[] = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  budgetRanges: BudgetRange[] = [
    { value: 'below_1lakh', label: 'Below ₹1 Lakh' },
    { value: '1-5lakhs', label: '₹1 Lakh - ₹5 Lakhs' },
    { value: '5-10lakhs', label: '₹5 Lakhs - ₹10 Lakhs' },
    { value: 'above_10lakhs', label: 'Above ₹10 Lakhs' }
  ];

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef, // Inject ChangeDetectorRef
    private schoolService: SchoolService // Inject SchoolService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.schoolForm = this.fb.group({
      basicInfo: this.fb.group({
        // Form controls for district and school selection
        selectedDistrict: ['', Validators.required],
        selectedSchoolId: [{ value: '', disabled: true }, Validators.required], // Disabled initially

        // These fields will be auto-populated and are readonly in the HTML
        schoolNameEn: ['', Validators.required],
        schoolNameTa: ['', Validators.required],
        udiseCode: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
        schoolType: ['', Validators.required],
        district: ['', Validators.required],
        block: ['', Validators.required],
        address: ['', Validators.required],

        // These fields are user-entered
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
        establishedYear: ['', [
          Validators.required,
          Validators.min(1900),
          Validators.max(new Date().getFullYear())
        ]],
        studentCount: ['', [Validators.required, Validators.min(1)]],
        teacherCount: ['', [Validators.required, Validators.min(1)]],
        principalName: ['', Validators.required],
        principalContact: ['', [
          Validators.required,
          Validators.pattern(/^\d{10}$/)
        ]],
        principalEmail: ['', [Validators.required, Validators.email]]
      }),
      infrastructure: this.fb.group({
        renovationAreas: this.fb.array([], [
          Validators.required,
          this.minSelectedCheckboxes(1) // Using the helper validator
        ]),
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
      })
    });

    this.initializeRenovationAreas();

    // Subscribe to changes in selectedDistrict to update filteredSchools
    this.schoolForm.get('basicInfo.selectedDistrict')?.valueChanges.subscribe(district => {
      this.onDistrictChange(district);
    });

    // Subscribe to changes in selectedSchoolId to update basicInfo fields
    this.schoolForm.get('basicInfo.selectedSchoolId')?.valueChanges.subscribe(schoolId => {
      this.onSchoolChange(schoolId);
    });
  }

  private initializeRenovationAreas(): void {
    const renovationAreasArray = this.schoolForm.get('infrastructure.renovationAreas') as FormArray;
    this.renovationAreas.forEach(() => {
      renovationAreasArray.push(new FormControl(false));
    });
  }

  ngOnInit(): void { }

  // Validator to ensure at least 'min' checkboxes are selected in a FormArray
  minSelectedCheckboxes(min: number): ValidatorFn {
    return (formArray: AbstractControl): { [key: string]: any } | null => {
      if (!(formArray instanceof FormArray)) return null;
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + 1 : prev, 0);
      return totalSelected >= min ? null : { required: true };
    };
  }

  onDistrictChange(selectedDistrictValue: string): void {
    this.filteredSchools = []; // Clear previous filtered schools

    // Reset and disable the school dropdown and related basic info fields
    const selectedSchoolIdControl = this.schoolForm.get('basicInfo.selectedSchoolId');
    selectedSchoolIdControl?.reset(''); // Reset school selection
    selectedSchoolIdControl?.disable(); // Disable until schools are filtered

    this.selectedSchoolDetails = null; // Clear selected school details for display

    // Patch only the fields that are directly affected by district change (and clear dependent ones)
    this.schoolForm.get('basicInfo')?.patchValue({
      schoolNameEn: '',
      schoolNameTa: '',
      udiseCode: '',
      schoolType: '',
      district: selectedDistrictValue, // Update district in basicInfo
      block: '', // Clear block
      address: '' // Clear address
    });

    if (selectedDistrictValue) {
      this.filteredSchools = this.allSchools.filter(school =>
        school.district.toLowerCase() === selectedDistrictValue.toLowerCase()
      );
      selectedSchoolIdControl?.enable(); // Enable school dropdown if a district is selected
    }
    this.cdRef.detectChanges(); // Ensure UI updates
  }

  onSchoolChange(selectedSchoolIdValue: string): void {
    this.selectedSchoolDetails = selectedSchoolIdValue ?
      this.allSchools.find(school => school.id === selectedSchoolIdValue) || null :
      null;

    console.log('Selected School ID:', selectedSchoolIdValue);
    console.log('Selected School Details:', this.selectedSchoolDetails);

    const basicInfoGroup = this.schoolForm.get('basicInfo');
    if (basicInfoGroup && this.selectedSchoolDetails) {
      basicInfoGroup.patchValue({
        schoolNameEn: this.selectedSchoolDetails.name,
        schoolNameTa: this.selectedSchoolDetails.name, // Assuming Tamil name is same or handled differently
        udiseCode: this.selectedSchoolDetails.udiseCode,
        schoolType: this.selectedSchoolDetails.type,
        district: this.selectedSchoolDetails.district,
        block: this.selectedSchoolDetails.block,
        address: this.selectedSchoolDetails.address || '',
        pincode: this.selectedSchoolDetails.pincode || '', // Populate pincode
        establishedYear: this.selectedSchoolDetails.establishedYear || '', // Populate establishedYear
        studentCount: this.selectedSchoolDetails.studentCount || '', // Populate studentCount
        teacherCount: this.selectedSchoolDetails.teacherCount || '', // Populate teacherCount
        principalName: this.selectedSchoolDetails.principalName || '', // Populate principalName
        principalContact: this.selectedSchoolDetails.principalContact || '', // Populate principalContact
        principalEmail: this.selectedSchoolDetails.principalEmail || '' // Populate principalEmail
      });
    } else if (basicInfoGroup) {
      // Clear school-related fields if no school is selected
      basicInfoGroup.patchValue({
        schoolNameEn: '', schoolNameTa: '', udiseCode: '', schoolType: '',
        // Do NOT clear district here as it's selected independently by onDistrictChange
        block: '', address: '', pincode: '', establishedYear: '',
        studentCount: '', teacherCount: '', principalName: '',
        principalContact: '', principalEmail: ''
      });
    }
    this.cdRef.detectChanges(); // Ensure UI updates
  }

  getRenovationAreaControl(index: number): FormControl {
    return (this.schoolForm.get('infrastructure.renovationAreas') as FormArray).at(index) as FormControl;
  }

  setPriority(value: string): void {
    this.schoolForm.get('infrastructure.priority')?.setValue(value);
  }

  onFileChange(event: Event, controlName: string, groupName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.schoolForm.get(`${groupName}.${controlName}`)?.setValue(input.files[0]);
    } else {
      this.schoolForm.get(`${groupName}.${controlName}`)?.setValue(null);
    }
    // Manually mark as touched to show validation feedback immediately
    this.schoolForm.get(`${groupName}.${controlName}`)?.markAsTouched();
    this.cdRef.detectChanges(); // Trigger change detection for file input validation
  }

  getSelectedRenovationAreas(): string[] {
    const selectedAreas: string[] = [];
    const renovationFormArray = this.schoolForm.get('infrastructure.renovationAreas') as FormArray;

    this.renovationAreas.forEach((area, index) => {
      if (renovationFormArray.controls[index] && renovationFormArray.controls[index].value) {
        selectedAreas.push(area.label);
      }
    });
    return selectedAreas;
  }

  nextStep(): void {
    const currentSection = this.getCurrentSection();
    if (!currentSection) return;

    currentSection.markAllAsTouched(); // Mark all controls in the current section as touched

    if (currentSection.invalid) {
      console.log('Current section is invalid:', currentSection.value);
      Object.keys(currentSection.controls).forEach(key => {
        const control = currentSection.get(key);
        if (control?.invalid) {
          console.log(`Control ${key} is invalid. Errors:`, control.errors);
        }
      });
      alert('Please complete all required fields in the current section before proceeding.');
      return;
    }

    if (this.currentStep < 4) { // Max step is 4 (Review & Submit)
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  getBudgetRangeLabel(value: string): string {
    if (!value) return 'Not specified';
    const range = this.budgetRanges.find(r => r.value === value);
    return range ? range.label : 'Not specified';
  }

  getCurrentSection(): FormGroup | null {
    switch (this.currentStep) {
      case 1: return this.schoolForm.get('basicInfo') as FormGroup;
      case 2: return this.schoolForm.get('infrastructure') as FormGroup;
      case 3: return this.schoolForm.get('documentation') as FormGroup;
      case 4: return this.schoolForm; // For review step, validate the whole form
      default: return null;
    }
  }

  onSubmit(): void {
    // Before final submission, mark all controls in all sections as touched
    this.schoolForm.get('basicInfo')?.markAllAsTouched();
    this.schoolForm.get('infrastructure')?.markAllAsTouched();
    this.schoolForm.get('documentation')?.markAllAsTouched();
    this.cdRef.detectChanges(); // Force update to show all errors

    if (this.schoolForm.valid) {
      // getRawValue() includes disabled controls, which is important for auto-populated fields
      const rawFormData = this.schoolForm.getRawValue();

      // Construct the data payload to send to your Node.js backend
      // Ensure the keys here match your Mongoose schema fields exactly.
      const dataToSend: SchoolFormData = { // <-- Type assertion here
        schoolNameEn: rawFormData.basicInfo.schoolNameEn,
        schoolNameTa: rawFormData.basicInfo.schoolNameTa,
        udiseCode: rawFormData.basicInfo.udiseCode,
        schoolType: rawFormData.basicInfo.schoolType,
        district: rawFormData.basicInfo.district, // Now included from disabled field
        block: rawFormData.basicInfo.block,       // Now included from disabled field
        address: rawFormData.basicInfo.address,
        pincode: rawFormData.basicInfo.pincode,
        establishedYear: rawFormData.basicInfo.establishedYear,
        studentCount: rawFormData.basicInfo.studentCount,
        teacherCount: rawFormData.basicInfo.teacherCount,
        principalName: rawFormData.basicInfo.principalName,
        principalContact: rawFormData.basicInfo.principalContact,
        principalEmail: rawFormData.basicInfo.principalEmail,
        renovationAreas: this.getSelectedRenovationAreas(), // Use the helper to get selected strings
        priority: rawFormData.infrastructure.priority,
        budgetRange: rawFormData.infrastructure.budgetRange,
        currentCondition: rawFormData.infrastructure.currentCondition,
        expectedOutcome: rawFormData.infrastructure.expectedOutcome,
        // For files, send just the file name (as an example).
        // For actual file uploads, you'd integrate a file upload service or separate API endpoint
        // that returns URLs/paths, which you then store here.
        recognitionCert: rawFormData.documentation.recognitionCert ? rawFormData.documentation.recognitionCert.name : undefined,
        assessmentReport: rawFormData.documentation.assessmentReport ? rawFormData.documentation.assessmentReport.name : undefined,
        conditionPhotos: rawFormData.documentation.conditionPhotos ? rawFormData.documentation.conditionPhotos.name : undefined,
        budgetEstimates: rawFormData.documentation.budgetEstimates ? rawFormData.documentation.budgetEstimates.name : undefined,
      };

      this.schoolService.submitSchool(dataToSend).subscribe({
        next: (response) => {
          console.log('Server response:', response);
          alert('School registration submitted successfully!');
          this.resetForm();
        },
        error: (error) => {
          console.error('Error submitting form:', error);
          let errorMessage = 'An unexpected error occurred. Please try again.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.statusText) {
            errorMessage = `Error ${error.status}: ${error.statusText}`;
          }
          alert(`Submission failed: ${errorMessage}`);
        }
      });
    } else {
      console.log('Form is invalid:', this.schoolForm);
      this.schoolForm.markAllAsTouched(); // Mark all controls as touched to show errors

      // Navigate to the first invalid step for user guidance
      if (this.schoolForm.get('basicInfo')?.invalid) {
        this.currentStep = 1;
      } else if (this.schoolForm.get('infrastructure')?.invalid) {
        this.currentStep = 2;
      } else if (this.schoolForm.get('documentation')?.invalid) {
        this.currentStep = 3;
      }
      alert('Please complete all required fields correctly before submitting.');
    }
  }

  resetForm(): void {
    this.schoolForm.reset(); // Resets all controls to null/empty

    // Manually clear and re-initialize FormArray for renovationAreas
    const renovationAreasArray = this.schoolForm.get('infrastructure.renovationAreas') as FormArray;
    renovationAreasArray.clear();
    this.renovationAreas.forEach(() => {
      renovationAreasArray.push(new FormControl(false));
    });

    // Reset specific form controls that might need explicit values or states
    this.schoolForm.get('basicInfo.selectedDistrict')?.setValue(null);
    this.schoolForm.get('basicInfo.selectedSchoolId')?.setValue(null);
    this.schoolForm.get('basicInfo.selectedSchoolId')?.disable(); // Disable school dropdown

    this.currentStep = 1;
    this.filteredSchools = [];
    this.selectedSchoolDetails = null; // Clear selected school details
    this.cdRef.detectChanges(); // Force change detection if UI doesn't update immediately
  }

  switchLanguage(lang: string): void {
    this.currentLanguage = lang;
  }
}