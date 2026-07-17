'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'tv_lang';

// Keyed by the exact English source string. Add an entry here for every
// user-facing string in the app; t() falls back to the English string
// itself when a key is missing, so coverage can be extended incrementally
// without ever breaking the UI.
export const AR_DICT = {
  // ── Nav / Footer ──────────────────────────────────────────────
  'Trusted by HR teams across Iraq': 'موثوق من قبل فرق الموارد البشرية بالعراق',
  'Settings': 'الإعدادات',
  'Close': 'إغلاق',
  'Home': 'الرئيسية',
  'Upload CV': 'رفع السيرة الذاتية',
  'CV Builder': 'منشئ السيرة الذاتية',
  'Assessment': 'التقييم',
  'Dashboard': 'لوحة التحكم',
  'About': 'من نحن',
  'All rights reserved.': 'جميع الحقوق محفوظة.',

  // ── Home ──────────────────────────────────────────────────────
  'GOT TALENT': 'عندها مواهب',
  'Upload your CV and prepare it for matching, filtering, and future recruitment workflows.': 'ارفع سيرتك الذاتية وجهّزها للمطابقة والفرز وعمليات التوظيف المستقبلية.',
  'Create a structured professional CV using guided sections for experience, education, and skills.': 'أنشئ سيرة ذاتية احترافية منظّمة باستخدام أقسام موجّهة للخبرة والتعليم والمهارات.',
  'Test practical skills with short assessments that can help validate your readiness.': 'اختبر مهاراتك العملية من خلال تقييمات قصيرة تساعد في إثبات جاهزيتك.',
  'One place to show what you can do. Start with ': 'مكان واحد لإظهار قدراتك. ابدأ بـ ',
  'our CV Builder': 'منشئ السيرة الذاتية',
  'a Skill Assessment': 'تقييم المهارات',
  'a CV Upload': 'رفع سيرتك الذاتية',
  'Start Assessment': 'بدء التقييم',
  'Candidates placed': 'مرشح تم توظيفه',
  'Skill categories tracked': 'فئات مهارات متابَعة',
  'Assessment completion rate': 'نسبة إتمام التقييم',
  'match': 'توافق',
  'Built my CV in minutes and landed 3 interviews the same week.': 'بنيت سيرتي الذاتية خلال دقائق وحصلت على 3 مقابلات بنفس الأسبوع.',
  'Uploaded my old CV and the skill report was spot on.': 'رفعت سيرتي القديمة وكان تقرير المهارات دقيقاً جداً.',
  'The guided builder made my experience look so much more professional.': 'المنشئ الموجّه خلّى خبرتي تبين احترافية أكثر بكثير.',
  'The assessment results helped me negotiate a better offer.': 'نتائج التقييم ساعدتني أفاوض على عرض أفضل.',
  'Clean CV, fast process, got noticed right away.': 'سيرة ذاتية أنيقة، إجراء سريع، ولفتت الأنظار فوراً.',
  'From upload to offer letter in two weeks flat.': 'من الرفع إلى خطاب القبول خلال أسبوعين فقط.',
  'Loved how simple the whole flow was, start to finish.': 'أحببت مدى بساطة العملية كاملة من البداية للنهاية.',
  'Frontend Developer': 'مطوّر واجهات أمامية',
  'Data Analyst': 'محلل بيانات',
  'Product Designer': 'مصمم منتج',
  'Backend Engineer': 'مهندس خلفية',
  'Marketing Specialist': 'أخصائي تسويق',
  'DevOps Engineer': 'مهندس DevOps',
  'UX Researcher': 'باحث تجربة مستخدم',

  // ── Terms & Conditions ──────────────────────────────────────────
  'Terms & Conditions': 'الشروط والأحكام',
  'Please read these terms before submitting your information.': 'يرجى قراءة هذه الشروط قبل إرسال بياناتك.',
  'Use of the Platform': 'استخدام المنصة',
  'THE VALUE provides CV building, CV upload, and skill assessment tools free of charge to candidates. By using the platform you agree to provide accurate, truthful information about yourself.':
    'توفر THE VALUE أدوات بناء السيرة الذاتية ورفعها وتقييم المهارات مجاناً للمتقدمين. باستخدامك المنصة فإنك توافق على تقديم معلومات دقيقة وصحيحة عن نفسك.',
  'Your Data': 'بياناتك',
  'Information you submit — your CV, assessment answers, and contact details — is stored to build your candidate profile and, where you opt in, shared with partner recruiter teams for hiring purposes only.':
    'يتم تخزين المعلومات التي تقدمها — سيرتك الذاتية وإجابات التقييم وبيانات التواصل — لبناء ملفك كمرشح، وتتم مشاركتها مع فرق التوظيف الشريكة لأغراض التوظيف فقط في حال موافقتك.',
  'Consent & Communication': 'الموافقة والتواصل',
  'By accepting these terms you consent to THE VALUE and its partner organizations contacting you regarding relevant job opportunities based on the information you provide.':
    'بقبولك هذه الشروط، فإنك توافق على تواصل THE VALUE والمؤسسات الشريكة معك بخصوص فرص العمل المناسبة بناءً على المعلومات التي تقدمها.',
  'Accuracy of Information': 'دقة المعلومات',
  'You are responsible for the accuracy of the CV content, certifications, and experience you submit. Misrepresenting qualifications may result in your profile being removed from consideration.':
    'أنت مسؤول عن دقة محتوى سيرتك الذاتية والشهادات والخبرات التي تقدمها. تقديم معلومات غير صحيحة عن مؤهلاتك قد يؤدي إلى استبعاد ملفك من الاعتبار.',
  'Changes': 'التعديلات',
  'These terms may be updated from time to time. Continued use of the platform after changes are posted constitutes acceptance of the revised terms.':
    'قد يتم تحديث هذه الشروط من وقت لآخر. استمرارك باستخدام المنصة بعد نشر أي تعديلات يُعد قبولاً بالشروط المحدّثة.',

  // ── About ─────────────────────────────────────────────────────
  'About THE VALUE': 'من نحن — THE VALUE',
  'A private for-profit organization that delivers business solutions for individuals, corporations, and government — enhancing the quality of business results.':
    'مؤسسة خاصة ربحية تقدّم حلولاً للأعمال للأفراد والشركات والجهات الحكومية — لتعزيز جودة نتائج الأعمال.',
  'Who We Are': 'من نحن',
  'The Value is a private for-profit organization that delivers business solutions for individuals, corporations, and government.':
    'ذا فاليو مؤسسة خاصة ربحية تقدّم حلولاً للأعمال للأفراد والشركات والجهات الحكومية.',
  'Mission': 'الرسالة',
  'To deliver standardized and customized business solutions to enhance the quality of business results.':
    'تقديم حلول أعمال موحّدة ومخصّصة لتعزيز جودة نتائج الأعمال.',
  'Vision': 'الرؤية',
  'To add value to our clients through our business solutions.': 'إضافة قيمة حقيقية لعملائنا من خلال حلولنا للأعمال.',
  'About the Founder': 'عن المؤسس',
  'Founder of The Value': 'مؤسس ذا فاليو',
  'The Founder of The Value and an experienced HR and business leader based in Baghdad with over 20 years of experience. He holds an MBA and international HR certifications including SPHRi and PHRi. His background includes senior HR leadership roles across banking, telecom, automotive, and corporate organizations, with strong experience in HR strategy, organizational development, talent acquisition, learning and development, performance management, policies, grading structures, and HR process automation.':
    'مؤسس ذا فاليو وقائد أعمال وموارد بشرية بخبرة تتجاوز 20 عاماً مقره بغداد. حاصل على ماجستير إدارة الأعمال وشهادات دولية في الموارد البشرية منها SPHRi وPHRi. تقلّد أدواراً قيادية عليا في الموارد البشرية ضمن قطاعات المصارف والاتصالات والسيارات والشركات، بخبرة قوية في استراتيجية الموارد البشرية والتطوير المؤسسي واستقطاب المواهب والتعلّم والتطوير وإدارة الأداء والسياسات وهياكل التصنيف الوظيفي وأتمتة عمليات الموارد البشرية.',
  'Areas of Expertise': 'مجالات الخبرة',
  'HR Strategy': 'استراتيجية الموارد البشرية',
  'Organizational Development': 'التطوير المؤسسي',
  'Talent Acquisition': 'استقطاب المواهب',
  'Learning & Development': 'التعلّم والتطوير',
  'Performance Management': 'إدارة الأداء',
  'Policies & Grading': 'السياسات والتصنيف الوظيفي',
  'HR Process Automation': 'أتمتة عمليات الموارد البشرية',
  'Business Leadership': 'القيادة الإدارية',
  'Baghdad, Iraq': 'بغداد، العراق',
  'Ready to showcase your talent?': 'جاهز لعرض موهبتك؟',
  'Join candidates who have already built their profile with THE VALUE.': 'انضم إلى المرشحين الذين بنوا ملفهم الشخصي مع THE VALUE.',
  'Get Started': 'ابدأ الآن',

  // ── Upload CV ─────────────────────────────────────────────────
  'Upload Your CV': 'ارفع سيرتك الذاتية',
  "Upload your CV in PDF format and we'll extract your information automatically.":
    'ارفع سيرتك الذاتية بصيغة PDF وسنقوم باستخراج بياناتك تلقائياً.',
  "Upload your CV and we'll take care of the rest.": 'ارفع سيرتك الذاتية وسنتكفّل بالباقي.',
  "Your CV has been uploaded! We're extracting your information in the background.":
    'تم رفع سيرتك الذاتية! نقوم باستخراج بياناتك في الخلفية.',
  'Completing the skill assessment gives employers a clearer picture of your abilities and significantly increases your chances of receiving job offers.':
    'إكمال تقييم المهارات يعطي أصحاب العمل صورة أوضح عن قدراتك ويزيد بشكل كبير من فرصك بالحصول على عروض عمل.',
  'Processing…': 'جارٍ المعالجة…',
  'Upload & Go to Assessment': 'الرفع والانتقال للتقييم',
  'Try CV Builder': 'جرّب منشئ السيرة الذاتية',
  'Full Name': 'الاسم الكامل',
  'Email Address': 'البريد الإلكتروني',
  'Phone Number': 'رقم الهاتف',
  'Location': 'الموقع',
  'Your full name': 'اسمك الكامل',
  'City, Country': 'المدينة، الدولة',
  'Save & Go to Assessment': 'حفظ والانتقال للتقييم',
  'Re-upload': 'إعادة الرفع',

  // ── Consent checkboxes (Upload CV + CV Builder) ────────────────
  'I accept the': 'أوافق على',
  'terms & conditions': 'الشروط والأحكام',
  "Show my CV to my organization's recruiter team.": 'أظهر سيرتي الذاتية لفريق التوظيف في مؤسستي.',

  // ── File uploader ─────────────────────────────────────────────
  'Invalid file type. Only PDF, DOCX, JPG, JPEG, and PNG are accepted.':
    'نوع الملف غير مدعوم. يُقبل فقط PDF وDOCX وJPG وJPEG وPNG.',
  'File size exceeds 5 MB limit.': 'حجم الملف يتجاوز الحد الأقصى 5 ميجابايت.',
  'Drop your CV here or': 'أفلت سيرتك الذاتية هنا أو',
  'browse': 'تصفّح',
  'PDF, DOCX, JPG, JPEG, PNG supported · Max 5 MB': 'صيغ PDF وDOCX وJPG وJPEG وPNG مدعومة · الحد الأقصى 5 ميجابايت',
  'Uploading…': 'جارٍ الرفع…',
  'Upload successful!': 'تم الرفع بنجاح!',
  'Upload a different file': 'رفع ملف آخر',
  'Upload failed': 'فشل الرفع',
  'Try again': 'إعادة المحاولة',
  'Accepted formats: PDF, DOCX, JPG, JPEG, PNG': 'الصيغ المقبولة: PDF, DOCX, JPG, JPEG, PNG',
  'Maximum file size: 5 MB': 'الحد الأقصى لحجم الملف: 5 ميجابايت',

  // ── Google Sign-In gate ─────────────────────────────────────────
  'Sign in to continue': 'سجّل الدخول للمتابعة',
  'Welcome — sign in to get started': 'أهلاً بك — سجّل الدخول للبدء',
  'Sign in with Google to use THE VALUE — upload your CV, take assessments, and track your ranking.':
    'سجّل الدخول عبر Google لاستخدام THE VALUE — ارفع سيرتك الذاتية، أكمل التقييمات، وتابع ترتيبك.',
  'Skip sign-in': 'تخطي تسجيل الدخول',
  'Sign out': 'تسجيل الخروج',
  'Signing in…': 'جارٍ تسجيل الدخول…',
  'Sign-in failed — the backend rejected the request. Check the browser console for details.':
    'فشل تسجيل الدخول — الخادم رفض الطلب. راجع الكونسول لمعرفة التفاصيل.',

  // ── CV Builder shell ──────────────────────────────────────────
  'Personal': 'البيانات الشخصية',
  'Education & Certifications': 'التعليم والشهادات',
  'Experience & Projects': 'الخبرة والمشاريع',
  'Skills & Languages': 'المهارات واللغات',
  'Full name is required.': 'الاسم الكامل مطلوب.',
  'Email address is required.': 'البريد الإلكتروني مطلوب.',
  'Please enter a valid email address.': 'يرجى إدخال بريد إلكتروني صالح.',
  'Phone number is required.': 'رقم الهاتف مطلوب.',
  'Please enter a valid phone number.': 'يرجى إدخال رقم هاتف صالح.',
  'Institution name is required for each education entry.': 'اسم المؤسسة التعليمية مطلوب لكل سجل تعليمي.',
  'Degree is required for each education entry.': 'الدرجة العلمية مطلوبة لكل سجل تعليمي.',
  'Company name is required for each experience entry.': 'اسم الشركة مطلوب لكل سجل خبرة.',
  'Position / Title is required for each experience entry.': 'المنصب / المسمى الوظيفي مطلوب لكل سجل خبرة.',
  "Fill in each section and we'll generate a professional CV.": 'أكمل كل قسم وسنقوم بإنشاء سيرة ذاتية احترافية.',
  'CV saved successfully!': 'تم حفظ السيرة الذاتية بنجاح!',
  'Your CV data has been saved. You can now take the assessment or come back later.':
    'تم حفظ بيانات سيرتك الذاتية. يمكنك الآن إجراء التقييم أو العودة لاحقاً.',
  'Your CV Preview': 'معاينة سيرتك الذاتية',
  'Generating…': 'جارٍ الإنشاء…',
  'Download PDF': 'تحميل PDF',
  'Edit CV': 'تعديل السيرة الذاتية',
  'Back': 'رجوع',
  'Continue': 'متابعة',
  'Save CV': 'حفظ السيرة الذاتية',
  'Step': 'خطوة',
  'of': 'من',
  'Live Preview': 'معاينة مباشرة',

  // ── Education / Institution autocomplete ───────────────────────
  'Type to search institutions…': 'اكتب للبحث عن مؤسسة تعليمية…',

  // ── Work Experience ──────────────────────────────────────────────
  'Select company…': 'اختر الشركة…',
  'Type the company name': 'اكتب اسم الشركة',
  'Repository / Project Link (optional)': 'رابط المستودع / المشروع (اختياري)',
  'Key Achievements & Responsibilities': 'أبرز الإنجازات والمهام',

  // ── Date picker ───────────────────────────────────────────────────
  'Select…': 'اختر…',

  // ── Certifications ────────────────────────────────────────────────
  'Category': 'الفئة',
  'Select category…': 'اختر الفئة…',
  'Technical': 'تقنية',
  'Business': 'أعمال',
  'Health & Safety': 'الصحة والسلامة',
  'Other': 'أخرى',
  'Year Obtained': 'سنة الحصول عليها',
  'Expiry Year (optional)': 'سنة الانتهاء (اختياري)',
  'No expiry': 'لا تنتهي',
  'Expired': 'منتهية',
  'Expiring this year': 'تنتهي هذا العام',
  'Valid': 'سارية',
  'expired': 'منتهية',
  'valid until': 'سارية حتى',

  // ── Projects / Technologies ────────────────────────────────────────
  'Select a technology…': 'اختر تقنية…',
  'Type technology name': 'اكتب اسم التقنية',

  // ── Skills / Languages dropdowns ───────────────────────────────────
  'Select a skill…': 'اختر مهارة…',
  'Custom Skill': 'مهارة مخصصة',
  'Select a language…': 'اختر لغة…',
  'Custom Language': 'لغة مخصصة',

  // ── Personal Info step ────────────────────────────────────────
  'Personal Information': 'البيانات الشخصية',
  'Tell us the basics — this will appear at the top of your CV.': 'أدخل البيانات الأساسية — ستظهر أعلى سيرتك الذاتية.',
  'e.g. Alex Johnson': 'مثال: أحمد محمد',
  'alex@example.com': 'ahmed@example.com',
  'Required to start the assessment later': 'مطلوب لبدء التقييم لاحقاً',
  'Country': 'الدولة',
  'Code': 'المفتاح',
  'digits': 'أرقام',
  '770 123 4567': '770 123 4567',

  // ── Education step ────────────────────────────────────────────
  'Education': 'التعليم',
  'Add your academic background, starting with the most recent.': 'أضف مسيرتك الأكاديمية، ابتداءً من الأحدث.',
  'Institution': 'المؤسسة التعليمية',
  'Select institution…': 'اختر المؤسسة التعليمية…',
  'Degree': 'الدرجة العلمية',
  'Select degree…': 'اختر الدرجة العلمية…',
  'Field of Study': 'التخصص',
  'Select field of study…': 'اختر التخصص…',
  'Type your institution': 'اكتب اسم المؤسسة التعليمية',
  'Type your degree': 'اكتب الدرجة العلمية',
  'Type your field of study': 'اكتب التخصص',
  'Start Date': 'تاريخ البدء',
  'End Date': 'تاريخ الانتهاء',
  'No education added yet. Click below to add one.': 'لا يوجد تعليم مضاف بعد. اضغط بالأسفل لإضافة سجل.',
  'Add Education': 'إضافة تعليم',
  'Other (type your own)': 'أخرى (اكتب بنفسك)',

  // ── Work Experience step ──────────────────────────────────────
  'Work Experience': 'الخبرة العملية',
  'List your professional experience, most recent first.': 'أضف خبرتك المهنية، ابتداءً من الأحدث.',
  'Company': 'الشركة',
  'Company name': 'اسم الشركة',
  'Position / Title': 'المنصب / المسمى الوظيفي',
  'Select position…': 'اختر المنصب…',
  'Type your position / title': 'اكتب المنصب / المسمى الوظيفي',
  'MM/YYYY': 'شهر/سنة',
  'I currently work here': 'أعمل هنا حالياً',
  'Description': 'الوصف',
  'Describe your responsibilities and achievements…': 'صف مهامك وإنجازاتك…',
  'No experience added yet.': 'لا توجد خبرة مضافة بعد.',
  'Add Experience': 'إضافة خبرة',
  'Position': 'منصب',

  // ── Skills step ───────────────────────────────────────────────
  'Skills': 'المهارات',
  'Add your technical and soft skills.': 'أضف مهاراتك التقنية والشخصية.',
  'Skill Name': 'اسم المهارة',
  'e.g. Leadership': 'مثال: القيادة',
  'Level': 'المستوى',
  'Add': 'إضافة',
  'No skills added yet.': 'لا توجد مهارات مضافة بعد.',
  'Beginner': 'مبتدئ',
  'Intermediate': 'متوسط',
  'Advanced': 'متقدم',
  'Expert': 'خبير',

  // ── Languages step ────────────────────────────────────────────
  'Languages': 'اللغات',
  'List languages you speak and your proficiency level.': 'أضف اللغات التي تتحدثها ومستوى إتقانك لكل منها.',
  'Language': 'اللغة',
  'e.g. Italian': 'مثال: الإيطالية',
  'Proficiency': 'مستوى الإتقان',
  'No languages added yet.': 'لا توجد لغات مضافة بعد.',
  'Basic': 'أساسي',
  'Conversational': 'محادثة',
  'Fluent': 'طلاقة',
  'Native': 'لغة أم',

  // ── Certifications step ───────────────────────────────────────
  'Certifications': 'الشهادات',
  'Add any relevant certifications or licences you hold.': 'أضف أي شهادات أو تراخيص ذات صلة تحملها.',
  'Certificate Name': 'اسم الشهادة',
  'e.g. AWS Solutions Architect': 'مثال: AWS Solutions Architect',
  'Year': 'السنة',
  'Issuing Organisation': 'الجهة المانحة',
  'e.g. Amazon Web Services': 'مثال: Amazon Web Services',
  'No certifications added yet.': 'لا توجد شهادات مضافة بعد.',
  'Add Certification': 'إضافة شهادة',
  'Certification': 'شهادة',

  // ── Projects step ─────────────────────────────────────────────
  'Projects': 'المشاريع',
  'Showcase personal or professional projects that demonstrate your skills.': 'اعرض مشاريع شخصية أو مهنية تُظهر مهاراتك.',
  'Project Name': 'اسم المشروع',
  'e.g. E-commerce Dashboard': 'مثال: لوحة تحكم متجر إلكتروني',
  'Technologies Used': 'التقنيات المستخدمة',
  'e.g. React, Node.js, PostgreSQL': 'مثال: React، Node.js، PostgreSQL',
  'Project URL (optional)': 'رابط المشروع (اختياري)',
  'https://github.com/...': 'https://github.com/...',
  'What does the project do? What was your role?': 'ما وظيفة المشروع؟ وما كان دورك فيه؟',
  'No projects added yet.': 'لا توجد مشاريع مضافة بعد.',
  'Add Project': 'إضافة مشروع',
  'Project': 'مشروع',

  // ── CV Preview ────────────────────────────────────────────────
  'Your Name': 'اسمك',
  'Experience': 'الخبرة',
  'Technical Skills': 'المهارات التقنية',
  'Present': 'حتى الآن',
  'Generated By THE VALUE': 'أُنشئت بواسطة THE VALUE',

  // ── Assessment ────────────────────────────────────────────────
  'Skill Assessment': 'تقييم المهارات',
  'This optional assessment evaluates your key professional skills.': 'هذا التقييم الاختياري يقيّم مهاراتك المهنية الأساسية.',
  'Candidates who complete this assessment stand out to employers and get matched with job opportunities faster. It only takes about 10 minutes — a small step that can make a big difference in how quickly you land your next role.':
    'المرشحون الذين يكملون هذا التقييم يبرزون أمام أصحاب العمل ويتم ترشيحهم لفرص العمل بشكل أسرع. يستغرق الأمر حوالي 10 دقائق فقط — خطوة صغيرة قد تُحدث فرقاً كبيراً في سرعة حصولك على وظيفتك القادمة.',
  'Phone number found': 'تم العثور على رقم الهاتف',
  'ready to start!': 'جاهز للبدء!',
  'Your Phone Number': 'رقم هاتفك',
  'Required to identify your results in the dashboard.': 'مطلوب لتحديد نتائجك في لوحة التحكم.',
  'questions': 'أسئلة',
  '~10 minutes': '~10 دقائق',
  'Phone number is required to start the assessment.': 'رقم الهاتف مطلوب لبدء التقييم.',
  'Please answer this question before moving on.': 'يرجى الإجابة على هذا السؤال قبل المتابعة.',
  'Please answer all questions before submitting. Missing:': 'يرجى الإجابة على جميع الأسئلة قبل الإرسال. الأسئلة الناقصة:',
  'Assessment Submitted!': 'تم إرسال التقييم!',
  'Thank you': 'شكراً لك',
  'Your responses have been saved. Head to your dashboard to see your personalised skills report.':
    'تم حفظ إجاباتك. توجّه إلى لوحة التحكم لمشاهدة تقرير مهاراتك الشخصي.',
  'View My Dashboard': 'عرض لوحة التحكم',
  'Retake Assessment': 'إعادة التقييم',
  'Question': 'سؤال',
  'complete': 'مكتمل',
  'Next': 'التالي',
  'Submit Assessment': 'إرسال التقييم',
  'Write your answer here… (minimum 20 words recommended)': 'اكتب إجابتك هنا… (يُفضّل 20 كلمة على الأقل)',

  // ── Dashboard ─────────────────────────────────────────────────
  'Loading your dashboard…': 'جارٍ تحميل لوحة التحكم…',
  'Showing sample dashboard': 'عرض لوحة تحكم توضيحية',
  'Complete the assessment to see your personalised skill results.': 'أكمل التقييم لمشاهدة نتائج مهاراتك الشخصية.',
  'Take Assessment': 'إجراء التقييم',
  'Skills Dashboard': 'لوحة المهارات',
  'Your personal skill assessment results': 'نتائج تقييم مهاراتك الشخصية',
  'Candidate': 'مرشح',
  'Overall Score': 'الدرجة الإجمالية',
  'Developing': 'قيد التطور',
  'Proficient': 'كفؤ',
  'Skill Breakdown': 'تفصيل المهارات',
  'Your Strengths': 'نقاط قوتك',
  'Complete the assessment to see your strengths.': 'أكمل التقييم لمشاهدة نقاط قوتك.',
  'Areas for Improvement': 'مجالات التحسين',
  'All skill areas are strong — great work!': 'جميع مجالات المهارات قوية — عمل رائع!',
  'Top Performing Skills': 'أفضل المهارات أداءً',
  'Overall Assessment Summary': 'ملخص التقييم العام',
  'Communication': 'التواصل',
  'Problem Solving': 'حل المشكلات',
  'Technical Knowledge': 'المعرفة التقنية',
  'Leadership': 'القيادة',
  'English Language': 'اللغة الإنجليزية',
  'Teamwork': 'العمل الجماعي',

  // ── Countries ─────────────────────────────────────────────────
  'Iraq': 'العراق',
  'Saudi Arabia': 'السعودية',
  'United Arab Emirates': 'الإمارات العربية المتحدة',
  'Jordan': 'الأردن',
  'Egypt': 'مصر',
  'Turkey': 'تركيا',
  'United States': 'الولايات المتحدة',
  'United Kingdom': 'المملكة المتحدة',
  'Germany': 'ألمانيا',
  'India': 'الهند',

  // ── Cities ────────────────────────────────────────────────────
  'Baghdad': 'بغداد',
  'Basra': 'البصرة',
  'Erbil': 'أربيل',
  'Riyadh': 'الرياض',
  'Jeddah': 'جدة',
  'Dammam': 'الدمام',
  'Dubai': 'دبي',
  'Abu Dhabi': 'أبوظبي',
  'Sharjah': 'الشارقة',
  'Amman': 'عمّان',
  'Zarqa': 'الزرقاء',
  'Irbid': 'إربد',
  'Cairo': 'القاهرة',
  'Alexandria': 'الإسكندرية',
  'Giza': 'الجيزة',
  'Istanbul': 'إسطنبول',
  'Ankara': 'أنقرة',
  'Izmir': 'إزمير',
  'New York': 'نيويورك',
  'Los Angeles': 'لوس أنجلوس',
  'Chicago': 'شيكاغو',
  'London': 'لندن',
  'Manchester': 'مانشستر',
  'Birmingham': 'برمنغهام',
  'Berlin': 'برلين',
  'Munich': 'ميونخ',
  'Hamburg': 'هامبورغ',
  'Mumbai': 'مومباي',
  'Delhi': 'دلهي',
  'Bangalore': 'بنغالورو',

  // ── Universities ──────────────────────────────────────────────
  'University of Baghdad': 'جامعة بغداد',
  'University of Jordan': 'الجامعة الأردنية',
  'American University of Beirut': 'الجامعة الأمريكية في بيروت',
  'Cairo University': 'جامعة القاهرة',
  'King Saud University': 'جامعة الملك سعود',
  'Istanbul University': 'جامعة إسطنبول',
  'Harvard University': 'جامعة هارفارد',
  'Massachusetts Institute of Technology': 'معهد ماساتشوستس للتقنية',
  'Stanford University': 'جامعة ستانفورد',
  'University of Oxford': 'جامعة أكسفورد',
  'University of Cambridge': 'جامعة كامبريدج',

  // ── Degrees ───────────────────────────────────────────────────
  'High School Diploma': 'شهادة الثانوية العامة',
  'Associate Degree': 'دبلوم متوسط',
  "Bachelor's Degree": 'شهادة البكالوريوس',
  "Master's Degree": 'شهادة الماجستير',
  'MBA': 'ماجستير إدارة الأعمال (MBA)',
  'PhD / Doctorate': 'شهادة الدكتوراه',
  'Professional Certificate': 'شهادة مهنية',

  // ── Fields of Study ───────────────────────────────────────────
  'Computer Science': 'علوم الحاسوب',
  'Information Technology': 'تقنية المعلومات',
  'Business Administration': 'إدارة الأعمال',
  'Engineering': 'الهندسة',
  'Medicine': 'الطب',
  'Law': 'القانون',
  'Economics': 'الاقتصاد',
  'Marketing': 'التسويق',
  'Graphic Design': 'التصميم الجرافيكي',
  'Data Science': 'علم البيانات',

  // ── Job Titles ────────────────────────────────────────────────
  'Software Engineer': 'مهندس برمجيات',
  'Backend Developer': 'مطوّر خلفية',
  'Full Stack Developer': 'مطوّر متكامل',
  'Data Scientist': 'عالم بيانات',
  'Product Manager': 'مدير منتج',
  'UX/UI Designer': 'مصمم تجربة وواجهة مستخدم',
  'Sales Representative': 'مندوب مبيعات',
  'Project Manager': 'مدير مشروع',
  'Customer Support Specialist': 'أخصائي دعم عملاء',
  'Accountant': 'محاسب',
  'HR Specialist': 'أخصائي موارد بشرية',
  'Business Analyst': 'محلل أعمال',

  // ── Assessment questions ──────────────────────────────────────
  'How do you prefer to communicate complex ideas to a non-technical audience?':
    'كيف تفضّل توصيل الأفكار المعقّدة لجمهور غير تقني؟',
  'Use analogies and simple language': 'استخدام تشبيهات ولغة بسيطة',
  'Provide detailed technical documentation': 'تقديم توثيق تقني مفصّل',
  'Use visual aids and diagrams': 'استخدام وسائل بصرية ومخططات',
  'Avoid technical topics with non-technical people': 'تجنّب المواضيع التقنية مع غير المختصين',

  'When faced with a difficult problem you have never encountered before, what is your first step?':
    'عند مواجهة مشكلة صعبة لم تواجهها من قبل، ما هي أول خطوة تقوم بها؟',
  'Research and gather information about the problem': 'البحث وجمع المعلومات حول المشكلة',
  'Immediately try different solutions until one works': 'تجربة حلول مختلفة فوراً حتى ينجح أحدها',
  'Ask a colleague for help right away': 'طلب المساعدة من زميل فوراً',
  'Escalate it to management': 'تصعيد الأمر إلى الإدارة',

  'Which statement best describes your approach to learning new technologies?':
    'أي عبارة تصف بشكل أفضل أسلوبك في تعلّم التقنيات الجديدة؟',
  'I proactively learn new tools and frameworks': 'أتعلّم الأدوات والأطر الجديدة بشكل استباقي',
  'I learn only what is required for my current role': 'أتعلّم فقط ما يتطلبه دوري الحالي',
  'I prefer to stick with technologies I already know': 'أفضّل الاستمرار بالتقنيات التي أعرفها',
  'I rely on my team to introduce new technologies': 'أعتمد على فريقي لتقديم التقنيات الجديدة',

  'When a team member is struggling with their work, what do you typically do?':
    'عندما يواجه أحد زملاء الفريق صعوبة في عمله، ماذا تفعل عادة؟',
  'Offer help while ensuring my own tasks are completed': 'تقديم المساعدة مع ضمان إنجاز مهامي',
  'Focus on my own work to meet my deadlines': 'التركيز على عملي لإنجاز مواعيدي النهائية',
  'Report to the manager immediately': 'إبلاغ المدير فوراً',
  'Take over their work to fix it faster': 'تولّي عملهم لإنجازه بشكل أسرع',

  'How do you handle situations where you disagree with a team decision?':
    'كيف تتعامل مع المواقف التي تختلف فيها مع قرار الفريق؟',
  'Voice my opinion respectfully, then commit to the team decision': 'إبداء رأيي باحترام، ثم الالتزام بقرار الفريق',
  'Stay silent and go along with whatever is decided': 'الصمت والموافقة على ما يتقرر',
  'Refuse to participate until my view is heard': 'رفض المشاركة حتى يُسمع رأيي',
  'Work on my own approach in parallel': 'العمل على أسلوبي الخاص بشكل موازٍ',

  'Please write a brief paragraph (3–5 sentences) describing your greatest professional achievement and what you learned from it.':
    'يرجى كتابة فقرة موجزة (3-5 جمل) تصف أعظم إنجاز مهني حققته وما تعلمته منه.',
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved === 'ar' || saved === 'en') setLang(saved);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  function toggle() {
    setLang((l) => (l === 'en' ? 'ar' : 'en'));
  }

  function t(text) {
    if (lang === 'ar' && AR_DICT[text]) return AR_DICT[text];
    return text;
  }

  return (
    <LanguageContext.Provider value={{ lang, dir: lang === 'ar' ? 'rtl' : 'ltr', toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
