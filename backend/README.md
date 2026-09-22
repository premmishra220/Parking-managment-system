# Park Connect - Backend

The backend provides the API layer for Park Connect. It handles authentication, parking availability, booking creation, payment order creation, payment verification, and admin reporting.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Razorpay
- dotenv

## Architecture

```text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── server.js
└── ...
```

The backend is organized into route handlers, service logic, database models, middleware, and configuration files.

- `config/` contains database and payment configuration helpers.
- `middleware/` contains authentication and error handling.
- `models/` defines the MongoDB schemas.
- `routes/` exposes the HTTP endpoints.
- `services/` contains the business logic for auth, parking, booking, and payment flows.
- `utils/` contains shared error utilities.
- `server.js` starts the Express application and registers API routes.

## Database

The application uses MongoDB with Mongoose.

The following models are defined:

- `User`
- `Booking`
- `ParkingSlot`

The database connection is configured in `backend/config/db.js` and is enabled by the `MONGO_URI` environment variable.

## Authentication

Authentication is implemented with JWT and password hashing.

- User passwords are hashed with `bcryptjs` before storage.
- Tokens are issued with `jsonwebtoken`.
- Protected routes use middleware to validate the bearer token.
- Admin routes use an authorization check for the `admin` role.

## API Endpoints

### Authentication

- `POST /api/auth/register`
  - Creates a new user account.
- `POST /api/auth/login`
  - Authenticates a user and returns a JWT.
- `GET /api/auth/me`
  - Returns the authenticated user profile.

### Parking

- `GET /api/parking/buildings`
  - Returns the configured parking buildings.
- `GET /api/parking/slots/:building`
  - Returns slot data for a selected building.

### Bookings

- `POST /api/bookings`
  - Creates a new booking for the authenticated user.
- `GET /api/bookings/my`
  - Returns the current user's bookings.
- `GET /api/bookings/:id`
  - Returns a booking by ID, with admin access allowed for admin users.
- `PUT /api/bookings/:id/cancel`
  - Cancels a booking for the user or admin.

### Payments

- `POST /api/payment/create-order`
  - Creates a Razorpay order for an existing booking.
- `POST /api/payment/verify`
  - Verifies the Razorpay signature and updates booking payment status.

### Admin

- `GET /api/admin/dashboard`
  - Returns summary stats for users, bookings, revenue, and parking availability.
- `GET /api/admin/users`
  - Returns all users.
- `GET /api/admin/bookings`
  - Returns all bookings.
- `GET /api/admin/parking`
  - Returns the current parking slot list and status.

### Health

- `GET /api/health`
  - Returns a simple server health response.

## Environment Variables

The backend requires these environment variables:

```env
MONGO_URI=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CLIENT_URL=
PORT=
```

## Running Backend

From the backend folder:

```bash
npm install
cp .env.example .env
npm start
```

You can also run the watcher with:

```bash
npm run dev
```

## Error Handling

The backend uses a central error utility and middleware to return consistent JSON responses for request failures. Validation failures and authorization failures are returned with a `success: false` payload and an error message.

## Payment

The backend creates Razorpay orders and validates payment signatures before confirming a booking. The verification step checks the generated HMAC against the Razorpay signature and updates the booking status to `confirmed` after successful validation.
