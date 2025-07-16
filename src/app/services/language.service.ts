import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable } from 'rxjs';

export interface Translation {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
 private currentLanguageSubject = new BehaviorSubject<string>('english');
  public currentLanguage$: Observable<string> = this.currentLanguageSubject.asObservable();

public language$ = this.currentLanguage$;

  private translations: { [key: string]: Translation } = {
    english: {
      // Header and Navigation
      'school_renovation_initiative': 'Tamil Nadu School Renovation Initiative',
      'building_better_futures': 'Building better futures through education',
      'home': 'Home',
      'schools': 'Schools',
      'donate': 'Donate',
      'volunteer': 'Volunteer',
      'contact_us': 'Contact Us',
      'language': 'Language',
      'english': 'English',
      'tamil': 'தமிழ்',

      // School Registration Form
      'school_registration_title': 'School Registration for Renovation',
      'school_registration_subtitle': 'Submit your government school for renovation consideration under the Tamil Nadu School Infrastructure Development Program',
      
      // Required Documents
      'required_documents': 'Required Documents & Information',
      'school_recognition_certificate': 'School Recognition Certificate',
      'infrastructure_assessment_report': 'Latest Infrastructure Assessment Report',
      'enrollment_data': 'Current enrollment data',
      'renovation_photos': 'Photographs of areas requiring renovation',
      'principal_seal': 'Principal\'s official seal and signature',

      // Progress Steps
      'step_1': 'School Details',
      'step_2': 'Infrastructure Needs',
      'step_3': 'Documentation',
      'step_4': 'Review & Submit',

      // Step 1: Basic Information
      'basic_school_info': 'Basic School Information',
      'school_name_english': 'School Name (English)',
      'school_name_tamil': 'School Name (Tamil)',
      'udise_code': 'UDISE Code',
      'udise_help': '11-digit UDISE code',
      'school_type': 'School Type',
      'select_school_type': 'Select School Type',
      'primary_school': 'Primary School (Classes 1-5)',
      'middle_school': 'Middle School (Classes 6-8)',
      'high_school': 'High School (Classes 9-10)',
      'higher_secondary': 'Higher Secondary (Classes 11-12)',
      'composite_school': 'Composite School (Classes 1-12)',
      'district': 'District',
      'select_district': 'Select District',
      'block_taluk': 'Block/Taluk',
      'complete_address': 'Complete Address',
      'pincode': 'Pincode',
      'established_year': 'Established Year',
      'current_enrollment': 'Current Student Enrollment',
      'teacher_count': 'Number of Teachers',
      'principal_name': 'Principal Name',
      'principal_contact': 'Principal Contact Number',
      'principal_email': 'Principal Email',

      // Step 2: Infrastructure Assessment
      'infrastructure_assessment': 'Infrastructure Needs Assessment',
      'areas_requiring_renovation': 'Areas Requiring Renovation',
      'priority_level': 'Priority Level',
      'estimated_budget': 'Estimated Budget Required',
      'select_budget_range': 'Select Budget Range',
      'current_condition_description': 'Detailed Description of Current Condition',
      'current_condition_placeholder': 'Describe the current state of infrastructure, specific issues, and urgent needs...',
      'expected_outcome': 'Expected Renovation Outcome',
      'expected_outcome_placeholder': 'Describe the expected improvements and benefits for students...',

      // Step 3: Documentation
      'documentation_evidence': 'Documentation & Evidence',
      'upload_recognition_cert': 'Upload Recognition Certificate',
      'upload_assessment_report': 'Upload Assessment Report',
      'upload_condition_photos': 'Upload Photos (Multiple files allowed)',
      'upload_budget_estimates': 'Upload Budget Documents',
      'current_condition_photos': 'Current Condition Photos',
      'budget_estimates': 'Budget Estimates/Quotations',

      // Step 4: Additional Information
      'additional_information': 'Additional Information',
      'community_contribution': 'Community Contribution (if any)',
      'community_contribution_placeholder': 'Describe any community support or contributions for the renovation...',
      'renovation_history': 'Previous Renovation History',
      'renovation_history_placeholder': 'Mention any previous renovations or improvements done...',
      'special_requirements': 'Special Requirements/Accessibility Needs',
      'special_requirements_placeholder': 'Any special requirements for disabled students or other specific needs...',
      'preferred_timeline': 'Preferred Timeline for Renovation',
      'select_timeline': 'Select Timeline',
      'immediate': 'Immediate (Within 1 month)',
      'short_term': 'Short Term (1-3 months)',
      'medium_term': 'Medium Term (3-6 months)',
      'long_term': 'Long Term (6-12 months)',
      'next_academic_year': 'Next Academic Year',

      // Buttons
      'previous': 'Previous',
      'next': 'Next',
      'submit_application': 'Submit Application',

      // Priority Levels
      'high_priority': 'High',
      'medium_priority': 'Medium',
      'low_priority': 'Low',

      // Validation Messages
      'school_name_en_required': 'School name in English is required',
      'school_name_ta_required': 'School name in Tamil is required',
      'udise_code_required': '11-digit UDISE code is required',
      'school_type_required': 'School type is required',
      'district_required': 'District is required',
      'block_required': 'Block/Taluk is required',
      'address_required': 'Complete address is required',
      'pincode_required': '6-digit pincode is required',
      'established_year_required': 'Valid established year is required',
      'student_count_required': 'Student count must be at least 1',
      'teacher_count_required': 'Teacher count must be at least 1',
      'principal_name_required': 'Principal name is required',
      'principal_contact_required': '10-digit contact number is required',
      'principal_email_required': 'Valid email is required',
      'renovation_areas_required': 'At least one area must be selected',
      'priority_required': 'Priority level is required',
      'condition_description_required': 'Description is required',
      'certificate_required': 'Certificate is required',
      'photos_required': 'Photos are required',

      // Footer
      'quick_links': 'Quick Links',
      'all_rights_reserved': '2023 Tamil Nadu School Renovation Initiative. All rights reserved.',
      'email': 'info@tnschools.com',
      'phone': '+91 9876543210'
    },
    tamil: {
      // Header and Navigation
      'school_renovation_initiative': 'தமிழ்நாடு பள்ளி புதுப்பித்தல் முயற்சி',
      'building_better_futures': 'கல்வி மூலம் சிறந்த எதிர்காலத்தை உருவாக்குதல்',
      'home': 'முகப்பு',
      'schools': 'பள்ளிகள்',
      'donate': 'நன்கொடை',
      'volunteer': 'தன்னார்வலர்',
      'contact_us': 'எங்களைத் தொடர்பு கொள்ள',
      'language': 'மொழி',
      'english': 'English',
      'tamil': 'தமிழ்',

      // School Registration Form
      'school_registration_title': 'புதுப்பித்தலுக்கான பள்ளி பதிவு',
      'school_registration_subtitle': 'தமிழ்நாடு பள்ளி உள்கட்டமைப்பு மேம்பாட்டு திட்டத்தின் கீழ் புதுப்பித்தல் கருத்தில் கொள்ளுவதற்காக உங்கள் அரசுப் பள்ளியை சமர்ப்பிக்கவும்',
      
      // Required Documents
      'required_documents': 'தேவையான ஆவணங்கள் மற்றும் தகவல்கள்',
      'school_recognition_certificate': 'பள்ளி அங்கீகார சான்றிதழ்',
      'infrastructure_assessment_report': 'சமீபத்திய உள்கட்டமைப்பு மதிப்பீட்டு அறிக்கை',
      'enrollment_data': 'தற்போதைய சேர்க்கை தரவு',
      'renovation_photos': 'புதுப்பித்தல் தேவைப்படும் பகுதிகளின் புகைப்படங்கள்',
      'principal_seal': 'தலைமை ஆசிரியரின் அதிகாரப்பூர்வ முத்திரை மற்றும் கையெழுத்து',

      // Progress Steps
      'step_1': 'பள்ளி விவரங்கள்',
      'step_2': 'உள்கட்டமைப்பு தேவைகள்',
      'step_3': 'ஆவணங்கள்',
      'step_4': 'மீளாய்வு மற்றும் சமர்ப்பணை',

      // Step 1: Basic Information
      'basic_school_info': 'அடிப்படை பள்ளி தகவல்',
      'school_name_english': 'பள்ளி பெயர் (ஆங்கிலம்)',
      'school_name_tamil': 'பள்ளி பெயர் (தமிழ்)',
      'udise_code': 'UDISE குறியீடு',
      'udise_help': '11-இலக்க UDISE குறியீடு',
      'school_type': 'பள்ளி வகை',
      'select_school_type': 'பள்ளி வகையை தேர்ந்தெடுக்கவும்',
      'primary_school': 'தொடக்கப் பள்ளி (வகுப்புகள் 1-5)',
      'middle_school': 'நடுநிலைப் பள்ளி (வகுப்புகள் 6-8)',
      'high_school': 'உயர்நிலைப் பள்ளி (வகுப்புகள் 9-10)',
      'higher_secondary': 'மேல்நிலைப் பள்ளி (வகுப்புகள் 11-12)',
      'composite_school': 'கூட்டுப் பள்ளி (வகுப்புகள் 1-12)',
      'district': 'மாவட்டம்',
      'select_district': 'மாவட்டத்தை தேர்ந்தெடுக்கவும்',
      'block_taluk': 'தொகுதி/தாலுக்',
      'complete_address': 'முழு முகவரி',
      'pincode': 'அஞ்சல் குறியீடு',
      'established_year': 'நிறுவப்பட்ட ஆண்டு',
      'current_enrollment': 'தற்போதைய மாணவர் சேர்க்கை',
      'teacher_count': 'ஆசிரியர்களின் எண்ணிக்கை',
      'principal_name': 'தலைமை ஆசிரியர் பெயர்',
      'principal_contact': 'தலைமை ஆசிரியர் தொடர்பு எண்',
      'principal_email': 'தலைமை ஆசிரியர் மின்னஞ்சல்',

      // Step 2: Infrastructure Assessment
      'infrastructure_assessment': 'உள்கட்டமைப்பு தேவை மதிப்பீடு',
      'areas_requiring_renovation': 'புதுப்பித்தல் தேவைப்படும் பகுதிகள்',
      'priority_level': 'முன்னுரிமை நிலை',
      'estimated_budget': 'மதிப்பிடப்பட்ட பட்ஜெட் தேவை',
      'select_budget_range': 'பட்ஜெட் வரம்பை தேர்ந்தெடுக்கவும்',
      'current_condition_description': 'தற்போதைய நிலையின் விரிவான விவரணை',
      'current_condition_placeholder': 'உள்கட்டமைப்பின் தற்போதைய நிலை, குறிப்பிட்ட பிரச்சினைகள் மற்றும் அவசரத் தேவைகளை விவரிக்கவும்...',
      'expected_outcome': 'எதிர்பார்க்கப்படும் புதுப்பித்தல் முடிவு',
      'expected_outcome_placeholder': 'எதிர்பார்க்கப்படும் மேம்பாடுகள் மற்றும் மாணவர்களுக்கான பலன்களை விவரிக்கவும்...',

      // Step 3: Documentation
      'documentation_evidence': 'ஆவணங்கள் மற்றும் சான்றுகள்',
      'upload_recognition_cert': 'அங்கீகார சான்றிதழை பதிவேற்றவும்',
      'upload_assessment_report': 'மதிப்பீட்டு அறிக்கையை பதிவேற்றவும்',
      'upload_condition_photos': 'புகைப்படங்களை பதிவேற்றவும் (பல கோப்புகள் அனுமதிக்கப்படுகின்றன)',
      'upload_budget_estimates': 'பட்ஜெட் ஆவணங்களை பதிவேற்றவும்',
      'current_condition_photos': 'தற்போதைய நிலை புகைப்படங்கள்',
      'budget_estimates': 'பட்ஜெட் மதிப்பீடுகள்/மேற்கோள்கள்',

      // Step 4: Additional Information
      'additional_information': 'கூடுதல் தகவல்',
      'community_contribution': 'சமூக பங்களிப்பு (ஏதேனும் இருந்தால்)',
      'community_contribution_placeholder': 'புதுப்பித்தலுக்கான சமூக ஆதரவு அல்லது பங்களிப்புகளை விவரிக்கவும்...',
      'renovation_history': 'முந்தைய புதுப்பித்தல் வரலாறு',
      'renovation_history_placeholder': 'முன்பு செய்யப்பட்ட புதுப்பித்தல்கள் அல்லது மேம்பாடுகளை குறிப்பிடவும்...',
      'special_requirements': 'சிறப்பு தேவைகள்/அணுகல் தேவைகள்',
      'special_requirements_placeholder': 'மாற்றுத்திறனாளி மாணவர்களுக்கான சிறப்பு தேவைகள் அல்லது பிற குறிப்பிட்ட தேவைகள்...',
      'preferred_timeline': 'புதுப்பித்தலுக்கான விரும்பப்படும் காலவரம்பு',
      'select_timeline': 'காலவரம்பை தேர்ந்தெடுக்கவும்',
      'immediate': 'உடனடி (1 மாதத்தில்)',
      'short_term': 'குறுகிய கால (1-3 மாதங்கள்)',
      'medium_term': 'நடுத்தர கால (3-6 மாதங்கள்)',
      'long_term': 'நீண்ட கால (6-12 மாதங்கள்)',
      'next_academic_year': 'அடுத்த கல்வி ஆண்டு',

      // Buttons
      'previous': 'முந்தைய',
      'next': 'அடுத்து',
      'submit_application': 'விண்ணப்பத்தை சமர்ப்பிக்கவும்',

      // Priority Levels
      'high_priority': 'உயர்',
      'medium_priority': 'நடுத்தர',
      'low_priority': 'குறைந்த',

      // Validation Messages
      'school_name_en_required': 'ஆங்கிலத்தில் பள்ளி பெயர் தேவை',
      'school_name_ta_required': 'தமிழில் பள்ளி பெயர் தேவை',
      'udise_code_required': '11-இலக்க UDISE குறியீடு தேவை',
      'school_type_required': 'பள்ளி வகை தேவை',
      'district_required': 'மாவட்டம் தேவை',
      'block_required': 'தொகுதி/தாலுக் தேவை',
      'address_required': 'முழு முகவரி தேவை',
      'pincode_required': '6-இலக்க அஞ்சல் குறியீடு தேவை',
      'established_year_required': 'செல்லுபடியான நிறுவப்பட்ட ஆண்டு தேவை',
      'student_count_required': 'மாணவர் எண்ணிக்கை குறைந்தது 1 ஆக இருக்க வேண்டும்',
      'teacher_count_required': 'ஆசிரியர் எண்ணிக்கை குறைந்தது 1 ஆக இருக்க வேண்டும்',
      'principal_name_required': 'தலைமை ஆசிரியர் பெயர் தேவை',
      'principal_contact_required': '10-இலக்க தொடர்பு எண் தேவை',
      'principal_email_required': 'செல்லுபடியான மின்னஞ்சல் தேவை',
      'renovation_areas_required': 'குறைந்தது ஒரு பகுதியை தேர்ந்தெடுக்க வேண்டும்',
      'priority_required': 'முன்னுரிமை நிலை தேவை',
      'condition_description_required': 'விவரணை தேவை',
      'certificate_required': 'சான்றிதழ் தேவை',
      'photos_required': 'புகைப்படங்கள் தேவை',

      // Footer
      'quick_links': 'விரைவு இணைப்புகள்',
      'all_rights_reserved': '2023 தமிழ்நாடு பள்ளி புதுப்பித்தல் முயற்சி. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
      'email': 'info@tnschools.com',
      'phone': '+91 9876543210'
    }
  };

  constructor() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && this.translations[savedLanguage]) {
      this.currentLanguageSubject.next(savedLanguage);
    }
  }

  /** Returns the currently active language ('english' or 'tamil') */
  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  /** Optional: Used in components as `getInitialLanguage()` */
  getInitialLanguage(): string {
    return this.getCurrentLanguage();
  }

  /** Set a new language if available */
  setLanguage(language: string): void {
    if (this.translations[language]) {
      this.currentLanguageSubject.next(language);
      localStorage.setItem('selectedLanguage', language);
    }
  }

  /** Translate a single key in the current language */
  translate(key: string): string {
    const lang = this.getCurrentLanguage();
    return this.translations[lang][key] || key;
  }

  /** Translate a key for a specific language */
  getTranslation(key: string, language?: string): string {
    const lang = language || this.getCurrentLanguage();
    return this.translations[lang]?.[key] || key;
  }

  /** Get all translation strings for the current or given language */
  getAllTranslations(language?: string): Translation {
    const lang = language || this.getCurrentLanguage();
    return this.translations[lang] || {};
  }

  /** Get list of supported languages */
  getAvailableLanguages(): string[] {
    return Object.keys(this.translations);
  }
}