// Scoring + result profiles for the Personal Style Inventory (see
// assessmentQuestions.js). Source: David Merrill & Roger Reid, "Personal
// Styles and Effective Performance". Each of the 24 sets has one option per
// style; the style picked most often across all sets is the predominant
// style, the second-most-picked is the backup style — the "longest bar /
// second-longest bar" rule from the source sheet's tallying instructions.
//
// Every display string below is an [English, Arabic] pair — render it with
// pick(pair, lang). The profile content mirrors the client's Dashboard sheet.
import { ASSESSMENT_QUESTIONS } from './assessmentQuestions';

export const STYLE_KEYS = ['driver', 'expressive', 'amiable', 'analytic'];

export function pick(pair, lang) {
  return lang === 'ar' ? pair[1] : pair[0];
}

// ── Section headings & disclaimer ────────────────────────────────────────────

export const PROFILE_TEXT = {
  disclaimerTitle: ['Assumptions About Personal Styles', 'افتراضات حول الأنماط الشخصية'],
  disclaimerLines: [
    ['This assessment depends on your candid, honest, and high-integrity choices.', 'يعتمد هذا التقييم على اختياراتك الصريحة والصادقة وعالية النزاهة.'],
    ['Check the word or phrase in each set that is most like you.', 'اختر الكلمة أو العبارة الأقرب لشخصيتك في كل مجموعة.'],
  ],
  socialStyle: ['Your social style is', 'نمطك الاجتماعي هو'],
  backupStyle: ['Backup style', 'النمط الاحتياطي'],
  description: ['Your style description', 'وصف نمطك'],
  highWants: ['Your high wants', 'أبرز احتياجاتك'],
  perceivedAs: ['Tends to be perceived as', 'يُنظر إليك عادةً على أنك'],
  growthAction: ['Growth action', 'خطوة للنمو'],
  stressReaction: ['Stress reaction', 'ردّ فعلك تحت الضغط'],
  verbal: ['Verbal behaviors', 'السلوكيات اللفظية'],
  nonVerbal: ['Non-verbal behaviors', 'السلوكيات غير اللفظية'],
  recognizedBy: ['Recognized by', 'يُعرف من خلال'],
  keyTraits: ['Key traits', 'السمات الرئيسية'],
  bestFitJobs: ['Best-fit jobs', 'الوظائف الأنسب'],
  idealRoles: ['Ideal roles', 'الأدوار المثالية'],
};

// ── Shared phrases (several styles reuse the same behaviour cues) ───────────

const FASTER = ['Faster', 'أسرع في الكلام'];
const SLOWER = ['Slower', 'أبطأ في الكلام'];
const MORE_STATEMENTS = ['More statements', 'عبارات أكثر'];
const FEWER_STATEMENTS = ['Fewer statements', 'عبارات أقل'];
const LOUDER = ['Louder', 'صوت أعلى'];
const SOFTER = ['Softer', 'صوت أهدأ'];
const MONOTONE = ['Monotone', 'نبرة صوت ثابتة'];
const INFLECTION = ['Uses vocal inflection', 'يُنوّع نبرة صوته'];
const ON_TASK = ['Focuses on task', 'يركّز على المهمة'];
const ON_PEOPLE = ['Focuses on people', 'يركّز على الناس'];
const FACTS = ['Uses facts/data', 'يستخدم الحقائق والبيانات'];
const STORIES = ['Uses opinions/stories', 'يستخدم الآراء والقصص'];

const POINTS = ['Points at others', 'يشير إلى الآخرين'];
const LEANS_FORWARD = ['Leans forward to make point', 'يميل للأمام لإيصال فكرته'];
const LEANS_BACK = ['Leans back while talking', 'يميل للخلف أثناء الحديث'];
const DIRECT_EYES = ['Direct eye contact', 'تواصل بصري مباشر'];
const INDIRECT_EYES = ['Indirect eye contact', 'تواصل بصري غير مباشر'];
const CLOSED_HANDS = ['Closed hands', 'يدان مغلقتان'];
const RELAXED_HANDS = ['Hands relaxed or cupped', 'يدان مسترخيتان أو مضمومتان'];
const OPEN_PALMS = ['Open palms', 'راحتا اليد مفتوحتان'];
const RIGID = ['Rigid posture', 'وضعية جسم متصلّبة'];
const CASUAL = ['Casual posture', 'وضعية جسم مسترخية'];
const CONTROLLED_FACE = ['Controlled facial expression', 'تعابير وجه منضبطة'];
const ANIMATED_FACE = ['Animated expression', 'تعابير وجه حيوية'];
const PRESENT = ['Present time frame', 'التركيز على الحاضر'];

