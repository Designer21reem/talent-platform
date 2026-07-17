// Scoring for the Personal Style Inventory (see assessmentQuestions.js).
// Source: David Merrill & Roger Reid, "Personal Styles and Effective Performance".
// Each of the 24 sets has one option per style; the style picked most often
// across all sets is the predominant style, the second-most-picked is the
// backup style — exactly the "longest bar / second-longest bar" rule from
// the source sheet's tallying instructions (page 6).
import { ASSESSMENT_QUESTIONS } from './assessmentQuestions';

export const STYLE_KEYS = ['driver', 'expressive', 'amiable', 'analytic'];

export const STYLE_INFO = {
  driver: {
    name: 'Driver',
    title: 'Task Specialist',
    nickname: 'The Doer',
    traits: [
      'Action oriented', 'Decisive', 'A problem solver', 'Direct', 'Assertive',
      'Demanding', 'A risk taker', 'Forceful', 'Adventuresome', 'Competitive',
      'Self-reliant', 'Independent', 'Determined', 'An agitator', 'Results oriented',
    ],
    highWants: ['Challenges', 'Authority', 'Power', 'Freedom from controls', 'Options'],
  },
  expressive: {
    name: 'Expressive',
    title: 'Social Recognition Specialist',
    nickname: 'The Intuitor',
    traits: [
      'Verbal', 'Motivating', 'Enthusiastic', 'Gregarious', 'Convincing',
      'Emotional', 'Impulsive', 'Generous', 'Influential', 'Charming',
      'Confident', 'Inspiring', 'Dramatic', 'Optimistic', 'Animated',
    ],
    highWants: ['Social recognition', 'Freedom from details', 'To be with people', 'Provide service', 'Group activities'],
  },
  amiable: {
    name: 'Amiable',
    title: 'Relationship Specialist',
    nickname: 'The Feeler',
    traits: [
      'Patient', 'Loyal', 'Sympathetic', 'A team person', 'Relaxed',
      'Mature', 'Organized', 'Questioning', 'Supportive', 'Stable',
      'Considerate', 'Empathetic', 'Persevering', 'Trusting', 'Congenial',
    ],
    highWants: ['Guarantees', 'Security', 'Appreciation', 'Quality control', 'Specialization'],
  },
  analytic: {
    name: 'Analytic',
    title: 'Technical Specialist',
    nickname: 'The Analyzer',
    traits: [
      'Diplomatic', 'Accurate', 'Conscientious', 'A fact finder', 'Systematic',
      'Logical', 'Conventional', 'Analytical', 'Sensitive', 'Controlled',
      'Orderly', 'Precise', 'Disciplined', 'Deliberate', 'Cautious',
    ],
    highWants: ['High standards', 'Details', 'Perfection', 'Traditional procedures'],
  },
};

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
