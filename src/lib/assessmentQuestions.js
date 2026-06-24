export const ASSESSMENT_QUESTIONS = [
  {
    id: 'q1',
    category: 'Communication',
    type: 'multiple-choice',
    question: 'How do you prefer to communicate complex ideas to a non-technical audience?',
    options: [
      { id: 'a', label: 'Use analogies and simple language' },
      { id: 'b', label: 'Provide detailed technical documentation' },
      { id: 'c', label: 'Use visual aids and diagrams' },
      { id: 'd', label: 'Avoid technical topics with non-technical people' },
    ],
  },
  {
    id: 'q2',
    category: 'Problem Solving',
    type: 'multiple-choice',
    question: 'When faced with a difficult problem you have never encountered before, what is your first step?',
    options: [
      { id: 'a', label: 'Research and gather information about the problem' },
      { id: 'b', label: 'Immediately try different solutions until one works' },
      { id: 'c', label: 'Ask a colleague for help right away' },
      { id: 'd', label: 'Escalate it to management' },
    ],
  },
  {
    id: 'q3',
    category: 'Technical Knowledge',
    type: 'multiple-choice',
    question: 'Which statement best describes your approach to learning new technologies?',
    options: [
      { id: 'a', label: 'I proactively learn new tools and frameworks' },
      { id: 'b', label: 'I learn only what is required for my current role' },
      { id: 'c', label: 'I prefer to stick with technologies I already know' },
      { id: 'd', label: 'I rely on my team to introduce new technologies' },
    ],
  },
  {
    id: 'q4',
    category: 'Teamwork',
    type: 'multiple-choice',
    question: 'When a team member is struggling with their work, what do you typically do?',
    options: [
      { id: 'a', label: 'Offer help while ensuring my own tasks are completed' },
      { id: 'b', label: 'Focus on my own work to meet my deadlines' },
      { id: 'c', label: 'Report to the manager immediately' },
      { id: 'd', label: 'Take over their work to fix it faster' },
    ],
  },
  {
    id: 'q5',
    category: 'Leadership',
    type: 'multiple-choice',
    question: 'How do you handle situations where you disagree with a team decision?',
    options: [
      { id: 'a', label: 'Voice my opinion respectfully, then commit to the team decision' },
      { id: 'b', label: 'Stay silent and go along with whatever is decided' },
      { id: 'c', label: 'Refuse to participate until my view is heard' },
      { id: 'd', label: 'Work on my own approach in parallel' },
    ],
  },
  {
    id: 'q6',
    category: 'English Language',
    type: 'textarea',
    question:
      'Please write a brief paragraph (3–5 sentences) describing your greatest professional achievement and what you learned from it.',
  },
];
