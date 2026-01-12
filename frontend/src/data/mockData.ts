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
  type: "stock" | "bond" | "crypto" | "savings";
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
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  icon: string;
  completed: boolean;
  points: number;
}

// Caribbean ECSE Data - Parents from various Caribbean islands
export const parents: Parent[] = [
  {
    id: "p1",
    email: "marissa.thomas@ecse.jm",
    password: "password123",
    name: "Marissa Thomas",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "p2",
    email: "carlos.ramirez@ecse.tt",
    password: "password123",
    name: "Carlos Ramirez",
    createdAt: "2024-02-20T14:30:00Z",
  },
  {
    id: "p3",
    email: "keisha.baptiste@ecse.bb",
    password: "password123",
    name: "Keisha Baptiste",
    createdAt: "2024-01-10T09:00:00Z",
  },
  {
    id: "p4",
    email: "andre.williams@ecse.gd",
    password: "password123",
    name: "Andre Williams",
    createdAt: "2024-03-05T11:30:00Z",
  },
];

// Caribbean ECSE Children with culturally relevant names
export const children: Child[] = [
  {
    id: "c1",
    parentId: "p1",
    name: "Jayla",
    age: 7,
    avatar: "👧🏾",
    points: 2450,
    level: 5,
    portfolioValue: 1250.75,
    createdAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "c2",
    parentId: "p1",
    name: "Malik",
    age: 6,
    avatar: "👦🏾",
    points: 1830,
    level: 4,
    portfolioValue: 890.5,
    createdAt: "2024-01-16T10:05:00Z",
  },
  {
    id: "c3",
    parentId: "p2",
    name: "Aria",
    age: 8,
    avatar: "👧🏽",
    points: 3120,
    level: 7,
    portfolioValue: 2150.25,
    createdAt: "2024-02-21T09:00:00Z",
  },
  {
    id: "c4",
    parentId: "p2",
    name: "Diego",
    age: 7,
    avatar: "👦🏽",
    points: 2280,
    level: 5,
    portfolioValue: 1580.0,
    createdAt: "2024-02-21T09:05:00Z",
  },
  {
    id: "c5",
    parentId: "p3",
    name: "Zara",
    age: 6,
    avatar: "👧🏾",
    points: 2890,
    level: 6,
    portfolioValue: 1890.3,
    createdAt: "2024-03-10T11:00:00Z",
  },
  {
    id: "c6",
    parentId: "p3",
    name: "Jayden",
    age: 8,
    avatar: "👦🏾",
    points: 2650,
    level: 6,
    portfolioValue: 1720.5,
    createdAt: "2024-03-10T11:05:00Z",
  },
  {
    id: "c7",
    parentId: "p4",
    name: "Amara",
    age: 7,
    avatar: "👧🏿",
    points: 2100,
    level: 5,
    portfolioValue: 1320.0,
    createdAt: "2024-03-06T10:00:00Z",
  },
  {
    id: "c8",
    parentId: "p4",
    name: "Isaiah",
    age: 6,
    avatar: "👦🏿",
    points: 1950,
    level: 4,
    portfolioValue: 1150.75,
    createdAt: "2024-03-06T10:05:00Z",
  },
];

export const leaderboard: LeaderboardEntry[] = [
  {
    id: "l1",
    childId: "c3",
    name: "Aria",
    avatar: "👧🏽",
    points: 3120,
    level: 7,
    rank: 1,
  },
  {
    id: "l2",
    childId: "c5",
    name: "Zara",
    avatar: "👧🏾",
    points: 2890,
    level: 6,
    rank: 2,
  },
  {
    id: "l3",
    childId: "c6",
    name: "Jayden",
    avatar: "👦🏾",
    points: 2650,
    level: 6,
    rank: 3,
  },
  {
    id: "l4",
    childId: "c1",
    name: "Jayla",
    avatar: "👧🏾",
    points: 2450,
    level: 5,
    rank: 4,
  },
  {
    id: "l5",
    childId: "c4",
    name: "Diego",
    avatar: "👦🏽",
    points: 2280,
    level: 5,
    rank: 5,
  },
  {
    id: "l6",
    childId: "c7",
    name: "Amara",
    avatar: "👧🏿",
    points: 2100,
    level: 5,
    rank: 6,
  },
  {
    id: "l7",
    childId: "c8",
    name: "Isaiah",
    avatar: "👦🏿",
    points: 1950,
    level: 4,
    rank: 7,
  },
  {
    id: "l8",
    childId: "c2",
    name: "Malik",
    avatar: "👦🏾",
    points: 1830,
    level: 4,
    rank: 8,
  },
];

