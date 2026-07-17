// Personal Style Inventory — 24 forced-choice sets of four words/phrases.
// Source: David Merrill & Roger Reid, "Personal Styles and Effective Performance".
// Column position within each set is the scoring key: 1st option = Driver,
// 2nd = Expressive, 3rd = Amiable, 4th = Analytic (see STYLE_INVENTORY_INSTRUCTIONS
// on the source sheet: "Tally Box: 1 Driver / 2 Expressive / 3 Amiable / 4 Analytic").
// styleAssessment.js tallies these `style` tags to score the assessment.
const RAW_SETS = [
  ['Competitive', 'Joyful', 'Considerate', 'Harmonious'],
  ['Tries new ideas', 'Optimistic', 'Wants to please', 'Respectful'],
  ['Will power', 'Open-minded', 'Cheerful', 'Obliging'],
  ['Daring', 'Expressive', 'Satisfied', 'Diplomatic'],
  ['Powerful', 'Good mixer', 'Easy on others', 'Organized'],
  ['Restless', 'Popular', 'Neighborly', 'Abides by rules'],
  ['Unconquerable', 'Playful', 'Obedient', 'Fussy'],
  ['Self-reliant', 'Fun-loving', 'Patient', 'Soft-Spoken'],
  ['Bold', 'Charming', 'Loyal', 'Easily led'],
  ['Outspoken', 'Companionable', 'Restrained', 'Accurate'],
  ['Brave', 'Inspiring', 'Submissive', 'Timid'],
  ['Nervy', 'Jovial', 'Even-tempered', 'Precise'],
  ['Stubborn', 'Attractive', 'Sweet', 'Avoids'],
  ['Decisive', 'Talkative', 'Controlled', 'Conventional'],
  ['Positive', 'Trusting', 'Contented', 'Peaceful'],
  ['Takes risks', 'Warm', 'Willing to help', 'Not extreme'],
  ['Argumentative', 'Light-hearted', 'Nonchalant', 'Adaptable'],
  ['Original', 'Persuasive', 'Gentle', 'Humble'],
  ['Determined', 'Convincing', 'Good-natured', 'Cautious'],
  ['Persistent', 'Lively', 'Generous', 'Well-disciplined'],
  ['Forceful', 'Admirable', 'Kind', 'Non-resisting'],
  ['Assertive', 'Confident', 'Sympathetic', 'Tolerant'],
  ['Aggressive', 'Life-of-the-party', 'Easily fooled', 'Uncertain'],
  ['Eager', 'High-spirited', 'Willing', 'Agreeable'],
];

const STYLE_ORDER = ['driver', 'expressive', 'amiable', 'analytic'];
const OPTION_IDS = ['a', 'b', 'c', 'd'];

export const ASSESSMENT_QUESTIONS = RAW_SETS.map((words, index) => ({
  id: `q${index + 1}`,
  category: 'Personal Style',
  type: 'style-choice',
  question: 'Check the word or phrase in this set that is most like you.',
  options: words.map((label, i) => ({
    id: OPTION_IDS[i],
    label,
    style: STYLE_ORDER[i],
  })),
}));