// ── Style profiles ──────────────────────────────────────────────────────────

export const STYLE_INFO = {
  driver: {
    name: ['Driver', 'القائد'],
    title: ['Task Specialist', 'متخصص في المهام'],
    nickname: ['The Doer', 'المُنجِز'],
    description: [
      ['Action oriented', 'موجّه نحو العمل'], ['Decisive', 'حاسم'], ['A problem solver', 'يحل المشكلات'],
      ['Direct', 'مباشر'], ['Assertive', 'حازم'], ['Demanding', 'متطلّب'], ['A risk taker', 'مُقدِم على المخاطر'],
      ['Forceful', 'قوي الحزم'], ['Adventuresome', 'مغامر'], ['Competitive', 'تنافسي'],
      ['Self-reliant', 'معتمد على نفسه'], ['Independent', 'مستقل'], ['Determined', 'مصمّم'],
      ['An agitator', 'محرّك للأمور'], ['Results oriented', 'موجّه نحو النتائج'],
    ],
    highWants: [
      ['Challenges', 'التحديات'], ['Authority', 'السلطة'], ['Power', 'القوة والنفوذ'],
      ['Freedom from controls', 'التحرر من القيود'], ['Options', 'الخيارات'],
    ],
    perceivedAs: [
      ['Strong willed', 'قوي الإرادة'], ['Independent', 'مستقل'], ['Practical', 'عملي'],
      ['Decisive', 'حاسم'], ['Efficient', 'كفوء'],
    ],
    growthAction: ['Listening', 'الإصغاء'],
    stressReaction: ['Autocratic power', 'التسلّط'],
    verbal: [FASTER, MORE_STATEMENTS, LOUDER, MONOTONE, ON_TASK, FACTS],
    nonVerbal: [POINTS, LEANS_FORWARD, DIRECT_EYES, CLOSED_HANDS, RIGID, CONTROLLED_FACE],
    recognizedBy: [
      ['Swift reaction time', 'سرعة في ردّ الفعل'],
      ['Maximum effort to control', 'أقصى جهد للسيطرة'],
      ['Minimum concern for caution in relationships', 'أدنى اهتمام بالحذر في العلاقات'],
      PRESENT,
      ['Direct action', 'تصرّف مباشر'],
      ['Tendency to reject inaction', 'ميل لرفض الجمود'],
      ['Need for control/results/achievement', 'حاجة إلى السيطرة والنتائج والإنجاز'],
    ],
    keyTraits: [
      'Competitive, decisive, results-oriented, takes risks, assertive, fast-paced, controlling.',
      'تنافسي، حاسم، موجّه نحو النتائج، يخوض المخاطر، حازم، سريع الإيقاع، يميل إلى السيطرة.',
    ],
    bestFitJobs: [
      ['Executive / CEO / General Manager', 'مدير تنفيذي / رئيس تنفيذي / مدير عام'],
      ['Sales Manager or Business Development Director', 'مدير مبيعات أو مدير تطوير أعمال'],
      ['Entrepreneur / Business Owner', 'رائد أعمال / صاحب عمل'],
      ['Military Officer or Police/Fire Command', 'ضابط عسكري أو قيادة في الشرطة / الدفاع المدني'],
      ['Surgeon or Emergency Room Physician', 'جرّاح أو طبيب طوارئ'],
      ['Airline Pilot or Air Traffic Controller', 'طيار أو مراقب جوي'],
      ['Project Manager (high-pressure environments)', 'مدير مشاريع (بيئات عالية الضغط)'],
      ['Real Estate Developer or Investment Banker', 'مطوّر عقاري أو مصرفي استثماري'],
    ],
    idealRoles: ['Leadership, Sales Management, Entrepreneurship', 'القيادة، إدارة المبيعات، ريادة الأعمال'],
  },

  expressive: {
    name: ['Expressive', 'المعبّر'],
    title: ['Social Recognition Specialist', 'متخصص في التقدير الاجتماعي'],
    nickname: ['The Intuitor', 'الحدسي'],
    description: [
      ['Verbal', 'بليغ في الكلام'], ['Motivating', 'محفّز'], ['Enthusiastic', 'متحمّس'],
      ['Gregarious', 'اجتماعي'], ['Convincing', 'مقنِع'], ['Emotional', 'عاطفي'], ['Impulsive', 'مندفع'],
      ['Generous', 'كريم'], ['Influential', 'مؤثّر'], ['Charming', 'ساحر'], ['Confident', 'واثق'],
      ['Inspiring', 'ملهِم'], ['Dramatic', 'درامي'], ['Optimistic', 'متفائل'], ['Animated', 'حيوي'],
    ],
    highWants: [
      ['Social recognition', 'التقدير الاجتماعي'], ['Freedom from details', 'التحرر من التفاصيل'],
      ['To be with people', 'التواجد مع الناس'], ['Provide service', 'تقديم الخدمة'],
      ['Group activities', 'الأنشطة الجماعية'],
    ],
    perceivedAs: [
      ['Ambitious', 'طموح'], ['Stimulating', 'محفِّز'], ['Enthusiastic', 'متحمّس'],
      ['Dramatic', 'درامي'], ['Friendly', 'ودود'],
    ],
    growthAction: ['Checking', 'التحقّق والتدقيق'],
    stressReaction: ['Personal attack', 'الهجوم الشخصي'],
    verbal: [FASTER, MORE_STATEMENTS, LOUDER, INFLECTION, ON_PEOPLE, STORIES],
    nonVerbal: [POINTS, LEANS_FORWARD, DIRECT_EYES, OPEN_PALMS, CASUAL, ANIMATED_FACE],
    recognizedBy: [
      ['Rapid reaction time', 'ردّ فعل سريع'],
      ['Maximum effort to involve', 'أقصى جهد لإشراك الآخرين'],
      ['Minimum concern for routine', 'أدنى اهتمام بالروتين'],
      ['Future time frame', 'التركيز على المستقبل'],
      ['Impulsive action', 'تصرّف اندفاعي'],
      ['Tendency to reject isolation', 'ميل لرفض العزلة'],
      ['Need for excitement/personal approach/acceptance', 'حاجة إلى الإثارة والتعامل الشخصي والقبول'],
    ],
    keyTraits: [
      'Outgoing, enthusiastic, optimistic, talkative, persuasive, energetic, idea-driven.',
      'منفتح، متحمّس، متفائل، كثير الكلام، مقنِع، نشيط، مدفوع بالأفكار.',
    ],
    bestFitJobs: [
      ['Sales Representative or Account Executive', 'مندوب مبيعات أو مدير حسابات'],
      ['Marketing Manager or Brand Strategist', 'مدير تسويق أو استراتيجي علامة تجارية'],
      ['Public Relations / Corporate Communications', 'العلاقات العامة / الاتصال المؤسسي'],
      ['Actor, Performer, or Entertainer', 'ممثل أو مؤدٍّ أو فنان استعراضي'],
      ['Motivational Speaker or Trainer', 'متحدث تحفيزي أو مدرّب'],
      ['Real Estate Agent', 'وكيل عقارات'],
      ['Event Planner or Conference Organizer', 'منظّم فعاليات أو مؤتمرات'],
      ['Political Campaign Manager or Lobbyist', 'مدير حملات سياسية أو جماعة ضغط'],
    ],
    idealRoles: ['Sales, Marketing, Public-facing roles', 'المبيعات، التسويق، الأدوار التي تتعامل مع الجمهور'],
  },

  amiable: {
    name: ['Amiable', 'الودود'],
    title: ['Relationship Specialist', 'متخصص في العلاقات'],
    nickname: ['The Feeler', 'العاطفي'],
    description: [
      ['Patient', 'صبور'], ['Loyal', 'وفي'], ['Sympathetic', 'متعاطف'], ['A team person', 'يحب العمل الجماعي'],
      ['Relaxed', 'هادئ'], ['Mature', 'ناضج'], ['Organized', 'منظّم'], ['Questioning', 'كثير التساؤل'],
      ['Supportive', 'داعم'], ['Stable', 'مستقر'], ['Considerate', 'مراعٍ للآخرين'],
      ['Empathetic', 'متفهّم لمشاعر الآخرين'], ['Persevering', 'مثابر'], ['Trusting', 'واثق بالآخرين'],
      ['Congenial', 'لطيف المعشر'],
    ],
    highWants: [
      ['Guarantees', 'الضمانات'], ['Security', 'الأمان'], ['Appreciation', 'التقدير'],
      ['Quality control', 'ضبط الجودة'], ['Specialization', 'التخصّص'],
    ],
    perceivedAs: [
      ['Supportive', 'داعم'], ['Respectful', 'محترِم'], ['Willing', 'متعاون'],
      ['Dependable', 'يُعتمد عليه'], ['Agreeable', 'متوافق'],
    ],
    growthAction: ['Initiation', 'المبادرة'],
    stressReaction: ['Compliance', 'الإذعان'],
    verbal: [SLOWER, FEWER_STATEMENTS, SOFTER, INFLECTION, ON_PEOPLE, STORIES],
    nonVerbal: [RELAXED_HANDS, LEANS_BACK, INDIRECT_EYES, OPEN_PALMS, CASUAL, ANIMATED_FACE],
    recognizedBy: [
      ['Unhurried reaction time', 'ردّ فعل متأنٍّ'],
      ['Maximum effort to relate', 'أقصى جهد لبناء العلاقات'],
      ['Minimum concern for effecting change', 'أدنى اهتمام بإحداث التغيير'],
      PRESENT,
      ['Supportive action', 'تصرّف داعم'],
      ['Tendency to reject conflict', 'ميل لرفض الصراع'],
      ['Need for cooperation/personal security/acceptance', 'حاجة إلى التعاون والأمان الشخصي والقبول'],
    ],
    keyTraits: [
      'Supportive, patient, loyal, team-oriented, cooperative, good listener, relationship-focused.',
      'داعم، صبور، وفي، يحب العمل الجماعي، متعاون، مستمع جيد، يركّز على العلاقات.',
    ],
    bestFitJobs: [
      ['Human Resources / Talent Development', 'الموارد البشرية / تطوير المواهب'],
      ['Counselor, Therapist, or Life Coach', 'مرشد أو معالج أو مدرّب حياة'],
      ['Nurse or Healthcare Patient Advocate', 'ممرض أو مناصر لحقوق المرضى'],
      ['Customer Service Manager', 'مدير خدمة العملاء'],
      ['Social Worker or Nonprofit Coordinator', 'أخصائي اجتماعي أو منسّق في منظمة غير ربحية'],
      ['Teacher or Corporate Trainer', 'معلّم أو مدرّب مؤسسي'],
      ['Team Coordinator or Office Manager', 'منسّق فريق أو مدير مكتب'],
      ['Hospitality / Hotel Management', 'الضيافة / إدارة الفنادق'],
    ],
    idealRoles: ['HR, Service, Education, Healthcare', 'الموارد البشرية، الخدمات، التعليم، الرعاية الصحية'],
  },

  analytic: {
    name: ['Analytical', 'التحليلي'],
    title: ['Technical Specialist', 'متخصص تقني'],
    nickname: ['The Analyzer', 'المحلّل'],
    description: [
      ['Diplomatic', 'دبلوماسي'], ['Accurate', 'دقيق'], ['Conscientious', 'ضميري ومسؤول'],
      ['A fact finder', 'باحث عن الحقائق'], ['Systematic', 'منهجي'], ['Logical', 'منطقي'],
      ['Conventional', 'تقليدي'], ['Analytical', 'تحليلي'], ['Sensitive', 'حسّاس'], ['Controlled', 'منضبط'],
      ['Orderly', 'مرتّب'], ['Precise', 'متقن'], ['Disciplined', 'ملتزم'], ['Deliberate', 'متأنٍّ'],
      ['Cautious', 'حذر'],
    ],
    highWants: [
      ['High standards', 'معايير عالية'], ['Details', 'التفاصيل'], ['Perfection', 'الكمال'],
      ['Traditional procedures', 'الإجراءات التقليدية'],
    ],
    perceivedAs: [
      ['Industrious', 'مجتهد'], ['Persistent', 'مثابر'], ['Serious', 'جادّ'],
      ['Exacting', 'دقيق ومتطلّب'], ['Orderly', 'مرتّب'],
    ],
    growthAction: ['Declaration', 'الإفصاح والتصريح'],
    stressReaction: ['Avoidance', 'التجنّب'],
    verbal: [SLOWER, FEWER_STATEMENTS, SOFTER, MONOTONE, ON_TASK, FACTS],
    nonVerbal: [RELAXED_HANDS, LEANS_BACK, INDIRECT_EYES, CLOSED_HANDS, RIGID, CONTROLLED_FACE],
    recognizedBy: [
      ['Slow reaction time', 'ردّ فعل بطيء'],
      ['Maximum effort to organize', 'أقصى جهد للتنظيم'],
      ['Minimum concern for relationships', 'أدنى اهتمام بالعلاقات'],
      ['Historical time frame', 'التركيز على الماضي والتجارب السابقة'],
      ['Cautious action', 'تصرّف حذر'],
      ['Tendency to reject involvement', 'ميل لرفض الانخراط'],
      ['Need for accuracy/being right/achievement', 'حاجة إلى الدقة والصواب والإنجاز'],
    ],
    keyTraits: [
      'Precise, organized, cautious, detail-oriented, logical, systematic, quality-focused.',
      'دقيق، منظّم، حذر، يهتم بالتفاصيل، منطقي، منهجي، يركّز على الجودة.',
    ],
    bestFitJobs: [
      ['Accountant or Financial Analyst', 'محاسب أو محلل مالي'],
      ['Engineer (especially Quality, Process, or Systems)', 'مهندس (خصوصاً الجودة أو العمليات أو الأنظمة)'],
      ['Data Analyst or Business Intelligence Specialist', 'محلل بيانات أو أخصائي ذكاء أعمال'],
      ['Scientist or Research Specialist', 'عالم أو أخصائي أبحاث'],
      ['IT Systems Analyst or Software Architect', 'محلل أنظمة أو مهندس معمارية برمجيات'],
      ['Lawyer (especially corporate or tax law)', 'محامٍ (خصوصاً قانون الشركات أو الضرائب)'],
      ['Auditor or Compliance Officer', 'مدقق حسابات أو مسؤول امتثال'],
      ['Actuary or Risk Analyst', 'خبير اكتواري أو محلل مخاطر'],
    ],
    idealRoles: ['Finance, Engineering, Research, Compliance', 'المالية، الهندسة، الأبحاث، الامتثال'],
  },
};

