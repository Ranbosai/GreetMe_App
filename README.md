# GreetMe - Social Media Platform

A modern, full-stack social media application built with Next.js 15+ and Express.js, featuring user registration, email verification, and secure authentication.

## 🚀 Features

- **User Registration** with form validation and math captcha
- **Email Verification** system with secure token-based verification
- **Secure Authentication** using bcrypt password hashing
- **Responsive Design** with Tailwind CSS and modern UI components
- **Real-time API** with Express.js backend
- **TypeScript** for type-safe development
- **Production-ready** architecture with scalable database design

## 🛠 Tech Stack

### Frontend
- **Next.js 15+** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - Modern React state management

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type-safe server development
- **bcrypt** - Password hashing and security
- **CORS** - Cross-origin resource sharing
- **In-memory Database** - Development (PostgreSQL ready)

## 📁 Project Structure

```
greetme/
├── src/app/                    # Next.js App Router pages
│   ├── page.tsx               # Landing page
│   ├── layout.tsx             # Root layout
│   ├── register/page.tsx      # User registration
│   ├── login/page.tsx         # User login
│   ├── verify/page.tsx        # Email verification
│   └── home/page.tsx          # Dashboard/Home
├── backend/                   # Express.js backend
│   ├── src/
│   │   ├── index.ts          # Server entry point
│   │   ├── routes/auth.ts    # Authentication routes
│   │   ├── utils/email.ts    # Email utilities
│   │   └── db/               # Database connections
│   ├── database/schema.sql   # PostgreSQL schema
│   └── package.json          # Backend dependencies
├── .env.local                # Frontend environment variables
└── README.md                 # This file
```

## � Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd greetme
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Setup environment variables**
   
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
   ```
   
   Create `backend/.env`:
   ```env
   PORT=4000
   FRONTEND_URL=http://localhost:8000
   DATABASE_URL=your_postgresql_connection_string
   ```

### Development

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on http://localhost:4000

2. **Start the frontend server** (in a new terminal)
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:8000

## � API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/register` | User registration |
| GET | `/api/verify` | Email verification |
| POST | `/api/login` | User login |

### API Examples

**Register a new user:**
```bash
curl -X POST http://localhost:4000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "telephone": "1234567890",
    "email": "john@example.com",
    "nickname": "johndoe",
    "password": "securepassword"
  }'
```

**Verify email:**
```bash
curl -X GET "http://localhost:4000/api/verify?token=TOKEN&email=john@example.com"
```

**Login:**
```bash
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

## 🎨 User Interface

### Pages Overview

1. **Landing Page** (`/`) - Welcome page with auto-redirect to registration
2. **Registration** (`/register`) - User signup with validation and captcha
3. **Login** (`/login`) - User authentication
4. **Email Verification** (`/verify`) - Token-based email confirmation
5. **Home Dashboard** (`/home`) - Main application interface

### Key Features

- **Form Validation** - Client-side and server-side validation
- **Math Captcha** - Simple arithmetic captcha for bot protection
- **Responsive Design** - Mobile-first responsive layout
- **Error Handling** - User-friendly error messages
- **Loading States** - Visual feedback during API calls

## 🗄 Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  telephone VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **Email Verification** - Secure token-based verification
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Configured cross-origin policies
- **Unique Constraints** - Email and telephone uniqueness

## 🚀 Production Deployment

### Environment Setup

1. **Database**: Replace in-memory database with PostgreSQL
2. **Email Service**: Configure with Resend, SendGrid, or similar
3. **Environment Variables**: Set production URLs and secrets
4. **Session Management**: Implement JWT or session tokens

### Recommended Services

- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, DigitalOcean
- **Database**: PostgreSQL on Railway, Supabase, or AWS RDS
- **Email**: Resend, SendGrid, AWS SES

## 🧪 Testing

The application has been thoroughly tested:

✅ **Backend API Tests**
- Health check endpoint
- User registration with validation
- Email verification flow
- User authentication

✅ **Frontend Tests**
- Page navigation and routing
- Form validation and submission
- API integration
- Responsive design

✅ **End-to-End Tests**
- Complete user registration flow
- Email verification process
- Login and dashboard access

## 📝 Development Notes

### Current Implementation
- Uses in-memory database for development
- Email verification logs to console
- Simple math captcha for bot protection
- Basic session handling (production needs JWT)

### Production Enhancements
- PostgreSQL database integration
- Real email service integration
- Advanced captcha (reCAPTCHA)
- Session management with JWT
- Rate limiting and security headers
- Image upload and storage
- Real-time features (WebSocket)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API examples

---

**GreetMe** - Connect, Share, Discover 🌟
