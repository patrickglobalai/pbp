import { HarmonicQuestion } from '../types/harmonic';

// Pre-randomized static array of all 36 harmonic questions
export const harmonicQuestions: HarmonicQuestion[] = [
  // Level 1: Apathy
  { id: 'apathy1', levelId: 1, text: 'I often feel completely disconnected from my goals and aspirations', reversed: false },
  { id: 'apathy2', levelId: 1, text: 'I find it difficult to care about the outcome of situations', reversed: false },
  { id: 'apathy3', levelId: 1, text: 'I don\'t often find myself feeling completely indifferent about important aspects of my life', reversed: true },

  // Level 2: Hopelessness
  { id: 'hopeless1', levelId: 2, text: 'I feel powerless to change my current circumstances', reversed: false },
  { id: 'hopeless2', levelId: 2, text: 'I struggle to see any possibility for improvement in my situation', reversed: false },
  { id: 'hopeless3', levelId: 2, text: 'I don\'t often believe that small actions are entirely meaningless', reversed: true },

  // Level 3: Grief
  { id: 'grief1', levelId: 3, text: 'I spend a lot of time thinking about what I\'ve lost or missed out on', reversed: false },
  { id: 'grief2', levelId: 3, text: 'I feel a deep sense of sadness when reflecting on past experiences', reversed: false },
  { id: 'grief3', levelId: 3, text: 'I don\'t often find myself completely stuck in reflection on past disappointments', reversed: true },

  // Level 4: Fear
  { id: 'fear1', levelId: 4, text: 'I often hesitate to take action due to potential negative outcomes', reversed: false },
  { id: 'fear2', levelId: 4, text: 'I spend significant time analyzing what could go wrong', reversed: false },
  { id: 'fear3', levelId: 4, text: 'I rarely feel completely incapable of handling uncertain situations', reversed: true },

  // Level 5: Passive Hostility
  { id: 'passive1', levelId: 5, text: 'I express my disagreement through subtle resistance rather than direct confrontation', reversed: false },
  { id: 'passive2', levelId: 5, text: 'I use sarcasm or indirect comments to express my dissatisfaction', reversed: false },
  { id: 'passive3', levelId: 5, text: 'I don\'t often avoid expressing my concerns in a direct manner', reversed: true },

  // Level 6: Open Anger
  { id: 'anger1', levelId: 6, text: 'I directly express my frustration when things don\'t meet my expectations', reversed: false },
  { id: 'anger2', levelId: 6, text: 'I react strongly and immediately to perceived injustices', reversed: false },
  { id: 'anger3', levelId: 6, text: 'I rarely let frustration completely control my responses in difficult situations', reversed: true },

  // Level 7: Antagonism
  { id: 'antag1', levelId: 7, text: 'I often find myself questioning or challenging others\' ideas', reversed: false },
  { id: 'antag2', levelId: 7, text: 'I tend to point out flaws in plans or proposals', reversed: false },
  { id: 'antag3', levelId: 7, text: 'I don\'t often reject opposing viewpoints outright without consideration', reversed: true },

  // Level 8: Rational Neutrality
  { id: 'neutral1', levelId: 8, text: 'I approach challenges with a calm, logical mindset', reversed: false },
  { id: 'neutral2', levelId: 8, text: 'I can maintain emotional balance while solving problems', reversed: false },
  { id: 'neutral3', levelId: 8, text: 'I rarely let emotions completely override my logical reasoning', reversed: true },

  // Level 9: Interest
  { id: 'interest1', levelId: 9, text: 'I actively seek to learn and understand new perspectives', reversed: false },
  { id: 'interest2', levelId: 9, text: 'I engage enthusiastically in conversations and discussions', reversed: false },
  { id: 'interest3', levelId: 9, text: 'I don\'t often reject unfamiliar ideas outright without consideration', reversed: true },

  // Level 10: Optimism
  { id: 'optimism1', levelId: 10, text: 'I consistently look for opportunities in challenging situations', reversed: false },
  { id: 'optimism2', levelId: 10, text: 'I maintain confidence in positive outcomes despite setbacks', reversed: false },
  { id: 'optimism3', levelId: 10, text: 'I rarely find myself completely unable to see hope when facing obstacles', reversed: true },

  // Level 11: Enthusiasm
  { id: 'enthus1', levelId: 11, text: 'I feel energized when sharing ideas and collaborating with others', reversed: false },
  { id: 'enthus2', levelId: 11, text: 'I inspire others with my passion and excitement', reversed: false },
  { id: 'enthus3', levelId: 11, text: 'I rarely lose all enthusiasm for projects I once found engaging', reversed: true },

  // Level 12: Exhilaration
  { id: 'exhil1', levelId: 12, text: 'I experience moments of pure joy and alignment in my activities', reversed: false },
  { id: 'exhil2', levelId: 12, text: 'I feel a deep sense of fulfillment and purpose', reversed: false },
  { id: 'exhil3', levelId: 12, text: 'I don\'t often feel completely unable to find joy in daily experiences', reversed: true }
];

// Verify we have exactly 36 questions
console.assert(
  harmonicQuestions.length === 36,
  `Expected 36 questions, but got ${harmonicQuestions.length}`
);

// Verify we have 3 questions for each level
const levelCounts = harmonicQuestions.reduce((acc, q) => {
  acc[q.levelId] = (acc[q.levelId] || 0) + 1;
  return acc;
}, {} as Record<number, number>);

Object.entries(levelCounts).forEach(([levelId, count]) => {
  console.assert(
    count === 3,
    `Expected 3 questions for level ${levelId}, but got ${count}`
  );
});