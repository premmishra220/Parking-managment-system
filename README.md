# Park Connect

Park Connect is a web-based parking management system that makes it easier to find an available parking slot, make a reservation, and keep track of bookings.

The application is divided into two separate parts:

- **Frontend** - React + Vite application used by users and administrators.
- **Backend** - Node.js + Express API responsible for authentication, parking data, bookings, payments, and MongoDB operations.

At the moment, parking is organized into three locations:

- 1st Year Building
- 2nd Year Building
- Library Building

---

## How Park Connect Works

The basic flow of the application is:

```text
User
  |
  v
React Frontend
  |
  | HTTP API requests
  v
Express Backend
  |
  +---------> MongoDB
  |
  +---------> Razorpay
  