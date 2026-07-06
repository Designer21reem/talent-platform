export const OTHER_VALUE = '__other__';

// phoneLength = digits expected after the dial code (national mobile number,
// no leading trunk 0), e.g. Iraq: +964 770 123 4567 -> 10 digits.
export const COUNTRIES = [
  { code: 'IQ', name: 'Iraq', dial: '+964', phoneLength: 10, cities: ['Baghdad', 'Basra', 'Erbil'] },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', phoneLength: 9, cities: ['Riyadh', 'Jeddah', 'Dammam'] },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', phoneLength: 9, cities: ['Dubai', 'Abu Dhabi', 'Sharjah'] },
  { code: 'JO', name: 'Jordan', dial: '+962', phoneLength: 9, cities: ['Amman', 'Zarqa', 'Irbid'] },
  { code: 'EG', name: 'Egypt', dial: '+20', phoneLength: 10, cities: ['Cairo', 'Alexandria', 'Giza'] },
  { code: 'TR', name: 'Turkey', dial: '+90', phoneLength: 10, cities: ['Istanbul', 'Ankara', 'Izmir'] },
  { code: 'US', name: 'United States', dial: '+1', phoneLength: 10, cities: ['New York', 'Los Angeles', 'Chicago'] },
  { code: 'GB', name: 'United Kingdom', dial: '+44', phoneLength: 10, cities: ['London', 'Manchester', 'Birmingham'] },
  { code: 'DE', name: 'Germany', dial: '+49', phoneLength: 10, cities: ['Berlin', 'Munich', 'Hamburg'] },
  { code: 'IN', name: 'India', dial: '+91', phoneLength: 10, cities: ['Mumbai', 'Delhi', 'Bangalore'] },
];

// `phone` is expected as "<dial> <digits>" (as produced by PersonalInfoStep).
// Returns true only when the digit count matches that country's phoneLength
// exactly — too short or too long both fail.
export function isValidPhoneForCountry(phone) {
  const trimmed = (phone || '').trim();
  const country = COUNTRIES.find((c) => trimmed.startsWith(c.dial));
  if (!country) return false;
  const digits = trimmed.slice(country.dial.length).replace(/\D/g, '');
  return digits.length === country.phoneLength;
}

export const UNIVERSITIES = [
  'University of Baghdad',
  'University of Jordan',
  'American University of Beirut',
  'Cairo University',
  'King Saud University',
  'Istanbul University',
  'Harvard University',
  'Massachusetts Institute of Technology',
  'Stanford University',
  'University of Oxford',
  'University of Cambridge',
];

export const DEGREES = [
  'High School Diploma',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'MBA',
  'PhD / Doctorate',
  'Professional Certificate',
];

export const FIELDS_OF_STUDY = [
  'Computer Science',
  'Information Technology',
  'Business Administration',
  'Engineering',
  'Medicine',
  'Law',
  'Economics',
  'Marketing',
  'Graphic Design',
  'Data Science',
];

export const JOB_TITLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'Product Manager',
  'UX/UI Designer',
  'Marketing Specialist',
  'Sales Representative',
  'Project Manager',
  'DevOps Engineer',
  'Customer Support Specialist',
  'Accountant',
  'HR Specialist',
  'Business Analyst',
];
