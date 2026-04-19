# ALTILIYAKALATANADAM - Full Stack Web Application

This is a complete full-stack web application built for predicting horse racing outcomes.

## Technical Stack

- **Frontend:** React, React Router, Vite, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** SQLite (using `better-sqlite3`)
- **Authentication:** JWT (JSON Web Tokens) with BCrypt password hashing
- **Real-Time Updates:** Socket.io (for realtime view counts)

## Environment Setup

You need to create a `.env` file in the root directory and add the following variables. Do NOT use the default `JWT_SECRET` in a production environment as it will regenerate or fallback unsecurely.

```env
# Required for securing JWT tokens
JWT_SECRET=your_super_secret_production_key_here

# Required for the initial Admin account creation
ADMIN_EMAIL=admin@altili.com
ADMIN_PASSWORD=your_secure_password_here
```

## Running the Application

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run in Development:**
   Runs the Express server with Vite middleware loaded dynamically.
   ```bash
   npm run dev
   ```

3. **Build and Run in Production:**
   Builds the frontend and runs the server serving from `dist`.
   ```bash
   npm run build
   npm start
   ```

## Development

The database `app.db` will be created automatically upon the first run in the root directory. If you lose access, you can delete it to reset the state, and upon next reload, the database structure and the initial admin account (from `.env` variables) will be bootstrapped.
