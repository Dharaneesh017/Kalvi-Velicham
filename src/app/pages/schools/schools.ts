// src/app/schools/schools.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, FormsModule, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SchoolService, SchoolFormData } from '../../services/school.service'; // <-- Import SchoolFormData from SchoolService
import { LanguageService } from '../../services/language.service';
// Interfaces for dummy data structure (remains here)
interface School {
  id: string;
  name: string;
  nameTa: string; // Added Tamil name
  type: string;
  district: string;
  block: string;
  udiseCode: string;
  address?: string;
  addressTa?: string; // Added Tamil address
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
  labelEn: string; // English label
  labelTa: string; // Tamil label
}

interface PriorityLevel {
  value: string;
  labelEn: string; // English label
  labelTa: string; // Tamil label
}

interface BudgetRange {
  value: string;
  labelEn: string; // English label
  labelTa: string; // Tamil label
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
  currentLanguage: 'english' | 'tamil' = 'english'; // Default language

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
    { id: 'ARL001', name: 'Govt. Higher Secondary School, Ariyalur', nameTa: 'அரசு மேல்நிலைப் பள்ளி, அரியலூர்', type: 'higher_secondary', district: 'Ariyalur', block: 'Ariyalur', udiseCode: '33123456789', address: 'Main Road, Ariyalur', addressTa: 'முக்கிய சாலை, அரியலூர்', pincode: '621704', establishedYear: 1985, studentCount: 500, teacherCount: 30, principalName: 'R. Kumar', principalContact: '9876500001', principalEmail: 'ariyalur.hss@example.com' },
    { id: 'ARL002', name: 'Govt. Primary School, Jayankondam', nameTa: 'அரசு தொடக்கப்பள்ளி, ஜெயங்கொண்டம்', type: 'primary', district: 'Ariyalur', block: 'Jayankondam', udiseCode: '33123456780', address: 'Near Bus Stand, Jayankondam', addressTa: 'பேருந்து நிலையம் அருகில், ஜெயங்கொண்டம்', pincode: '621802', establishedYear: 1960, studentCount: 150, teacherCount: 8, principalName: 'S. Devi', principalContact: '9876500002', principalEmail: 'jayankondam.ps@example.com' },

