// language.service.ts
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
      'rebuild_tn_schools': 'Rebuild Tamil Nadu Schools',
      'choose_a_school': 'Choose a school. Make an impact. Transform a future.',
      'raised_of': 'raised of',
      'goal': 'goal',
      'funded': 'funded',
      'featured_schools': 'Featured Government Schools in Need',
      'you_are_about_to_make_a_difference': 'You are about to make a difference in the lives of students at a Tamil Nadu Government School. Your support will help renovate their classrooms, provide better learning tools, and build a brighter tomorrow.',
      'no_photos': 'No Photos Available',
      'donate_btn': 'Donate',
      'view_on_map': 'View on Map',
      'support': 'Support',
      'personal_info': 'Personal Info',
      'donation_amount': 'Donation Amount',
      'payment': 'Payment',
      'full_name': 'Full Name',
      'enter_full_name': 'Enter your full name',
      'name_required': 'Name is required.',
      'email_address': 'Email Address',
      'enter_email': 'Enter your email',
      'email_required': 'Email is required.',
      'invalid_email': 'Please enter a valid email address.',
      'phone_number': 'Phone Number',
      'enter_phone_number': 'Enter your phone number',
      'invalid_phone': 'Please enter a valid 10-digit phone number.',
      'enter_custom_amount': 'Enter custom amount',
      'donation_amount_required': 'Donation amount is required.',
      'min_amount': 'Amount must be at least ₹100.',
      'dedication': 'Dedication',
      'optional': 'Optional',
      'dedication_placeholder': 'In honor/memory of someone special?',
      'choose_payment_method': 'Choose a Payment Method',
      'credit_card': 'Credit/Debit Card',
      'pay_with_card': 'Pay with your card.',
      'upi': 'UPI',
      'pay_with_upi': 'Pay with any UPI app.',
      'netbanking': 'Net Banking',
      'all_major_banks': 'All major banks supported.',
      'select_payment_method': 'Please select a payment method.',
      'card_number': 'Card Number',
      'invalid_card_number': 'Please enter a valid card number.',
      'expiry_date': 'Expiry Date',
      'invalid_expiry_date': 'Invalid expiry date.',
      'invalid_cvv': 'Invalid CVV.',
      'bank_name': 'Bank Name',
      'select_bank': 'Select Bank',
      'select_bank_required': 'Please select a bank.',
      'account_number': 'Account Number',
      'invalid_account_number': 'Please enter a valid account number.',
      'ifsc_code': 'IFSC Code',
      'invalid_ifsc_code': 'Please enter a valid IFSC code.',
      'upi_id': 'UPI ID',
      'invalid_upi_id': 'Please enter a valid UPI ID.',
      'cover_fees': 'Add ₹{{feeAmount | number}} to cover payment processing fees',
      'to_cover_fees': 'to cover payment processing fees',
      'previous': 'Previous',
      'next': 'Next',
      'proceed_to_pay': 'Proceed to Pay',
      'processing': 'Processing...',
      'payment_successful': 'Payment Successful!',
      'thank_you_message': 'Thank you for your generosity! Your donation of',
      'to': 'to',
      'has_been_recorded': 'has been recorded.',
      'donations_directly_support': 'All donations directly support infrastructure and learning resources for the selected school.',
      'see_your_impact': 'See Your Impact',
      'improved_learning_environment': 'Improved learning environment',
      'safe_playground_facilities': 'Safe playground facilities',
      'technology_enabled_education': 'Technology-enabled education',
      'donor_stories': 'Donor Stories',
      'parent_and_volunteer': 'Parent & Volunteer',
      'school_teacher': 'School Teacher',
      'corporate_donor': 'Corporate Donor',
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
      'quick_links': 'Quick Links',
      'all_rights_reserved': 'All rights reserved.',
      'email': 'info@tnschools.com',
      'phone': '+91 9876543210',

      // Success Stories Page
      'featured_success': 'Featured Success',
      'a_complete_transformation': 'A complete transformation in',
      'schools_transformed': 'Schools Transformed',
      'total_funds_raised': 'Total Funds Raised',
      'students_impacted': 'Students Impacted',
      'search_by_school_name': 'Search by school name...',
      'all_districts': 'All Districts',
      'all_types': 'All Types',
      'no_stories_message': 'No completed projects match your criteria. Please adjust the filters or check back later!',
      'page_of': 'Page',
      'story_location_prefix': 'A complete transformation in',

      // Contact Page
      'contact_us_title': 'Contact Us',
      'contact_us_message': 'We\'d love to hear from you. Please fill out the form below or reach out to us using the contact details provided.',
      'govt_school_initiative': 'Government School Renovation Initiative',
      'send_message_title': 'Send us a message',
      'your_name': 'Your Name',
      'your_email': 'Your Email',
      'subject': 'Subject',
      'message': 'Message',
      'send_message': 'Send Message'
    },
    tamil: {
      // Header and Navigation
      'rebuild_tn_schools': 'தமிழ்நாடு பள்ளிகளை மீண்டும் உருவாக்குவோம்',
      'choose_a_school': 'ஒரு பள்ளியைத் தேர்ந்தெடுங்கள். ஒரு தாக்கத்தை உருவாக்குங்கள். ஒரு எதிர்காலத்தை மாற்றுங்கள்.',
      'raised_of': 'திரட்டப்பட்ட',
      'goal': 'இலக்கு',
      'funded': 'நிதி திரட்டப்பட்டது',
      'featured_schools': 'தேவைப்படும் சிறப்பு அரசுப் பள்ளிகள்',
      'you_are_about_to_make_a_difference': 'நீங்கள் ஒரு தமிழ்நாடு அரசுப் பள்ளியின் மாணவர்களின் வாழ்வில் ஒரு மாற்றத்தை ஏற்படுத்தப் போகிறீர்கள். உங்கள் ஆதரவு அவர்களின் வகுப்பறைகளை புதுப்பிக்கவும், சிறந்த கற்றல் கருவிகளை வழங்கவும், மேலும் ஒரு பிரகாசமான எதிர்காலத்தை உருவாக்கவும் உதவும்.',
      'no_photos': 'புகைப்படங்கள் இல்லை',
      'donate_btn': 'நன்கொடை',
      'view_on_map': 'வரைபடத்தில் காண்க',
      'support': 'ஆதரவு',
      'personal_info': 'தனிப்பட்ட தகவல்',
      'donation_amount': 'நன்கொடைத் தொகை',
      'payment': 'பணம் செலுத்துதல்',
      'full_name': 'முழு பெயர்',
      'enter_full_name': 'உங்கள் முழு பெயரை உள்ளிடவும்',
      'name_required': 'பெயர் தேவை.',
      'email_address': 'மின்னஞ்சல் முகவரி',
      'enter_email': 'உங்கள் மின்னஞ்சலை உள்ளிடவும்',
      'email_required': 'மின்னஞ்சல் தேவை.',
      'invalid_email': 'செல்லுபடியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.',
      'phone_number': 'தொலைபேசி எண்',
      'enter_phone_number': 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்',
      'invalid_phone': 'செல்லுபடியான 10-இலக்க தொலைபேசி எண்ணை உள்ளிடவும்.',
      'enter_custom_amount': 'தனிப்பயன் தொகையை உள்ளிடவும்',
      'donation_amount_required': 'நன்கொடைத் தொகை தேவை.',
      'min_amount': 'தொகை குறைந்தபட்சம் ₹100 ஆக இருக்க வேண்டும்.',
      'dedication': 'அர்ப்பணிப்பு',
      'optional': 'விரும்பினால்',
      'dedication_placeholder': 'ஒரு சிறப்பு நபரின் மரியாதை/நினைவாகவா?',
      'choose_payment_method': 'பணம் செலுத்தும் முறையைத் தேர்ந்தெடுக்கவும்',
      'credit_card': 'கிரெடிட்/டெபிட் கார்டு',
      'pay_with_card': 'உங்கள் கார்டு மூலம் பணம் செலுத்துங்கள்.',
      'upi': 'UPI',
      'pay_with_upi': 'ஏதேனும் UPI செயலி மூலம் பணம் செலுத்துங்கள்.',
      'netbanking': 'நெட் பேங்கிங்',
      'all_major_banks': 'அனைத்து பெரிய வங்கிகளும் ஆதரிக்கப்படுகின்றன.',
      'select_payment_method': 'பணம் செலுத்தும் முறையைத் தேர்ந்தெடுக்கவும்.',
      'card_number': 'அட்டை எண்',
      'invalid_card_number': 'செல்லுபடியான அட்டை எண்ணை உள்ளிடவும்.',
      'expiry_date': 'காலாவதி தேதி',
      'invalid_expiry_date': 'செல்லாத காலாவதி தேதி.',
      'invalid_cvv': 'செல்லாத CVV.',
      'bank_name': 'வங்கி பெயர்',
      'select_bank': 'வங்கியைத் தேர்ந்தெடுக்கவும்',
      'select_bank_required': 'தயவுசெய்து ஒரு வங்கியைத் தேர்ந்தெடுக்கவும்.',
      'account_number': 'கணக்கு எண்',
      'invalid_account_number': 'செல்லுபடியான கணக்கு எண்ணை உள்ளிடவும்.',
      'ifsc_code': 'IFSC குறியீடு',
      'invalid_ifsc_code': 'செல்லுபடியான IFSC குறியீட்டை உள்ளிடவும்.',
      'upi_id': 'UPI ID',
      'invalid_upi_id': 'செல்லுபடியான UPI ID-ஐ உள்ளிடவும்.',
      'cover_fees': 'பணம் செலுத்துதல் செயலாக்க கட்டணங்களை ஈடுகட்ட ₹{{feeAmount | number}} சேர்க்கவும்',
      'to_cover_fees': 'பணம் செலுத்துதல் செயலாக்க கட்டணங்களை ஈடுகட்ட',
      'previous': 'முந்தைய',
      'next': 'அடுத்து',
      'proceed_to_pay': 'பணம் செலுத்த தொடரவும்',
      'processing': 'செயலாக்கிக் கொண்டிருக்கிறது...',
      'payment_successful': 'பணம் செலுத்துதல் வெற்றிகரமாக முடிந்தது!',
      'thank_you_message': 'உங்கள் தாராள மனப்பான்மைக்கு நன்றி! உங்கள் நன்கொடைத் தொகை',
      'to': 'க்கு',
      'has_been_recorded': 'பதிவு செய்யப்பட்டுள்ளது.',
      'donations_directly_support': 'அனைத்து நன்கொடைகளும் நேரடியாக தேர்ந்தெடுக்கப்பட்ட பள்ளியின் உள்கட்டமைப்பு மற்றும் கற்றல் வளங்களுக்கு ஆதரவளிக்கின்றன.',
      'see_your_impact': 'உங்கள் தாக்கத்தை காண்க',
      'improved_learning_environment': 'மேம்படுத்தப்பட்ட கற்றல் சூழல்',
      'safe_playground_facilities': 'பாதுகாப்பான விளையாட்டு மைதான வசதிகள்',
      'technology_enabled_education': 'தொழில்நுட்பம் மூலம் மேம்படுத்தப்பட்ட கல்வி',
      'donor_stories': 'நன்கொடையாளர் கதைகள்',
      'parent_and_volunteer': 'பெற்றோர் மற்றும் தன்னார்வலர்',
      'school_teacher': 'பள்ளி ஆசிரியர்',
      'corporate_donor': 'கார்ப்ரேட் நன்கொடையாளர்',
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
      'quick_links': 'விரைவு இணைப்புகள்',
      'all_rights_reserved': 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
      'email': 'info@tnschools.com',
      'phone': '+91 9876543210',

      // Success Stories Page
      'featured_success': 'சிறப்பு வெற்றி',
      'a_complete_transformation': 'ஒரு முழுமையான மாற்றம்',
      'schools_transformed': 'பள்ளிகள் மாற்றப்பட்டன',
      'total_funds_raised': 'திரட்டப்பட்ட மொத்த நிதி',
      'students_impacted': 'தாக்கம் பெற்ற மாணவர்கள்',
      'search_by_school_name': 'பள்ளிப் பெயர் மூலம் தேடுக...',
      'all_districts': 'அனைத்து மாவட்டங்களும்',
      'all_types': 'அனைத்து வகைகளும்',
      'no_stories_message': 'உங்கள் தேடலுக்கு பொருத்தமான திட்டங்கள் எதுவும் இல்லை. தயவுசெய்து வடிகட்டிகளை மாற்றியமைக்கவும் அல்லது பின்னர் சரிபார்க்கவும்!',
      'page_of': 'பக்கம்',
      'story_location_prefix': 'ஒரு முழுமையான மாற்றம்',

      // Contact Page
      'contact_us_title': 'எங்களைத் தொடர்பு கொள்ள',
      'contact_us_message': 'உங்கள் கருத்துக்களை அறிய நாங்கள் ஆவலுடன் உள்ளோம். தயவுசெய்து கீழே உள்ள படிவத்தை நிரப்பவும் அல்லது வழங்கப்பட்ட தொடர்பு விவரங்களைப் பயன்படுத்தி எங்களை அணுகவும்.',
      'govt_school_initiative': 'அரசுப் பள்ளி புதுப்பித்தல் முயற்சி',
      'send_message_title': 'எங்களுக்கு ஒரு செய்தி அனுப்பவும்',
      'your_name': 'உங்கள் பெயர்',
      'your_email': 'உங்கள் மின்னஞ்சல்',
      'subject': 'தலைப்பு',
      'message': 'செய்தி',
      'send_message': 'செய்தி அனுப்பவும்'
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