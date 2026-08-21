// Personal Style Inventory — 24 forced-choice sets of four words/phrases.
// Source: David Merrill & Roger Reid, "Personal Styles and Effective Performance".
// Column position within each set is the scoring key: 1st option = Driver,
// 2nd = Expressive, 3rd = Amiable, 4th = Analytic (see STYLE_INVENTORY_INSTRUCTIONS
// on the source sheet: "Tally Box: 1 Driver / 2 Expressive / 3 Amiable / 4 Analytic").
// styleAssessment.js tallies these `style` tags to score the assessment.
//
// Choices are shown bilingually (English + Arabic) regardless of the site's
// current language, per the brief — so every word/phrase below carries its
// own Arabic counterpart rather than going through the general t() switch.
const RAW_SETS = [
  [['Competitive', 'تنافسي'], ['Joyful', 'مرح'], ['Considerate', 'متفهّم'], ['Harmonious', 'متناغم']],
  [['Tries new ideas', 'يجرّب أفكاراً جديدة'], ['Optimistic', 'متفائل'], ['Wants to please', 'يسعى لإرضاء الآخرين'], ['Respectful', 'محترِم']],
  [['Will power', 'قوة الإرادة'], ['Open-minded', 'منفتح الفكر'], ['Cheerful', 'بشوش'], ['Obliging', 'متعاون']],
  [['Daring', 'جريء'], ['Expressive', 'معبّر'], ['Satisfied', 'قنوع'], ['Diplomatic', 'دبلوماسي']],
  [['Powerful', 'قوي التأثير'], ['Good mixer', 'اجتماعي بطبعه'], ['Easy on others', 'متسامح مع الآخرين'], ['Organized', 'منظّم']],
  [['Restless', 'لا يهدأ'], ['Popular', 'محبوب'], ['Neighborly', 'ودود'], ['Abides by rules', 'ملتزم بالقواعد']],
  [['Unconquerable', 'لا يُقهر'], ['Playful', 'مرح لعوب'], ['Obedient', 'مطيع'], ['Fussy', 'كثير التدقيق']],
  [['Self-reliant', 'معتمد على نفسه'], ['Fun-loving', 'محب للمرح'], ['Patient', 'صبور'], ['Soft-Spoken', 'هادئ الحديث']],
  [['Bold', 'جسور'], ['Charming', 'ساحر'], ['Loyal', 'وفي'], ['Easily led', 'سهل الانقياد']],
  [['Outspoken', 'صريح'], ['Companionable', 'أنيس'], ['Restrained', 'ضابط لنفسه'], ['Accurate', 'دقيق']],
  [['Brave', 'شجاع'], ['Inspiring', 'ملهِم'], ['Submissive', 'خاضع'], ['Timid', 'خجول']],
  [['Nervy', 'جريء بلا تردد'], ['Jovial', 'مرح اجتماعي'], ['Even-tempered', 'متزن المزاج'], ['Precise', 'دقيق']],
  [['Stubborn', 'عنيد'], ['Attractive', 'جذاب'], ['Sweet', 'لطيف'], ['Avoids', 'يتجنب المواجهة']],
  [['Decisive', 'حاسم'], ['Talkative', 'كثير الكلام'], ['Controlled', 'ضابط لتصرفاته'], ['Conventional', 'تقليدي']],
  [['Positive', 'إيجابي'], ['Trusting', 'واثق بالآخرين'], ['Contented', 'راضٍ'], ['Peaceful', 'مسالم']],
  [['Takes risks', 'يخوض المخاطر'], ['Warm', 'دافئ المشاعر'], ['Willing to help', 'يحب المساعدة'], ['Not extreme', 'معتدل']],
  [['Argumentative', 'جدلي'], ['Light-hearted', 'خفيف الظل'], ['Nonchalant', 'غير مبالٍ'], ['Adaptable', 'متكيّف']],
  [['Original', 'مبتكر'], ['Persuasive', 'مقنِع'], ['Gentle', 'رقيق'], ['Humble', 'متواضع']],
  [['Determined', 'مصمّم'], ['Convincing', 'مقنِع'], ['Good-natured', 'طيب الطبع'], ['Cautious', 'حذر']],
  [['Persistent', 'مثابر'], ['Lively', 'نشيط'], ['Generous', 'كريم'], ['Well-disciplined', 'منضبط']],
  [['Forceful', 'قوي الحزم'], ['Admirable', 'جدير بالإعجاب'], ['Kind', 'طيب'], ['Non-resisting', 'غير معارض']],
  [['Assertive', 'حازم'], ['Confident', 'واثق من نفسه'], ['Sympathetic', 'متعاطف'], ['Tolerant', 'متسامح']],
  [['Aggressive', 'عدواني'], ['Life-of-the-party', 'روح الحفلة'], ['Easily fooled', 'سهل الخداع'], ['Uncertain', 'متردد']],
  [['Eager', 'متحمّس'], ['High-spirited', 'عالي الحماس'], ['Willing', 'راغب بالمساعدة'], ['Agreeable', 'متوافق وودود']],
];

const STYLE_ORDER = ['driver', 'expressive', 'amiable', 'analytic'];
const OPTION_IDS = ['a', 'b', 'c', 'd'];

export const ASSESSMENT_QUESTIONS = RAW_SETS.map((words, index) => ({
  id: `q${index + 1}`,
  category: 'Personal Style',
  type: 'style-choice',
  question: 'Check the word or phrase in this set that is most like you.',
  questionAr: 'اختر الكلمة أو العبارة الأقرب لشخصيتك من هذه المجموعة.',
  options: words.map(([label, labelAr], i) => ({
    id: OPTION_IDS[i],
    label,
    labelAr,
    style: STYLE_ORDER[i],
  })),
}));
