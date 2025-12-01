# Complete API Routes Documentation

## Authentication Routes (Better-Auth) - `/api/auth/*`

Better-Auth handles all authentication endpoints automatically:

- `POST /api/auth/sign-up/email` - Register new user
  - Body: `{ email, password, name }`
  - Returns: `{ user: { id, email, name, ... } }`

- `POST /api/auth/sign-in/email` - Login
  - Body: `{ email, password }`
  - Returns: `{ user: {...} }` + Sets session cookie

- `POST /api/auth/sign-out` - Logout
  - Clears session cookie

- `GET /api/auth/session` - Get current session
  - Returns: `{ user: {...}, session: {...} }`

- `POST /api/auth/forget-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

## User Routes - `/api/users/*`

- `GET /api/users/me` - Get current user profile (Authenticated)
  - Returns: User object with portfolio and recent transactions

- `GET /api/users/children` - Get list of children (Parent only, Authenticated)
  - Returns: Array of child user objects with portfolio and transactions

- `POST /api/users/children` - Create a child account (Parent only, Authenticated)
  - Body: `{ email, password, name }`
  - Returns: `{ success: true, child: {...} }`
  - Note: Enforces max 5 children per parent

## Stock Routes - `/api/stocks/*`

- `GET /api/stocks` - Get all active stocks
  - Query: `?active=false` for inactive stocks
  - Returns: Array of stock objects

- `GET /api/stocks/:ticker` - Get stock by ticker
  - Returns: Stock object with price history

- `GET /api/stocks/:ticker/history` - Get 24-hour price history
  - Returns: Array of price points

- `POST /api/stocks` - Create a new stock (Admin only)
  - Body: `{ ticker, name, sector, price, volatility, description? }`
  - Returns: Created stock object

- `PUT /api/stocks/:ticker` - Update a stock (Admin only)
  - Body: `{ name?, sector?, price?, volatility?, description? }`
  - Returns: Updated stock object

- `DELETE /api/stocks/:ticker` - Delete a stock (Admin only)
  - Returns: `{ success: true }`

## Trade Routes - `/api/trades/*`

- `POST /api/trades` - Execute a trade (Authenticated)
  - Body: `{ ticker, type: "BUY" | "SELL", quantity }`
  - Returns: `{ success: true, trade: {...} }`

## AI Routes - `/api/ai/*`

- `GET /api/ai/coach` - Get AI coaching advice (Authenticated)
  - Returns: `{ advice: string }`

## Admin Routes - `/api/admin/*` (Admin only)

- `GET /api/admin/users` - Get all users
  - Query: `?page=1&limit=10` for pagination
  - Returns: `{ users: [...], pagination: {...} }`

- `GET /api/admin/users/:id` - Get user by ID
  - Returns: User object with portfolio and transactions

- `PUT /api/admin/users/:id` - Update user
  - Body: `{ name?, balance?, xp?, isActive? }`
  - Returns: Updated user object

- `DELETE /api/admin/users/:id` - Delete/deactivate user
  - Returns: `{ success: true }`

- `GET /api/admin/stats` - Get system statistics
  - Returns: `{ users: {...}, stocks: {...}, trading: {...} }`

## Internal Routes - `/api/internal/*`

- `GET /api/internal/market-data` - Get market data (Internal use)
- `POST /api/internal/events/create` - Create market event (Internal use)

## Root

- `GET /` - Health check
  - Returns: `{ status: "Aspire Backend Online 🐱" }`

## Authentication

All routes marked as "Authenticated" require a valid Better-Auth session cookie.
The session cookie is automatically set by Better-Auth on sign-in and managed via cookies.

## Role-Based Access Control

- **ADMIN**: Full access to all routes, can manage stocks and users
- **PARENT**: Can create and manage child accounts (max 5), trade stocks, view own portfolio
- **CHILD**: Can trade stocks, view own portfolio

## Notes

- Better-Auth uses cookie-based sessions (not Bearer tokens)
- Session cookies are automatically handled by the browser/client
- All Better-Auth routes are prefixed with `/api/auth`
- Custom routes maintain the `/api` prefix

