import { Characteristic } from '../types';

export const characteristics: Characteristic[] = [
  // Being Category
  {
    id: 'ambition',
    name: 'Ambition',
    category: 'being',
    description: 'Reflects your goal-setting and motivation levels',
  },
  {
    id: 'boldness',
    name: 'Boldness',
    category: 'being',
    description: 'Measures your comfort with taking calculated risks',
  },
  {
    id: 'integrity',
    name: 'Integrity',
    category: 'being',
    description: 'Assesses your adherence to moral principles',
  },
  {
    id: 'positiveOutlook',
    name: 'Positive Outlook',
    category: 'being',
    description: 'Evaluates your optimistic perspective on life',
  },
  // Doing Category
  {
    id: 'passion',
    name: 'Dynamic Energy',
    category: 'doing',
    description: 'Evaluates your emotional drive and enthusiasm',
  },
  {
    id: 'sociability',
    name: 'Sociability',
    category: 'doing',
    description: 'Measures your comfort in social interactions',
  },
  {
    id: 'communication',
    name: 'Communication',
    category: 'doing',
    description: 'Assesses your ability to convey ideas clearly',
  },
  {
    id: 'wisdom',
    name: 'Judgment',
    category: 'doing',
    description: 'Measures your ability to apply knowledge effectively',
  },
  // Having Category
  {
    id: 'learning',
    name: 'Learning',
    category: 'having',
    description: 'Evaluates your commitment to continuous growth',
  },
  {
    id: 'creativity',
    name: 'Creativity',
    category: 'having',
    description: 'Assesses your innovative thinking abilities',
  },
  {
    id: 'flexibility',
    name: 'Adaptability',
    category: 'having',
    description: 'Measures your adaptability to change',
  },
  {
    id: 'visionaryThinking',
    name: 'Visionary Thinking',
    category: 'having',
    description: 'Evaluates your ability to see future possibilities',
  },
];