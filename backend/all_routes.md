# All API Routes

## Authentication Routes (Better-Auth) - `/api/auth/*`
- `POST /api/auth/sign-up/email` - Register new user with email/password
- `POST /api/auth/sign-in/email` - Login with email/password
- `POST /api/auth/sign-out` - Logout current session
- `GET /api/auth/session` - Get current session
- `POST /api/auth/forget-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

## User Routes - `/api/users/*`
- `GET /api/users/me` - Get current user profile (Authenticated)
  - Returns: User object with portfolio and recent transactions
- `GET /api/users/children` - Get list of children (Parent only, Authenticated)
  - Returns: Array of child user objects
- `POST /api/users/children` - Create a child account (Parent only, Authenticated)
  - Body: `{ email, password, name }`
  - Returns: Created child object

## Stock Routes - `/api/stocks/*`
- `GET /api/stocks` - Get all active stocks
  - Query params: `?active=false` for inactive stocks
- `GET /api/stocks/:ticker` - Get stock by ticker symbol
- `GET /api/stocks/:ticker/history` - Get 24-hour price history
- `POST /api/stocks` - Create a new stock (Admin only, Authenticated)
  - Body: `{ ticker, name, sector, price, volatility, description? }`
- `PUT /api/stocks/:ticker` - Update a stock (Admin only, Authenticated)
  - Body: `{ name?, sector?, price?, volatility?, description? }`
- `DELETE /api/stocks/:ticker` - Delete a stock (Admin only, Authenticated)

## Trade Routes - `/api/trades/*`
- `POST /api/trades` - Execute a trade (Buy/Sell) (Authenticated)
  - Body: `{ ticker, type: "BUY" | "SELL", quantity }`
  - Returns: Transaction object

## AI Routes - `/api/ai/*`
- `GET /api/ai/coach` - Get AI coaching advice (Authenticated)
  - Returns: `{ advice: string }`

## Admin Routes - `/api/admin/*` (Admin only, Authenticated)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get system statistics

## Internal Routes - `/api/internal/*`
- `GET /api/internal/market-data` - Get market data (Internal use)
- `POST /api/internal/events/create` - Create market event (Internal use)

## Root
- `GET /` - Health check
  - Returns: `{ status: "Aspire Backend Online 🐱" }`

## Authentication
All routes marked as "Authenticated" require a valid Better-Auth session cookie.
The session is automatically managed via cookies set by Better-Auth.

## Role-Based Access
- **ADMIN**: Full access to all routes, can manage stocks and users
- **PARENT**: Can create and manage child accounts, trade stocks
- **CHILD**: Can trade stocks, view own portfolio