    // Chennai
    { id: 'CHN001', name: 'Govt. Primary School, Mylapore', nameTa: 'அரசு தொடக்கப்பள்ளி, மயிலாப்பூர்', type: 'primary', district: 'Chennai', block: 'Mylapore', udiseCode: '33123456791', address: '12, Santhome High Road, Mylapore', addressTa: '12, சாந்தோம் உயர் சாலை, மயிலாப்பூர்', pincode: '600004', establishedYear: 1955, studentCount: 200, teacherCount: 10, principalName: 'A. Rajan', principalContact: '9876510001', principalEmail: 'mylapore.ps@example.com' },
    { id: 'CHN002', name: 'Govt. Middle School, Adyar', nameTa: 'அரசு நடுநிலைப் பள்ளி, அடையாறு', type: 'middle', district: 'Chennai', block: 'Adyar', udiseCode: '33123456792', address: 'Gandhi Nagar, Adyar', addressTa: 'காந்தி நகர், அடையாறு', pincode: '600020', establishedYear: 1970, studentCount: 350, teacherCount: 15, principalName: 'B. Priya', principalContact: '9876510002', principalEmail: 'adyar.ms@example.com' },
    { id: 'CHN003', name: 'Govt. High School, T. Nagar', nameTa: 'அரசு உயர்நிலைப் பள்ளி, தி. நகர்', type: 'high', district: 'Chennai', block: 'T. Nagar', udiseCode: '33123456793', address: 'Usman Road, T. Nagar', addressTa: 'உஸ்மான் சாலை, தி. நகர்', pincode: '600017', establishedYear: 1980, studentCount: 600, teacherCount: 25, principalName: 'C. Suresh', principalContact: '9876510003', principalEmail: 'tnagar.hs@example.com' },
    { id: 'CHN004', name: 'Govt. Higher Secondary School, Anna Nagar', nameTa: 'அரசு மேல்நிலைப் பள்ளி, அண்ணா நகர்', type: 'higher_secondary', district: 'Chennai', block: 'Anna Nagar', udiseCode: '33123456794', address: '4th Avenue, Anna Nagar', addressTa: '4வது அவென்யூ, அண்ணா நகர்', pincode: '600040', establishedYear: 1990, studentCount: 800, teacherCount: 40, principalName: 'D. Karthik', principalContact: '9876510004', principalEmail: 'annanagar.hss@example.com' },
    { id: 'CHN005', name: 'Govt. Primary School, Velachery', nameTa: 'அரசு தொடக்கப்பள்ளி, வேளச்சேரி', type: 'primary', district: 'Chennai', block: 'Velachery', udiseCode: '33123456795', address: 'Velachery Main Road', addressTa: 'வேளச்சேரி முக்கிய சாலை', pincode: '600042', establishedYear: 1965, studentCount: 220, teacherCount: 12, principalName: 'E. Lakshmi', principalContact: '9876510005', principalEmail: 'velachery.ps@example.com' },
    { id: 'CHN006', name: 'Govt. Middle School, Perambur', nameTa: 'அரசு நடுநிலைப் பள்ளி, பெரம்பூர்', type: 'middle', district: 'Chennai', block: 'Perambur', udiseCode: '33123456796', address: 'Perambur Barracks Road', addressTa: 'பெரம்பூர் பாராக்ஸ் சாலை', pincode: '600011', establishedYear: 1975, studentCount: 380, teacherCount: 18, principalName: 'F. Vignesh', principalContact: '9876510006', principalEmail: 'perambur.ms@example.com' },
    { id: 'CHN007', name: 'Govt. High School, Royapettah', nameTa: 'அரசு உயர்நிலைப் பள்ளி, ராயப்பேட்டை', type: 'high', district: 'Chennai', block: 'Royapettah', udiseCode: '33123456797', address: 'Peters Road, Royapettah', addressTa: 'பீட்டர்ஸ் சாலை, ராயப்பேட்டை', pincode: '600014', establishedYear: 1982, studentCount: 550, teacherCount: 28, principalName: 'G. Swetha', principalContact: '9876510007', principalEmail: 'royapettah.hs@example.com' },
    { id: 'CHN008', name: 'Govt. Higher Secondary School, Tambaram', nameTa: 'அரசு மேல்நிலைப் பள்ளி, தாம்பரம்', type: 'higher_secondary', district: 'Chennai', block: 'Tambaram', udiseCode: '33123456798', address: 'GST Road, Tambaram', addressTa: 'ஜி.எஸ்.டி சாலை, தாம்பரம்', pincode: '600045', establishedYear: 1995, studentCount: 750, teacherCount: 35, principalName: 'H. Anand', principalContact: '9876510008', principalEmail: 'tambaram.hss@example.com' },
    { id: 'CHN009', name: 'Govt. Primary School, Ambattur', nameTa: 'அரசு தொடக்கப்பள்ளி, அம்பத்தூர்', type: 'primary', district: 'Chennai', block: 'Ambattur', udiseCode: '33123456799', address: 'Ambattur Old Town', addressTa: 'அம்பத்தூர் பழைய டவுன்', pincode: '600053', establishedYear: 1962, studentCount: 180, teacherCount: 9, principalName: 'I. Meena', principalContact: '9876510009', principalEmail: 'ambattur.ps@example.com' },
    { id: 'CHN010', name: 'Govt. Middle School, Guindy', nameTa: 'அரசு நடுநிலைப் பள்ளி, கிண்டி', type: 'middle', district: 'Chennai', block: 'Guindy', udiseCode: '33123456800', address: 'Mount Road, Guindy', addressTa: 'மவுண்ட் சாலை, கிண்டி', pincode: '600032', establishedYear: 1978, studentCount: 320, teacherCount: 14, principalName: 'J. Bala', principalContact: '9876510010', principalEmail: 'guindy.ms@example.com' },

