# 🚀 Aspire - Quick Start Guide

## Get Up and Running in 3 Minutes

### 1. Start the Development Server

```bash
npm install
npm run dev
```

Open your browser to: **http://localhost:3001**

---

### 2. Login as a Parent

You'll be redirected to the login page automatically.

**Use these credentials:**
- Email: `sarah.johnson@email.com`
- Password: `password123`

Click **"Sign In"**

---

### 3. Select a Child

You'll see the Parent Dashboard with existing children:
- Emma (Age 10)
- Lucas (Age 8)
- Mia (Age 11)

**Click on any child card**, then click **"Login as [Name]"**

---

### 4. Explore Child Features

You're now on the child's homepage! Try these:

**📚 Learn & Earn**
- Click the blue "Learn & Earn" button
- Browse learning modules
- Click on any module to see details

**💼 My Portfolio**
- Click the yellow "My Portfolio" button
- View investments and performance
- See portfolio breakdown

**🏅 Achievements**
- Click the red "Achievements" button
- View unlocked and locked badges
- Track progress

**🏆 Leaderboard**
- Scroll down on the home page
- See where the child ranks
- Compare with other children

---

## Navigation Tips

### To Switch Children:
1. Click **"Exit"** in the top right
2. Login as parent again
3. Select a different child

### To Add a New Child:
1. On Parent Dashboard, click **"➕ Add Child"**
2. Enter name and age
3. Click **"Add Child"**

### Important Note:
- **Child pages** (Home, Learn, Portfolio, Achievements) only work when logged in as a child
- **Parent pages** (Dashboard) only work when logged in as a parent
- Data resets on page refresh (in-memory storage for demo)

---

## Alternative Demo Account

**Parent:** Mike Chen
- Email: `mike.chen@email.com`
- Password: `password123`
- Children: Sophia (12), Oliver (9)

---

## Features to Try

✅ View the leaderboard rankings
✅ Explore different learning modules
✅ Check investment performance
✅ View achievement progress
✅ Add a new child account
✅ Compare portfolio values
✅ See difficulty levels on lessons

---

## Common Questions

**Q: Why can't I access /home directly?**
A: You need to log in as a child first via the Parent Dashboard.

**Q: Where's my data after refresh?**
A: Data is in-memory only. Refresh = logout + data reset.

**Q: Can I create a real parent account?**
A: Yes! Click "Sign Up" on the login page. But children will start with empty portfolios.

**Q: How do I get back to parent view?**
A: Click "Exit" when logged in as a child.

---

## Tech Stack

- **TanStack Start** - Full-stack React framework
- **TanStack Router** - Type-safe routing
- **Base UI** - Accessible components
- **Tailwind CSS 4** - Utility-first styling
- **TypeScript** - Type safety

---

## Need More Help?

Check these files:
- `README.md` - Full documentation
- `FEATURES.md` - Detailed feature list
- `NAVIGATION_GUIDE.md` - Navigation troubleshooting

---

**Happy Exploring! 🎉**