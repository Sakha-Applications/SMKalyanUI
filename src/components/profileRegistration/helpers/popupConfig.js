// src/components/profileRegistration/helpers/popupConfig.js

import Popup1_BasicInfo from '../Popup1_BasicInfo';
import Popup2_ContactAndLocation from '../Popup2_ContactAndLocation';
import Popup3_PersonalDetails from '../Popup3_PersonalDetails';
import Popup4_CareerEducation from '../Popup4_CareerEducation';
import Popup5_UploadPhotos from '../Popup5_UploadPhotos';
import Popup6_FamilyDetails from '../Popup6_FamilyDetails';        // ✅ fixed line
import Popup7_HoroscopeDetails from '../Popup6A_HoroscopeDetails'; // ✅ renamed for clarity
import Popup7_ContactAddress from '../Popup7_ContactAddress';
import Popup8_References from '../Popup8_References';
import Popup9_PartnerPreferences from '../Popup9_PartnerPreferences';
import Popup10_ProfileSummary from '../Popup10_ProfileSummary';

export const popups = [
  { name: 'Basic Info', component: Popup1_BasicInfo },
  { name: 'Contact & Location', component: Popup2_ContactAndLocation },
  { name: 'Personal Details', component: Popup3_PersonalDetails },
  { name: 'Career & Education', component: Popup4_CareerEducation },
  { name: 'Upload Photos', component: Popup5_UploadPhotos },
  { name: 'Family Details', component: Popup6_FamilyDetails },     // ✅ fixed step
  { name: 'Horoscope Details', component: Popup7_HoroscopeDetails },
  { name: 'Contact Address', component: Popup7_ContactAddress },
  { name: 'References', component: Popup8_References },
  { name: 'Partner Preferences', component: Popup9_PartnerPreferences },
  { name: 'Summary & Completion', component: Popup10_ProfileSummary }
];