// ── Scoring ──────────────────────────────────────────────────────────────────

// answers: { [questionId]: optionId }
export function computeStyleResult(answers) {
  const counts = { driver: 0, expressive: 0, amiable: 0, analytic: 0 };

  ASSESSMENT_QUESTIONS.forEach((q) => {
    const selectedId = answers[q.id];
    if (!selectedId) return;
    const option = q.options.find((o) => o.id === selectedId);
    if (option?.style) counts[option.style] += 1;
  });

  const total = STYLE_KEYS.reduce((sum, key) => sum + counts[key], 0);
  const ranked = [...STYLE_KEYS].sort((a, b) => counts[b] - counts[a]);

  return {
    counts,
    total,
    predominant: ranked[0],
    backup: ranked[1],
    ranked,
  };
}

// ── Reading a stored result back ─────────────────────────────────────────────

const STYLE_ALIASES = {
  driver: 'driver',
  expressive: 'expressive',
  amiable: 'amiable',
  analytic: 'analytic',
  analytical: 'analytic',
};

function toStyleKey(value) {
  if (typeof value !== 'string') return null;
  const first = value.trim().toLowerCase().split(/[\s—–,:-]+/)[0];
  return STYLE_ALIASES[first] ?? null;
}

function toCounts(value) {
  if (!value || typeof value !== 'object') return null;
  const counts = {};
  for (const key of STYLE_KEYS) {
    const n = Number(value[key] ?? (key === 'analytic' ? value.analytical : undefined));
    counts[key] = Number.isFinite(n) ? n : 0;
  }
  return Object.values(counts).some((n) => n > 0) ? counts : null;
}