    // Coimbatore
    { id: 'CBE001', name: 'Govt. Primary School, Gandhipuram', nameTa: 'அரசு தொடக்கப்பள்ளி, காந்திபுரம்', type: 'primary', district: 'Coimbatore', block: 'Gandhipuram', udiseCode: '33123456801', address: 'Cross Cut Road, Gandhipuram', addressTa: 'கிராஸ் கட் ரோடு, காந்திபுரம்', pincode: '641012', establishedYear: 1958, studentCount: 210, teacherCount: 11, principalName: 'K. Raja', principalContact: '9876520001', principalEmail: 'gandhipuram.ps@example.com' },
    { id: 'CBE002', name: 'Govt. Middle School, Peelamedu', nameTa: 'அரசு நடுநிலைப் பள்ளி, பீளமேடு', type: 'middle', district: 'Coimbatore', block: 'Peelamedu', udiseCode: '33123456802', address: 'Avinashi Road, Peelamedu', addressTa: 'அவினாசி சாலை, பீளமேடு', pincode: '641004', establishedYear: 1972, studentCount: 360, teacherCount: 16, principalName: 'L. Deviya', principalContact: '9876520002', principalEmail: 'peelamedu.ms@example.com' },
    { id: 'CBE003', name: 'Govt. High School, Saibaba Colony', nameTa: 'அரசு உயர்நிலைப் பள்ளி, சாய்பாபா காலனி', type: 'high', district: 'Coimbatore', block: 'Saibaba Colony', udiseCode: '33123456803', address: 'Mettupalayam Road', addressTa: 'மேட்டுப்பாளையம் சாலை', pincode: '641011', establishedYear: 1988, studentCount: 580, teacherCount: 27, principalName: 'M. Ganesh', principalContact: '9876520003', principalEmail: 'saibaba.hs@example.com' },
    { id: 'CBE004', name: 'Govt. Higher Secondary School, R.S. Puram', nameTa: 'அரசு மேல்நிலைப் பள்ளி, ஆர்.எஸ். புரம்', type: 'higher_secondary', district: 'Coimbatore', block: 'R.S. Puram', udiseCode: '33123456804', address: 'DB Road, R.S. Puram', addressTa: 'டி.பி சாலை, ஆர்.எஸ். புரம்', pincode: '641002', establishedYear: 1992, studentCount: 780, teacherCount: 38, principalName: 'N. Sarala', principalContact: '9876520004', principalEmail: 'rspuram.hss@example.com' },
    { id: 'CBE005', name: 'Govt. Primary School, Podanur', nameTa: 'அரசு தொடக்கப்பள்ளி, போத்தனூர்', type: 'primary', district: 'Coimbatore', block: 'Podanur', udiseCode: '33123456805', address: 'Podanur Main Road', addressTa: 'போத்தனூர் முக்கிய சாலை', pincode: '641023', establishedYear: 1968, studentCount: 190, teacherCount: 10, principalName: 'O. Velu', principalContact: '9876520005', principalEmail: 'podanur.ps@example.com' },
    { id: 'CBE006', name: 'Govt. Middle School, Singanallur', nameTa: 'அரசு நடுநிலைப் பள்ளி, சிங்காநல்லூர்', type: 'middle', district: 'Coimbatore', block: 'Singanallur', udiseCode: '33123456806', address: 'Trichy Road, Singanallur', addressTa: 'திருச்சி சாலை, சிங்காநல்லூர்', pincode: '641005', establishedYear: 1977, studentCount: 330, teacherCount: 15, principalName: 'P. Kavitha', principalContact: '9876520006', principalEmail: 'singanallur.ms@example.com' },
    { id: 'CBE007', name: 'Govt. High School, Kuniyamuthur', nameTa: 'அரசு உயர்நிலைப் பள்ளி, குனியமுத்தூர்', type: 'high', district: 'Coimbatore', block: 'Kuniyamuthur', udiseCode: '33123456807', address: 'Palakkad Main Road, Kuniyamuthur', addressTa: 'பாலக்காடு முக்கிய சாலை, குனியமுத்தூர்', pincode: '641008', establishedYear: 1985, studentCount: 520, teacherCount: 25, principalName: 'Q. Murugan', principalContact: '9876520007', principalEmail: 'kuniyamuthur.hs@example.com' },
    { id: 'CBE008', name: 'Govt. Higher Secondary School, Pollachi', nameTa: 'அரசு மேல்நிலைப் பள்ளி, பொள்ளாச்சி', type: 'higher_secondary', district: 'Coimbatore', block: 'Pollachi', udiseCode: '33123456808', address: 'Coimbatore Road, Pollachi', addressTa: 'கோயம்புத்தூர் சாலை, பொள்ளாச்சி', pincode: '642001', establishedYear: 1998, studentCount: 700, teacherCount: 33, principalName: 'R. Gayathri', principalContact: '9876520008', principalEmail: 'pollachi.hss@example.com' },
    { id: 'CBE009', name: 'Govt. Primary School, Mettupalayam', nameTa: 'அரசு தொடக்கப்பள்ளி, மேட்டுப்பாளையம்', type: 'primary', district: 'Coimbatore', block: 'Mettupalayam', udiseCode: '33123456809', address: 'Ooty Road, Mettupalayam', addressTa: 'ஊட்டி சாலை, மேட்டுப்பாளையம்', pincode: '641301', establishedYear: 1963, studentCount: 200, teacherCount: 10, principalName: 'S. Ramu', principalContact: '9876520009', principalEmail: 'mettupalayam.ps@example.com' },
    { id: 'CBE010', name: 'Govt. Middle School, Sulur', nameTa: 'அரசு நடுநிலைப் பள்ளி, சூலூர்', type: 'middle', district: 'Coimbatore', block: 'Sulur', udiseCode: '33123456810', address: 'Kangeyam Road, Sulur', addressTa: 'காங்கேயம் சாலை, சூலூர்', pincode: '641401', establishedYear: 1979, studentCount: 300, teacherCount: 13, principalName: 'T. Indu', principalContact: '9876520010', principalEmail: 'sulur.ms@example.com' },

