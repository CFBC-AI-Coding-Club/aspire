# 🚀 Aspire - Investment Learning Platform for Kids

Aspire is a modern, child-friendly web application designed to teach young people about financial investments through gamification, interactive learning modules, and portfolio management.

## ✨ Features

### For Parents
- **Parent Dashboard**: Create and manage multiple child accounts
- **Progress Tracking**: Monitor each child's learning progress and portfolio value
- **Account Management**: Add children with customized profiles

### For Children
- **Interactive Learning**: Engaging lessons about money, investing, and financial literacy
- **Portfolio Management**: Virtual investment portfolio with different asset types
- **Leaderboard**: Competitive element to motivate learning
- **Achievements System**: Unlock badges and rewards for completing milestones
- **Gamification**: Earn points and level up by completing lessons

## 🛠️ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) with [TanStack Router](https://tanstack.com/router)
- **UI Components**: [Base UI](https://base-ui.netlify.app/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: TypeScript
- **State Management**: React Context API
- **Query Management**: TanStack Query

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aspire
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
bun run dev
```

4. Open your browser and navigate to:
```
http://localhost:3001
```

## 📁 Project Structure

```
aspire/
├── src/
│   ├── components/
│   │   └── ui/           # Reusable UI components (Button, Input, Card)
│   ├── contexts/         # React Context providers (AuthContext)
│   ├── data/            # Dummy data for demo purposes
│   ├── routes/          # TanStack Router route files
│   │   ├── _auth/       # Authentication routes (login, signup)
│   │   ├── parent/      # Parent dashboard routes
│   │   ├── home.tsx     # Child home page with leaderboard
│   │   ├── learn.tsx    # Learning modules page
│   │   ├── portfolio.tsx # Portfolio management page
│   │   └── achievements.tsx # Achievements page
│   └── styles.css       # Global styles and Tailwind configuration
├── public/              # Static assets
└── package.json
```

## 🎯 Demo Accounts

For testing purposes, use these demo parent accounts:

**Parent Account 1:**
- Email: `sarah.johnson@email.com`
- Password: `password123`

**Parent Account 2:**
- Email: `mike.chen@email.com`
- Password: `password123`

## 🎨 Design Philosophy

Aspire follows a child-friendly design approach with:

- **Bright, Engaging Colors**: Blue, teal, coral, and yellow color palette
- **Large, Clear Typography**: Easy-to-read text for young users
- **Emoji Icons**: Fun and recognizable visual elements
- **Smooth Animations**: Engaging transitions and hover effects
- **Gamification Elements**: Points, levels, and achievements to motivate learning

## 📚 Key Pages

### Parent Login & Signup
Parents can create accounts and manage their children's profiles.

### Parent Dashboard
View all children, their progress, portfolio values, and add new children to the platform.

### Child Home Page
- Personal dashboard with stats
- Global leaderboard showing top performers
- Quick access to learning, portfolio, and achievements
- Recent activity and tips

### Learning Modules
- Beginner to advanced lessons
- Interactive content about money and investing
- Points and level progression
- Module completion tracking

### Portfolio Page
- View all investments
- Track portfolio performance
- Investment breakdown by type
- Progress towards goals

### Achievements Page
- Unlocked and locked achievements
- Progress tracking
- Tips for earning new achievements

## 🔧 Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run serve` - Preview production build
- `npm run format` - Format code with Biome
- `npm run lint` - Lint code with Biome
- `npm run check` - Run Biome checks

## 🌈 Color Palette

- **Primary Blue**: `#2E8BC0` - Main brand color
- **Teal**: `#2EC4B6` - Secondary accent
- **Coral**: `#FF6F61` - Attention/warning
- **Yellow**: `#FFD447` - Rewards/points
- **Light Blue**: `#E3F5FF` - Backgrounds
- **Light Gray**: `#F5F7FA` - Neutral backgrounds
- **Dark Gray**: `#1B262C` - Primary text
- **Medium Gray**: `#7D8B91` - Secondary text

## 🎓 Learning Modules

The platform includes various learning modules covering:

1. **What is Money?** - Understanding currency and value
2. **Saving vs Spending** - Financial decision-making
3. **Introduction to Stocks** - Equity investments basics
4. **Understanding Risk** - Risk-reward relationship
5. **Building a Portfolio** - Diversification strategies
6. **Compound Interest Magic** - Long-term growth concepts

## 🏆 Achievement System

Children can unlock achievements by:
- Completing learning modules
- Building their portfolio
- Reaching savings milestones
- Scoring well on quizzes
- Consistent engagement

## 🔐 Authentication

The app uses a simple context-based authentication system. In production, this should be replaced with a proper authentication service (e.g., Auth0, Clerk, Supabase Auth).

## 📱 Responsive Design

Aspire is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🚧 Future Enhancements

- Real-time investment data integration
- Parent-child messaging system
- More interactive quizzes and games
- Social features (friend leaderboards)
- Mobile app versions
- Multi-language support
- Database integration
- Real authentication system
- Email notifications

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 👨‍💻 Development Notes

- The app uses dummy data from `src/data/dummyData.ts`
- Authentication is simplified for demo purposes
- All state is managed in-memory (no persistence)
- Routes are automatically generated by TanStack Router
- Base UI components provide accessible foundations

## 🙏 Acknowledgments

- Built with [TanStack Start](https://tanstack.com/start)
- UI components from [Base UI](https://base-ui.netlify.app/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons using emoji for simplicity and fun

---

Made with ❤️ for teaching kids about financial literacy