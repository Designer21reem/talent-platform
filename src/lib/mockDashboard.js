const CATEGORY_MAX = 100;

const SCORE_MAP = {
  q1: { a: 90, b: 60, c: 85, d: 30 },
  q2: { a: 90, b: 55, c: 65, d: 40 },
  q3: { a: 95, b: 65, c: 50, d: 55 },
  q4: { a: 90, b: 45, c: 60, d: 55 },
  q5: { a: 95, b: 55, c: 35, d: 50 },
};

function scoreTextAnswer(text) {
  const words = text.trim().split(/\s+/).length;
  if (words >= 60) return 90;
  if (words >= 40) return 80;
  if (words >= 20) return 65;
  if (words >= 5) return 50;
  return 30;
}

function getScore(answer) {
  if (answer.questionId === 'q6') {
    return scoreTextAnswer(answer.answer);
  }
  return SCORE_MAP[answer.questionId]?.[answer.answer] ?? 60;
}

function classifyStrengthsAndGaps(skills) {
  const strengths = [];
  const areasForImprovement = [];

  for (const skill of skills) {
    if (skill.score >= 80) {
      strengths.push(skill.category);
    } else if (skill.score < 65) {
      areasForImprovement.push(skill.category);
    }
  }

  return { strengths, areasForImprovement };
}

function buildSummary(overall, strengths, gaps) {
  if (overall >= 85) {
    return `Excellent performance! You demonstrated strong capabilities across most skill categories${
      strengths.length ? `, particularly in ${strengths.join(' and ')}` : ''
    }. Keep building on these strengths to further advance your career.`;
  }
  if (overall >= 70) {
    return `Good overall performance. You show solid skills in several areas${
      strengths.length ? ` including ${strengths.join(' and ')}` : ''
    }${
      gaps.length
        ? `. Focusing on ${gaps.join(' and ')} will help you reach the next level.`
        : '.'
    }`;
  }
  return `You have a good foundation to build on${
    strengths.length ? `, with clear strengths in ${strengths.join(' and ')}` : ''
  }${
    gaps.length
      ? `. Investing time in ${gaps.join(' and ')} will significantly boost your profile.`
      : '.'
  }`;
}

// ─── Main Factory ─────────────────────────────────────────────────────────────

export function buildDashboard(answers, candidateName, phoneNumber) {
  console.log('[Dashboard] Building dashboard from answers:', answers);

  const categoryMap = new Map();

  for (const answer of answers) {
    const score = getScore(answer);
    const existing = categoryMap.get(answer.category) ?? [];
    categoryMap.set(answer.category, [...existing, score]);
  }

  const skills = Array.from(categoryMap.entries()).map(([category, scores]) => {
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return { category, score: Math.min(avg, CATEGORY_MAX), label: `${avg}%` };
  });

  const overallScore = Math.round(
    skills.reduce((sum, s) => sum + s.score, 0) / (skills.length || 1)
  );

  const { strengths, areasForImprovement } = classifyStrengthsAndGaps(skills);
  const overallSummary = buildSummary(overallScore, strengths, areasForImprovement);

  const dashboard = {
    candidateName,
    phoneNumber,
    skills,
    strengths,
    areasForImprovement,
    overallSummary,
    overallScore,
  };

  console.log('[Dashboard] Dashboard data built:', dashboard);
  return dashboard;
}

// ─── Static Mock Fallback ─────────────────────────────────────────────────────

export const MOCK_DASHBOARD = {
  candidateName: 'Alex Johnson',
  phoneNumber: '+1 555 000 0000',
  overallScore: 78,
  skills: [
    { category: 'Communication', score: 85, label: '85%' },
    { category: 'Problem Solving', score: 80, label: '80%' },
    { category: 'Technical Knowledge', score: 90, label: '90%' },
    { category: 'Leadership', score: 70, label: '70%' },
    { category: 'English Language', score: 75, label: '75%' },
    { category: 'Teamwork', score: 88, label: '88%' },
  ],
  strengths: ['Technical Knowledge', 'Communication', 'Teamwork'],
  areasForImprovement: ['Leadership'],
  overallSummary:
    'Strong overall profile with outstanding technical skills and excellent communication. Leadership is an area to develop through mentorship and team-lead opportunities.',
};
