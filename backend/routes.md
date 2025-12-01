# API Routes

## Authentication (Better-Auth)
- `POST /api/auth/sign-up` - Register a new user
- `POST /api/auth/sign-in` - Login user
- `POST /api/auth/sign-out` - Logout user
- `GET /api/auth/session` - Get current session
- `POST /api/auth/forget-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

## User Routes (`/api/users`)
- `GET /api/users/me` - Get current user profile (Authenticated)
- `GET /api/users/children` - Get list of children (Parent only)
- `POST /api/users/children` - Create a child account (Parent only)

## Stock Routes (`/api/stocks`)
- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/:ticker` - Get stock by ticker
- `GET /api/stocks/:ticker/history` - Get 24-hour price history
- `POST /api/stocks` - Create a new stock (Admin only)
- `PUT /api/stocks/:ticker` - Update a stock (Admin only)
- `DELETE /api/stocks/:ticker` - Delete a stock (Admin only)

## Trade Routes (`/api/trades`)
- `POST /api/trades` - Execute a trade (Buy/Sell) (Authenticated)

## AI Routes (`/api/ai`)
- `GET /api/ai/coach` - Get AI coaching advice (Authenticated)

## Admin Routes (`/api/admin`)
- `GET /api/admin/users` - Get all users (Admin only)
- `GET /api/admin/users/:id` - Get user by ID (Admin only)
- `PUT /api/admin/users/:id` - Update user (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)
- `GET /api/admin/stats` - Get admin statistics (Admin only)

## Internal Routes (`/api/internal`)
- `GET /api/internal/market-data` - Get market data (Internal)
- `POST /api/internal/events/create` - Create market event (Internal)

## Root
- `GET /` - Health check