    // Cuddalore
    { id: 'CDL001', name: 'Govt. Primary School, Cuddalore Port', nameTa: 'அரசு தொடக்கப்பள்ளி, கடலூர் துறைமுகம்', type: 'primary', district: 'Cuddalore', block: 'Cuddalore Port', udiseCode: '33123456811', address: 'Port Road, Cuddalore', addressTa: 'துறைமுக சாலை, கடலூர்', pincode: '607001', establishedYear: 1950, studentCount: 250, teacherCount: 12, principalName: 'U. Gopal', principalContact: '9876530001', principalEmail: 'cuddaloreport.ps@example.com' },
    { id: 'CDL002', name: 'Govt. Middle School, Chidambaram', nameTa: 'அரசு நடுநிலைப் பள்ளி, சிதம்பரம்', type: 'middle', district: 'Cuddalore', block: 'Chidambaram', udiseCode: '33123456812', address: 'East Car Street, Chidambaram', addressTa: 'கிழக்கு கார் வீதி, சிதம்பரம்', pincode: '608001', establishedYear: 1970, studentCount: 400, teacherCount: 18, principalName: 'V. Sundari', principalContact: '9876530002', principalEmail: 'chidambaram.ms@example.com' },
    { id: 'CDL003', name: 'Govt. High School, Neyveli', nameTa: 'அரசு உயர்நிலைப் பள்ளி, நெய்வேலி', type: 'high', district: 'Cuddalore', block: 'Neyveli', udiseCode: '33123456813', address: 'Block 1, Neyveli', addressTa: 'பிளாக் 1, நெய்வேலி', pincode: '607801', establishedYear: 1980, studentCount: 650, teacherCount: 30, principalName: 'W. Prakash', principalContact: '9876530003', principalEmail: 'neyveli.hs@example.com' },
    { id: 'CDL004', name: 'Govt. Higher Secondary School, Virudhachalam', nameTa: 'அரசு மேல்நிலைப் பள்ளி, விருத்தாச்சலம்', type: 'higher_secondary', district: 'Cuddalore', block: 'Virudhachalam', udiseCode: '33123456814', address: 'Salem Main Road, Virudhachalam', addressTa: 'சேலம் முக்கிய சாலை, விருத்தாச்சலம்', pincode: '606001', establishedYear: 1990, studentCount: 850, teacherCount: 42, principalName: 'X. Revathi', principalContact: '9876530004', principalEmail: 'virudhachalam.hss@example.com' },
    { id: 'CDL005', name: 'Govt. Primary School, Panruti', nameTa: 'அரசு தொடக்கப்பள்ளி, பண்ருட்டி', type: 'primary', district: 'Cuddalore', block: 'Panruti', udiseCode: '33123456815', address: 'Panruti Town', addressTa: 'பண்ருட்டி நகரம்', pincode: '607106', establishedYear: 1960, studentCount: 230, teacherCount: 11, principalName: 'Y. Sakthi', principalContact: '9876530005', principalEmail: 'panruti.ps@example.com' },
    { id: 'CDL006', name: 'Govt. Middle School, Kurinjipadi', nameTa: 'அரசு நடுநிலைப் பள்ளி, குறிஞ்சிப்பாடி', type: 'middle', district: 'Cuddalore', block: 'Kurinjipadi', udiseCode: '33123456816', address: 'Near Railway Station, Kurinjipadi', addressTa: 'ரயில் நிலையம் அருகில், குறிஞ்சிப்பாடி', pincode: '607302', establishedYear: 1975, studentCount: 390, teacherCount: 16, principalName: 'Z. Bala', principalContact: '9876530006', principalEmail: 'kurinjipadi.ms@example.com' },
    { id: 'CDL007', name: 'Govt. High School, Parangipettai', nameTa: 'அரசு உயர்நிலைப் பள்ளி, பரங்கிப்பேட்டை', type: 'high', district: 'Cuddalore', block: 'Parangipettai', udiseCode: '33123456817', address: 'Parangipettai Coastal Area', addressTa: 'பரங்கிப்பேட்டை கடலோரப் பகுதி', pincode: '608502', establishedYear: 1983, studentCount: 560, teacherCount: 27, principalName: 'AA. Devi', principalContact: '9876530007', principalEmail: 'parangipettai.hs@example.com' },
    { id: 'CDL008', name: 'Govt. Higher Secondary School, Kattumannarkoil', nameTa: 'அரசு மேல்நிலைப் பள்ளி, காட்டுமன்னார்கோயில்', type: 'higher_secondary', district: 'Cuddalore', block: 'Kattumannarkoil', udiseCode: '33123456818', address: 'Kattumannarkoil Town', addressTa: 'காட்டுமன்னார்கோயில் நகரம்', pincode: '608301', establishedYear: 1993, studentCount: 720, teacherCount: 34, principalName: 'BB. Kumar', principalContact: '9876530008', principalEmail: 'kattumannarkoil.hss@example.com' },
    { id: 'CDL009', name: 'Govt. Primary School, Sethiyathope', nameTa: 'அரசு தொடக்கப்பள்ளி, சேத்தியாதோப்பு', type: 'primary', district: 'Cuddalore', block: 'Sethiyathope', udiseCode: '33123456819', address: 'Sethiyathope Village', addressTa: 'சேத்தியாதோப்பு கிராமம்', pincode: '608102', establishedYear: 1968, studentCount: 210, teacherCount: 10, principalName: 'CC. Anitha', principalContact: '9876530009', principalEmail: 'sethiyathope.ps@example.com' },
    { id: 'CDL010', name: 'Govt. Middle School, Bhuvanagiri', nameTa: 'அரசு நடுநிலைப் பள்ளி, புவனகிரி', type: 'middle', district: 'Cuddalore', block: 'Bhuvanagiri', udiseCode: '33123456820', address: 'Bhuvanagiri Town', addressTa: 'புவனகிரி நகரம்', pincode: '608601', establishedYear: 1979, studentCount: 350, teacherCount: 15, principalName: 'DD. Prabhu', principalContact: '9876530010', principalEmail: 'bhuvanagiri.ms@example.com' }
  ];

  filteredSchools: School[] = []; // Stores schools filtered by district
  selectedSchoolDetails: School | null = null; // Holds the full details of the selected school

  renovationAreas: RenovationArea[] = [
    { id: 'classrooms', labelEn: 'Classrooms', labelTa: 'வகுப்பறைகள்' },
    { id: 'restrooms', labelEn: 'Restrooms', labelTa: 'கழிப்பறைகள்' },
    { id: 'library', labelEn: 'Library', labelTa: 'நூலகம்' },
    { id: 'laboratory', labelEn: 'Laboratory', labelTa: 'ஆய்வகம்' },
    { id: 'playground', labelEn: 'Playground', labelTa: 'விளையாட்டு மைதானம்' },
    { id: 'drinking_water', labelEn: 'Drinking Water Facilities', labelTa: 'குடிநீர் வசதிகள்' },
    { id: 'electricity', labelEn: 'Electricity & Lighting', labelTa: 'மின்சாரம் மற்றும் விளக்குகள்' },
    { id: 'roofing', labelEn: 'Roofing & Structural Repairs', labelTa: 'கூரை மற்றும் கட்டமைப்பு பழுதுகள்' },
    { id: 'boundary_wall', labelEn: 'Boundary Wall', labelTa: 'சுவர்' },
    { id: 'drainage', labelEn: 'Drainage System', labelTa: 'கழிவுநீர் அமைப்பு' }
  ];

  priorityLevels: PriorityLevel[] = [
    { value: 'high', labelEn: 'High', labelTa: 'உயர்' },
    { value: 'medium', labelEn: 'Medium', labelTa: 'நடுத்தர' },
    { value: 'low', labelEn: 'Low', labelTa: 'குறைந்த' }
  ];

  budgetRanges: BudgetRange[] = [
    { value: 'below_1lakh', labelEn: 'Below ₹1 Lakh', labelTa: '₹1 லட்சத்திற்கும் குறைவானது' },
    { value: '1-5lakhs', labelEn: '₹1 Lakh - ₹5 Lakhs', labelTa: '₹1 லட்சம் - ₹5 லட்சம்' },
    { value: '5-10lakhs', labelEn: '₹5 Lakhs - ₹10 Lakhs', labelTa: '₹5 லட்சம் - ₹10 லட்சம்' },
    { value: 'above_10lakhs', labelEn: 'Above ₹10 Lakhs', labelTa: '₹10 லட்சத்திற்கும் மேலானது' }
  ];

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef, // Inject ChangeDetectorRef
    private schoolService: SchoolService, // Inject SchoolService
    private languageService: LanguageService 
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
        addressTa: ['', Validators.required], // Add addressTa to the form group

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

  ngOnInit(): void {
    // Subscribe to language changes from the service
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang as 'english' | 'tamil';
      this.cdRef.detectChanges(); // Important: Trigger change detection
    });
  }

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
      address: '', // Clear address
      addressTa: '' // Clear Tamil address
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
        schoolNameTa: this.selectedSchoolDetails.nameTa, // Use Tamil name here
        udiseCode: this.selectedSchoolDetails.udiseCode,
        schoolType: this.selectedSchoolDetails.type,
        district: this.selectedSchoolDetails.district,
        block: this.selectedSchoolDetails.block,
        address: this.selectedSchoolDetails.address || '',
        addressTa: this.selectedSchoolDetails.addressTa || '', // Populate Tamil address
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
        block: '', address: '', addressTa: '', pincode: '', establishedYear: '',
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
  const formControl = this.schoolForm.get(`${groupName}.${controlName}`);

  // Check if files were selected from the dialog
  if (input.files && input.files.length > 0) {
    console.log(`File input changed for: ${controlName}`);
    console.log(`Number of files selected in browser: ${input.files.length}`);

    if (controlName === 'conditionPhotos') {
      // This block handles the "conditionPhotos" input specifically
      const filesArray: File[] = Array.from(input.files);
      formControl?.setValue(filesArray);
      
      // This is the most important log. It shows what is actually being stored in the form.
      console.log('Stored in form control:', formControl?.value);

    } else {
      // This block handles all other single-file inputs
      formControl?.setValue(input.files[0]);
    }
  } else {
    // This runs if you open the file dialog and click "Cancel"
    formControl?.setValue(null);
  }

  // These lines update the form's appearance
  formControl?.markAsTouched();
  this.cdRef.detectChanges();
}

 
  getSelectedRenovationAreas(): string[] {
    const selectedAreaIds: string[] = [];
    const renovationFormArray = this.schoolForm.get('infrastructure.renovationAreas') as FormArray;

    // This now correctly gets the ID, not the translated label
    this.renovationAreas.forEach((area, index) => {
      if (renovationFormArray.controls[index]?.value) {
        selectedAreaIds.push(area.id); // Pushing the ID (e.g., 'classrooms')
      }
    });
    return selectedAreaIds;
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
      alert(this.getTranslatedText('Please complete all required fields in the current section before proceeding.', 'தற்போதைய பிரிவில் உள்ள அனைத்து கட்டாயப் புலங்களையும் பூர்த்தி செய்யவும்.'));
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
    if (!value) return this.getTranslatedText('Not specified', 'குறிப்பிடப்படவில்லை');
    const range = this.budgetRanges.find(r => r.value === value);
    return range ? this.getTranslatedText(range.labelEn, range.labelTa) : this.getTranslatedText('Not specified', 'குறிப்பிடப்படவில்லை');
  }

  getPriorityLevelLabel(value: string): string {
    if (!value) return this.getTranslatedText('Not specified', 'குறிப்பிடப்படவில்லை');
    const level = this.priorityLevels.find(p => p.value === value);
    return level ? this.getTranslatedText(level.labelEn, level.labelTa) : this.getTranslatedText('Not specified', 'குறிப்பிடப்படவில்லை');
  }

  getSchoolTypeTranslated(englishType: string): string {
    switch (englishType.toLowerCase()) {
      case 'primary': return this.getTranslatedText('Primary School', 'தொடக்கப்பள்ளி');
      case 'middle': return this.getTranslatedText('Middle School', 'நடுநிலைப் பள்ளி');
      case 'high': return this.getTranslatedText('High School', 'உயர்நிலைப் பள்ளி');
      case 'higher_secondary': return this.getTranslatedText('Higher Secondary School', 'மேல்நிலைப் பள்ளி');
      default: return this.getTranslatedText(englishType, englishType); // Fallback
    }
  }


    getSchoolAddressTranslated(englishAddress: string): string {
    if (this.selectedSchoolDetails && this.selectedSchoolDetails.address === englishAddress) {
      return this.selectedSchoolDetails.addressTa || englishAddress;
    }
    const addressTaFromForm = this.schoolForm.get('basicInfo.addressTa')?.value;
    return addressTaFromForm || englishAddress;
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

  // Replace your existing onSubmit function with this one

onSubmit(): void {
  // Mark all controls as touched to show validation
  this.schoolForm.markAllAsTouched();
  this.cdRef.detectChanges();

  if (!this.schoolForm.valid) {
    alert(this.getTranslatedText('Please complete all required fields correctly before submitting.', 'சமர்ப்பிக்கும் முன் அனைத்து கட்டாயப் புலங்களையும் சரியாகப் பூர்த்தி செய்யவும்.'));
    return;
  }

  const rawFormData = this.schoolForm.getRawValue();
  const formData = new FormData();

  // --- Append all text fields from basicInfo ---
  Object.keys(rawFormData.basicInfo).forEach(key => {
    formData.append(key, rawFormData.basicInfo[key]);
  });

  // --- Append all text fields from infrastructure ---
  Object.keys(rawFormData.infrastructure).forEach(key => {
    // Skip renovationAreas, we'll handle it separately
    if (key !== 'renovationAreas') {
      formData.append(key, rawFormData.infrastructure[key]);
    }
  });

  // --- Append the renovationAreas array ---
  this.getSelectedRenovationAreas().forEach(area => {
    formData.append('renovationAreas', area);
  });

  // --- Append the uploaded files ---
  if (rawFormData.documentation.recognitionCert) {
    formData.append('recognitionCert', rawFormData.documentation.recognitionCert);
  }
  if (rawFormData.documentation.assessmentReport) {
    formData.append('assessmentReport', rawFormData.documentation.assessmentReport);
  }
  if (rawFormData.documentation.budgetEstimates) {
    formData.append('budgetEstimates', rawFormData.documentation.budgetEstimates);
  }
  // Append each condition photo file
  if (rawFormData.documentation.conditionPhotos && rawFormData.documentation.conditionPhotos.length > 0) {
    rawFormData.documentation.conditionPhotos.forEach((file: File) => {
      formData.append('conditionPhotos', file);
    });
  }

  // --- Now, send the FormData object to the service ---
  this.schoolService.submitSchool(formData).subscribe({
    next: (response) => {
      console.log('Server response:', response);
      alert(this.getTranslatedText('School registration submitted successfully!', 'பள்ளி பதிவு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!'));
      this.resetForm();
    },
    error: (error) => {
      // Your existing error handling logic
      console.error('Error submitting form:', error);
      let detailedErrorMessage = 'An unknown error occurred.';
      if (error.error && error.error.message) {
          detailedErrorMessage = error.error.message;
      }
      alert(`Submission failed:\n\n${detailedErrorMessage}`);
    }
  });
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

  toggleLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'english' ? 'tamil' : 'english';
    this.cdRef.detectChanges(); // Trigger change detection to update UI labels
  }

 getTranslatedText(englishText: string, tamilText: string): string {
    return this.currentLanguage === 'english' ? englishText : tamilText;
  }
}