// Investments themed around Caribbean financial literacy
export const investments: Investment[] = [
  {
    id: "i1",
    childId: "c1",
    name: "Grace Kennedy Stock",
    type: "stock",
    value: 450.25,
    change: 12.5,
    changePercent: 2.85,
    icon: "🏪",
  },
  {
    id: "i2",
    childId: "c1",
    name: "Education Savings Bond",
    type: "bond",
    value: 300.0,
    change: 5.0,
    changePercent: 1.69,
    icon: "📚",
  },
  {
    id: "i3",
    childId: "c1",
    name: "School Fund",
    type: "savings",
    value: 500.5,
    change: 8.25,
    changePercent: 1.67,
    icon: "🎓",
  },
  {
    id: "i4",
    childId: "c3",
    name: "Caribbean Airlines Stock",
    type: "stock",
    value: 850.75,
    change: -15.25,
    changePercent: -1.76,
    icon: "✈️",
  },
  {
    id: "i5",
    childId: "c3",
    name: "Government Savings Bond",
    type: "bond",
    value: 650.0,
    change: 10.0,
    changePercent: 1.56,
    icon: "🏛️",
  },
  {
    id: "i6",
    childId: "c3",
    name: "Future Fund",
    type: "savings",
    value: 649.5,
    change: 4.5,
    changePercent: 0.7,
    icon: "💰",
  },
  {
    id: "i7",
    childId: "c5",
    name: "Sagicor Stock",
    type: "stock",
    value: 725.3,
    change: 18.75,
    changePercent: 2.65,
    icon: "🏢",
  },
  {
    id: "i8",
    childId: "c5",
    name: "Junior Saver Bond",
    type: "bond",
    value: 565.0,
    change: 7.5,
    changePercent: 1.35,
    icon: "📜",
  },
  {
    id: "i9",
    childId: "c5",
    name: "Holiday Savings",
    type: "savings",
    value: 600.0,
    change: 10.0,
    changePercent: 1.69,
    icon: "🌴",
  },
];

// Achievements with Caribbean cultural context
export const achievements: Achievement[] = [
  {
    id: "a1",
    name: "First Steps",
    description: "Complete your first financial lesson",
    icon: "🎯",
    unlocked: true,
    unlockedAt: "2024-01-17T10:00:00Z",
  },
  {
    id: "a2",
    name: "Savings Champion",
    description: "Save EC$100 in your portfolio",
    icon: "⭐",
    unlocked: true,
    unlockedAt: "2024-01-25T14:30:00Z",
  },
  {
    id: "a3",
    name: "Island Investor",
    description: "Learn about Caribbean stock markets",
    icon: "🏝️",
    unlocked: true,
    unlockedAt: "2024-02-10T09:15:00Z",
  },
  {
    id: "a4",
    name: "Quiz Master",
    description: "Score 100% on any financial quiz",
    icon: "🏆",
    unlocked: true,
    unlockedAt: "2024-02-20T16:45:00Z",
  },
  {
    id: "a5",
    name: "Diversification Pro",
    description: "Hold 3 different types of investments",
    icon: "💼",
    unlocked: false,
  },
  {
    id: "a6",
    name: "Future Millionaire",
    description: "Reach a portfolio value of EC$5000",
    icon: "💎",
    unlocked: false,
  },
  {
    id: "a7",
    name: "Caribbean Financial Scholar",
    description: "Complete all beginner modules",
    icon: "📖",
    unlocked: false,
  },
  {
    id: "a8",
    name: "Community Helper",
    description: "Learn about giving back to your community",
    icon: "🤝",
    unlocked: false,
  },
];

// Learning modules with Caribbean ECSE context
export const learningModules: LearningModule[] = [
  {
    id: "lm1",
    title: "What is Money?",
    description:
      "Learn about Caribbean dollars and how money works in our islands",
    difficulty: "beginner",
    duration: "10 min",
    icon: "💵",
    completed: true,
    points: 100,
  },
  {
    id: "lm2",
    title: "Saving vs Spending",
    description: "Understand why saving is important for your future",
    difficulty: "beginner",
    duration: "15 min",
    icon: "🏦",
    completed: true,
    points: 150,
  },
  {
    id: "lm3",
    title: "Caribbean Stock Markets",
    description: "What are stocks and how do they work in the Caribbean?",
    difficulty: "intermediate",
    duration: "20 min",
    icon: "📈",
    completed: true,
    points: 200,
  },
  {
    id: "lm4",
    title: "Understanding Risk",
    description: "Learn about investment risks and making smart choices",
    difficulty: "intermediate",
    duration: "25 min",
    icon: "⚖️",
    completed: false,
    points: 250,
  },
  {
    id: "lm5",
    title: "Building Your Portfolio",
    description: "How to create a balanced investment plan",
    difficulty: "advanced",
    duration: "30 min",
    icon: "📊",
    completed: false,
    points: 300,
  },
  {
    id: "lm6",
    title: "Compound Interest Magic",
    description: "See how your money can grow over time",
    difficulty: "intermediate",
    duration: "20 min",
    icon: "✨",
    completed: false,
    points: 200,
  },
  {
    id: "lm7",
    title: "Island Entrepreneurs",
    description: "Learn about successful Caribbean business owners",
    difficulty: "beginner",
    duration: "15 min",
    icon: "🌺",
    completed: false,
    points: 150,
  },
  {
    id: "lm8",
    title: "Giving Back",
    description: "Understanding charity and community support",
    difficulty: "beginner",
    duration: "12 min",
    icon: "❤️",
    completed: false,
    points: 125,
  },
  {
    id: "lm9",
    title: "Credit Union Basics",
    description: "How credit unions help Caribbean families save and invest",
    difficulty: "intermediate",
    duration: "18 min",
    icon: "🏘️",
    completed: false,
    points: 180,
  },
  {
    id: "lm10",
    title: "Tourism & Economics",
    description: "Understanding how tourism impacts our Caribbean economy",
    difficulty: "intermediate",
    duration: "22 min",
    icon: "🏖️",
    completed: false,
    points: 220,
  },
];

export function getParentByEmail(email: string): Parent | undefined {
  return parents.find((p) => p.email === email);
}

export function getChildrenByParentId(parentId: string): Child[] {
  return children.filter((c) => c.parentId === parentId);
}

export function getInvestmentsByChildId(childId: string): Investment[] {
  return investments.filter((i) => i.childId === childId);
}

export function getCurrentChild(): Child {
  return children[0];
}
