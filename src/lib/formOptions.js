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

export const STUDY_CATEGORIES = ['Technical', 'Business', 'Creative', 'Health', 'Other'];

export const COMPANIES = [
  // ── Global ──
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'IBM', 'Oracle', 'SAP',
  'Accenture', 'Deloitte', 'PwC', 'EY', 'KPMG', 'McKinsey & Company',
  'Samsung', 'Huawei', 'Cisco', 'Dell', 'HP', 'Intel',
  // ── Iraqi banks & finance ──
  'Al-Rafidain Bank', 'Al-Rasheed Bank', 'National Bank of Iraq', 'Trade Bank of Iraq (TBI)',
  'Bank of Baghdad', 'Ashur International Bank', 'Cihan Bank', 'International Islamic Bank of Iraq',
  'Iraq National Bank',
  // ── Iraqi telecom, aviation & other ──
  'Zain Iraq', 'Asiacell', 'Korek Telecom', 'Earthlink Telecommunication', 'Iraqi Airways',
  'DHL Iraq', 'Emaar Iraq', 'Al-Kifah Holding', 'Hutchison Ports Iraq', 'Baghdad Soft',
  'Alsalt Oil', 'Iraq Telecom', 'Ibis Baghdad', 'Al-Mansour Group',
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

export const SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'SQL',
  'AWS',
  'Azure',
  'Docker',
  'Kubernetes',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'Figma',
  'UI/UX Design',
  'Data Analysis',
  'Power BI',
  'Tableau',
  'Machine Learning',
  'Cybersecurity',
  'DevOps',
  'Project Management',
  'Agile',
  'Scrum',
  'Digital Marketing',
  'SEO',
  'Content Writing',
  'Sales',
  'Customer Service',
];

export const LANGUAGES = ['Arabic', 'English', 'Kurdish', 'French', 'Turkish', 'German', 'Spanish', 'Persian', 'Urdu', 'Chinese'];

export const TECHNOLOGIES = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js',
  'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'C#', '.NET', 'PHP', 'Laravel',
  'Ruby on Rails', 'Go', 'Rust', 'Swift', 'Kotlin', 'SQL', 'PostgreSQL', 'MySQL',
  'MongoDB', 'Redis', 'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
  'GraphQL', 'REST API', 'Tailwind CSS', 'HTML', 'CSS',
];

export const CERTIFICATION_CATEGORIES = ['Technical', 'Business', 'Language', 'Health & Safety', 'Other'];

// Best-effort typical renewal cycles for well-known certifications, used only
// to suggest an expiry year — the candidate can always override it. `null`
// means the certification does not expire once earned.
export const CERT_VALIDITY_YEARS = [
  { match: /ccna|ccnp|ccie/i, years: 3 },
  { match: /aws certified/i, years: 3 },
  { match: /\baz-\d|azure/i, years: 1 },
  { match: /\bpmp\b/i, years: 3 },
  { match: /pmi-acp/i, years: 3 },
  { match: /comptia|security\+|network\+|\ba\+/i, years: 3 },
  { match: /cissp/i, years: 3 },
  { match: /cisa|cism|isaca/i, years: 3 },
  { match: /scrum master|\bcsm\b/i, years: 2 },
  { match: /salesforce/i, years: 1 },
  { match: /itil/i, years: null },
  { match: /six sigma/i, years: null },
  { match: /\bgoogle\b/i, years: null },
];

export function suggestCertExpiryYears(name) {
  const found = CERT_VALIDITY_YEARS.find((entry) => entry.match.test(name || ''));
  return found ? found.years : undefined;
}
