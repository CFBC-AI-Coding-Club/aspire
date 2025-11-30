export interface Parent {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

export interface Child {
  id: string;
  parentId: string;
  name: string;
  age: number;
  avatar: string;
  points: number;
  level: number;
  portfolioValue: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  id: string;
  childId: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  rank: number;
}

export interface Investment {
  id: string;
  childId: string;
  name: string;
  type: 'stock' | 'bond' | 'crypto' | 'savings';
  value: number;
  change: number;
  changePercent: number;
  icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  icon: string;
  completed: boolean;
  points: number;
}

export const parents: Parent[] = [
  {
    id: 'p1',
    email: 'sarah.johnson@email.com',
    password: 'password123',
    name: 'Sarah Johnson',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'p2',
    email: 'mike.chen@email.com',
    password: 'password123',
    name: 'Mike Chen',
    createdAt: '2024-02-20T14:30:00Z',
  },
];

export const children: Child[] = [
  {
    id: 'c1',
    parentId: 'p1',
    name: 'Emma',
    age: 10,
    avatar: '👧',
    points: 2450,
    level: 5,
    portfolioValue: 1250.75,
    createdAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'c2',
    parentId: 'p1',
    name: 'Lucas',
    age: 8,
    avatar: '👦',
    points: 1830,
    level: 4,
    portfolioValue: 890.50,
    createdAt: '2024-01-16T10:05:00Z',
  },
  {
    id: 'c3',
    parentId: 'p2',
    name: 'Sophia',
    age: 12,
    avatar: '👧',
    points: 3120,
    level: 7,
    portfolioValue: 2150.25,
    createdAt: '2024-02-21T09:00:00Z',
  },
  {
    id: 'c4',
    parentId: 'p2',
    name: 'Oliver',
    age: 9,
    avatar: '👦',
    points: 2280,
    level: 5,
    portfolioValue: 1580.00,
    createdAt: '2024-02-21T09:05:00Z',
  },
  {
    id: 'c5',
    parentId: 'p1',
    name: 'Mia',
    age: 11,
    avatar: '👧',
    points: 2890,
    level: 6,
    portfolioValue: 1890.30,
    createdAt: '2024-03-10T11:00:00Z',
  },
];

export const leaderboard: LeaderboardEntry[] = [
  {
    id: 'l1',
    childId: 'c3',
    name: 'Sophia',
    avatar: '👧',
    points: 3120,
    level: 7,
    rank: 1,
  },
  {
    id: 'l2',
    childId: 'c5',
    name: 'Mia',
    avatar: '👧',
    points: 2890,
    level: 6,
    rank: 2,
  },
  {
    id: 'l3',
    childId: 'c1',
    name: 'Emma',
    avatar: '👧',
    points: 2450,
    level: 5,
    rank: 3,
  },
  {
    id: 'l4',
    childId: 'c4',
    name: 'Oliver',
    avatar: '👦',
    points: 2280,
    level: 5,
    rank: 4,
  },
  {
    id: 'l5',
    childId: 'c2',
    name: 'Lucas',
    avatar: '👦',
    points: 1830,
    level: 4,
    rank: 5,
  },
];

export const investments: Investment[] = [
  {
    id: 'i1',
    childId: 'c1',
    name: 'Apple Stock',
    type: 'stock',
    value: 450.25,
    change: 12.50,
    changePercent: 2.85,
    icon: '🍎',
  },
  {
    id: 'i2',
    childId: 'c1',
    name: 'Savings Bond',
    type: 'bond',
    value: 300.00,
    change: 5.00,
    changePercent: 1.69,
    icon: '📜',
  },
  {
    id: 'i3',
    childId: 'c1',
    name: 'Education Savings',
    type: 'savings',
    value: 500.50,
    change: 8.25,
    changePercent: 1.67,
    icon: '🎓',
  },
  {
    id: 'i4',
    childId: 'c3',
    name: 'Tesla Stock',
    type: 'stock',
    value: 850.75,
    change: -15.25,
    changePercent: -1.76,
    icon: '⚡',
  },
  {
    id: 'i5',
    childId: 'c3',
    name: 'Government Bond',
    type: 'bond',
    value: 650.00,
    change: 10.00,
    changePercent: 1.56,
    icon: '🏛️',
  },
  {
    id: 'i6',
    childId: 'c3',
    name: 'Emergency Fund',
    type: 'savings',
    value: 649.50,
    change: 4.50,
    changePercent: 0.70,
    icon: '💰',
  },
];

export const achievements: Achievement[] = [
  {
    id: 'a1',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    unlocked: true,
    unlockedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: 'a2',
    name: 'Savings Star',
    description: 'Save $100 in your portfolio',
    icon: '⭐',
    unlocked: true,
    unlockedAt: '2024-01-25T14:30:00Z',
  },
  {
    id: 'a3',
    name: 'Investment Explorer',
    description: 'Learn about 5 different investment types',
    icon: '🔍',
    unlocked: true,
    unlockedAt: '2024-02-10T09:15:00Z',
  },
  {
    id: 'a4',
    name: 'Quiz Master',
    description: 'Score 100% on any quiz',
    icon: '🏆',
    unlocked: true,
    unlockedAt: '2024-02-20T16:45:00Z',
  },
  {
    id: 'a5',
    name: 'Diversification Pro',
    description: 'Hold 3 different types of investments',
    icon: '💼',
    unlocked: false,
  },
  {
    id: 'a6',
    name: 'Millionaire Mindset',
    description: 'Reach a portfolio value of $5000',
    icon: '💎',
    unlocked: false,
  },
];

export const learningModules: LearningModule[] = [
  {
    id: 'lm1',
    title: 'What is Money?',
    description: 'Learn the basics of money and how it works',
    difficulty: 'beginner',
    duration: '10 min',
    icon: '💵',
    completed: true,
    points: 100,
  },
  {
    id: 'lm2',
    title: 'Saving vs Spending',
    description: 'Understand the importance of saving money',
    difficulty: 'beginner',
    duration: '15 min',
    icon: '🏦',
    completed: true,
    points: 150,
  },
  {
    id: 'lm3',
    title: 'Introduction to Stocks',
    description: 'What are stocks and how do they work?',
    difficulty: 'intermediate',
    duration: '20 min',
    icon: '📈',
    completed: true,
    points: 200,
  },
  {
    id: 'lm4',
    title: 'Understanding Risk',
    description: 'Learn about investment risks and rewards',
    difficulty: 'intermediate',
    duration: '25 min',
    icon: '⚖️',
    completed: false,
    points: 250,
  },
  {
    id: 'lm5',
    title: 'Building a Portfolio',
    description: 'How to create a balanced investment portfolio',
    difficulty: 'advanced',
    duration: '30 min',
    icon: '📊',
    completed: false,
    points: 300,
  },
  {
    id: 'lm6',
    title: 'Compound Interest Magic',
    description: 'Discover how compound interest helps your money grow',
    difficulty: 'intermediate',
    duration: '20 min',
    icon: '✨',
    completed: false,
    points: 200,
  },
];

export function getParentByEmail(email: string): Parent | undefined {
  return parents.find(p => p.email === email);
}

export function getChildrenByParentId(parentId: string): Child[] {
  return children.filter(c => c.parentId === parentId);
}

export function getInvestmentsByChildId(childId: string): Investment[] {
  return investments.filter(i => i.childId === childId);
}

export function getCurrentChild(): Child {
  return children[0];
}
