# Navigation Guide for Aspire Platform

## Understanding Page Access

The Aspire platform has two types of users with different access levels:

### 1. Parent Users
- Can access: Login, Signup, Parent Dashboard
- Cannot access: Home, Learn, Portfolio, Achievements (these are for children)

### 2. Child Users
- Can access: Home, Learn, Portfolio, Achievements
- Cannot access: Parent Dashboard

## How to Navigate the Platform

### Step 1: Parent Login
1. Visit `http://localhost:3001`
2. You'll be redirected to `/login`
3. Use demo credentials:
   - Email: `sarah.johnson@email.com`
   - Password: `password123`

### Step 2: Access Parent Dashboard
1. After login, you'll be redirected to `/parent/dashboard`
2. Here you can see all your children
3. View stats: total children, combined portfolio value

### Step 3: Add Children (if needed)
1. Click "➕ Add Child" button
2. Enter child's name and age
3. Child will be created with auto-generated avatar

### Step 4: Login as a Child
1. On the Parent Dashboard, click on any child card
2. Click the "Login as [Child Name]" button
3. You'll be redirected to `/home` (child's homepage)

### Step 5: Navigate Child Pages
Once logged in as a child, you can visit:
- **Home** (`/home`) - Dashboard with leaderboard
- **Learn** (`/learn`) - Learning modules
- **Portfolio** (`/portfolio`) - Investment tracking
- **Achievements** (`/achievements`) - Badges and rewards

## Why Can't I Visit Some Pages?

### Common Issues:

**Problem:** "I can't access /home, /learn, /portfolio, or /achievements"
- **Reason:** You're logged in as a parent, not a child
- **Solution:** Go to Parent Dashboard and click "Login as [Child Name]" on a child card

**Problem:** "I can't access /parent/dashboard"
- **Reason:** You're logged in as a child, not a parent
- **Solution:** Click "Exit" and log in as a parent

**Problem:** "I keep getting redirected to /login"
- **Reason:** You're not logged in
- **Solution:** Log in with parent credentials first

## Navigation Flow Diagram

```
Start (/)
  ↓
Login (/login)
  ↓
[Login with parent credentials]
  ↓
Parent Dashboard (/parent/dashboard)
  ↓
[Click on a child card]
  ↓
Child Home (/home)
  ├── Learn (/learn)
  ├── Portfolio (/portfolio)
  └── Achievements (/achievements)
```

## Demo Data

### Parent Accounts:
1. **Sarah Johnson**
   - Email: `sarah.johnson@email.com`
   - Password: `password123`
   - Children: Emma (10), Lucas (8), Mia (11)

2. **Mike Chen**
   - Email: `mike.chen@email.com`
   - Password: `password123`
   - Children: Sophia (12), Oliver (9)

### Pre-existing Children:
- **Emma** - Level 5, 2450 points, $1,250.75 portfolio
- **Lucas** - Level 4, 1830 points, $890.50 portfolio
- **Mia** - Level 6, 2890 points, $1,890.30 portfolio
- **Sophia** - Level 7, 3120 points, $2,150.25 portfolio
- **Oliver** - Level 5, 2280 points, $1,580.00 portfolio

## Quick Access URLs

Once properly logged in:

### Parent Routes:
- `/login` - Parent login
- `/signup` - Parent signup
- `/parent/dashboard` - Manage children

### Child Routes (must be logged in as a child):
- `/home` - Child dashboard
- `/learn` - Learning modules
- `/portfolio` - Investment portfolio
- `/achievements` - Badges and achievements

## Tips

1. **Always start from the parent login** - This is the entry point
2. **Use the demo credentials** - No need to create a new account for testing
3. **Click on a child to switch context** - This sets the active child
4. **Use the "Exit" button** - Returns you to parent login
5. **The navigation bar shows who's logged in** - Look for the avatar and name

## Troubleshooting

### Issue: Page is blank or redirecting
- Check if you're logged in with the correct user type
- Parent pages need parent login
- Child pages need child login (via parent dashboard)

### Issue: Can't see any children on parent dashboard
- You might be using a newly created account
- Click "Add Child" to create one
- Or use the demo accounts which have pre-existing children

### Issue: Changes don't persist after refresh
- This is expected - the app uses in-memory storage
- All data resets when you refresh the page
- This is a demo/prototype feature

## Authentication Flow

```
1. Parent logs in → AuthContext stores parent data
2. Parent clicks child card → AuthContext stores currentChild data
3. Child pages check for currentChild → Allow access
4. Parent pages check for parent → Allow access
```

## Security Notes

- Authentication is client-side only (demo purposes)
- No data persistence (everything is in-memory)
- Refreshing the page logs you out
- This is intentional for a prototype/demo app

---

**Remember:** The key to accessing child pages is to first log in as a parent, then click on a child from the parent dashboard!