const PREDOMINANT_KEYS = ['predominant_style', 'predominant', 'social_style', 'style', 'result', 'personality_style'];
const BACKUP_KEYS = ['backup_style', 'backup'];
const COUNT_KEYS = ['style_counts', 'counts'];

// GET /assessment-result/{user_id} (or the local copy) may return a bare
// style string ("driver"), the object we POSTed, a wrapper around it, or a
// list of past results — this digs out { predominant, backup?, counts? }
// from any of those, preferring the most recent entry of a list.
export function extractStyleResult(data, depth = 0) {
  if (data == null || depth > 4) return null;

  const direct = toStyleKey(data);
  if (direct) return { predominant: direct, backup: null, counts: null };

  if (Array.isArray(data)) {
    for (let i = data.length - 1; i >= 0; i--) {
      const found = extractStyleResult(data[i], depth + 1);
      if (found) return found;
    }
    return null;
  }

  if (typeof data !== 'object') return null;

  for (const key of PREDOMINANT_KEYS) {
    const predominant = toStyleKey(data[key]);
    if (!predominant) continue;
    const backupKey = BACKUP_KEYS.map((k) => toStyleKey(data[k])).find(Boolean) ?? null;
    const counts = COUNT_KEYS.map((k) => toCounts(data[k])).find(Boolean) ?? null;
    return { predominant, backup: backupKey !== predominant ? backupKey : null, counts };
  }

  for (const value of Object.values(data)) {
    if (value && typeof value === 'object') {
      const found = extractStyleResult(value, depth + 1);
      if (found) return found;
    }
  }
  return null;
}
