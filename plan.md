```markdown
# Detailed Implementation Plan for GreetMe Social Media App

This plan outlines all frontend and backend changes required to build GreetMe – a social media app with registration, email verification, and login functionalities. We will use Next.js with TypeScript for the modern UI and an Express/TypeScript backend connected to a PostgreSQL database for scalable user management. Free alternatives will be used for email (a dummy email sender for now) and a simple math captcha mechanism for initial development.

---

## 1. Frontend Changes (Next.js)

### 1.1 Create New Pages in src/app/

#### a) Registration Page – `src/app/register/page.tsx`
- **UI Elements:**  
  - Input fields with labels: Name, Telephone Number, Email, Nick Name, Password (type="password"), and Captcha Code.  
  - A modern “Register” button styled with a clean layout (using CSS classes from `globals.css` or inline styles).  
  - A text link “Log In” (styled as a link) at the bottom.
- **Functionality & Error Handling:**  
  - Validate required fields client-side and show error messages for empty/invalid fields.
  - On submit, send a POST request to the backend endpoint `/api/register` (backend server URL configured via environment variables).
  - Handle server errors (e.g., duplicate telephone/email) by displaying readable error messages.
  - Generate and display a random simple math problem as the captcha. Validate the user’s answer before submission.
  
_Sample snippet:_
```typescript
const RegistrationPage = () => {
  const [formData, setFormData] = React.useState({
    name: '', telephone: '', email: '', nickname: '', password: '', captchaAnswer: ''
  });
  const [captcha, setCaptcha] = React.useState({ question: '', answer: 0 });
  const [error, setError] = React.useState('');
  
  React.useEffect(() => {
    // Generate a simple math captcha e.g., "3 + 4" = 7
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    setCaptcha({ question: `${a} + ${b}`, answer: a + b });
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(formData.captchaAnswer) !== captcha.answer) {
      setError('Incorrect captcha answer.');
      return;
    }
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Registration error.');
      } else {
        // Inform user to check their email for verification link.
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h1>Register at GreetMe</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Render input fields with proper labels */}
        {/* Example for Email */}
        <label>Email Id</label>
        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
        {/* Render remaining input fields similarly */}
        <label>Captcha: {captcha.question}</label>
        <input type="text" value={formData.captchaAnswer} onChange={e => setFormData({ ...formData, captchaAnswer: e.target.value })} required />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Log In</a>
      </p>
    </div>
  );
};

export default RegistrationPage;
```

#### b) Login Page – `src/app/login/page.tsx`
- **UI Elements:**  
  - Two input fields: “Enter your Mail Id” and “Password” (password type).  
  - A “Log In” button.
- **Functionality & Error Handling:**  
  - On submit, POST credentials to `/api/login` (backend).
  - Validate response, show error when credentials do not match.
  - On success, redirect to Home page.
  
_Sample snippet:_
```typescript
const LoginPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Login failed.');
      } else {
        window.location.href = '/home';
      }
    } catch (err) {
      setError('Network error.');
    }
  };

  return (
    <div className="container">
      <h1>Log In</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <label>Enter your Mail Id</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LoginPage;
```

#### c) Email Verification Page – `src/app/verify/page.tsx`
- **UI Elements:**  
  - A simple message: "Thank you for confirming your registration" and a link “Log In”.
- **Functionality:**  
  - Read query parameters (token and email) and send GET request to `/api/verify?token=...&email=...`.
  - Show appropriate success or error message.
  
_Sample snippet:_
```typescript
const VerifyPage = () => {
  const router = useRouter();
  const { token, email } = router.query;
  const [message, setMessage] = React.useState('Verifying...');
  
  React.useEffect(() => {
    if (token && email) {
      fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/verify?token=${token}&email=${email}`)
        .then(res => res.json())
        .then(data => setMessage(data.message || 'Verification failed.'))
        .catch(() => setMessage('Verification error.'));
    }
  }, [token, email]);
  
  return (
    <div className="container">
      <h1>{message}</h1>
      {message.includes('Thank you') && <a href="/login">Log In</a>}
    </div>
  );
};

export default VerifyPage;
```

#### d) Home Page – `src/app/home/page.tsx`
- **UI Elements:**  
  - Title “GreetMe” and a welcome message.
- **Functionality:**  
  - This is the landing page after a successful login.
  
_Sample snippet:_
```typescript
const HomePage = () => (
  <div className="container">
    <h1>GreetMe</h1>
    <p>Welcome to the social media platform.</p>
  </div>
);
export default HomePage;
```

---

## 2. Backend Changes (Express with TypeScript)

### 2.1 Create a New Folder "backend" at Project Root

#### a) Setup Basic Project Files:
- **File:** `backend/package.json`
  - Include dependencies: express, pg, bcrypt, cors, nodemailer (or a placeholder for email), typescript, ts-node-dev (for development), and @types packages.
- **File:** `backend/tsconfig.json`
  - Standard TypeScript config for Node.js projects.

#### b) Entry Point – `backend/src/index.ts`
- **Functionality:**  
  - Set up Express server with middleware (JSON body parser, CORS).
  - Mount routes from `routes/auth.ts`.
  - Global error handling middleware.
  
_Sample snippet:_
```typescript
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### c) Database Connection – `backend/src/db/db.ts`
- **Functionality:**  
  - Create a PostgreSQL connection using the `pg` package.
  - Export a pool connection.
  
_Sample snippet:_
```typescript
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/greetme'
});
export default pool;
```

#### d) User Routes & Business Logic – `backend/src/routes/auth.ts`
- **Endpoints:**  
  - **POST /api/register:**  
    Validate input, check for unique telephone/email (using SQL query with unique constraint), hash password with bcrypt, generate a verification token, insert user record, and call email utility to send a verification email.
  - **GET /api/verify:**  
    Validate token and email from query parameters, update user's `is_verified` flag.
  - **POST /api/login:**  
    Verify user credentials by comparing stored hashed password with bcrypt compare, return success/error.
- **Error Handling:**  
  - Use try-catch blocks and return appropriate HTTP codes with error messages.
  
_Sample snippet:_
```typescript
import { Router } from 'express';
import pool from '../db/db';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../utils/email';
import crypto from 'crypto';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, telephone, email, nickname, password } = req.body;
  if (!name || !telephone || !email || !nickname || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    // Check uniqueness of telephone and email
    const checkQuery = 'SELECT id FROM users WHERE telephone = $1 OR email = $2';
    const exists = await pool.query(checkQuery, [telephone, email]);
    if (exists.rowCount > 0) return res.status(400).json({ error: 'Telephone or Email already exists.' });
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    // Generate verification token
    const verification_token = crypto.randomBytes(20).toString('hex');
    
    const insertQuery = `INSERT INTO users (name, telephone, email, nickname, password_hash, is_verified, verification_token) 
                         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
    const result = await pool.query(insertQuery, [name, telephone, email, nickname, password_hash, false, verification_token]);
    
    // Send verification email (dummy implementation logs email)
    sendVerificationEmail(email, verification_token);
    
    res.status(201).json({ message: 'User registered. Please check your email for verification.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

router.get('/verify', async (req, res) => {
  const { token, email } = req.query;
  if (!token || !email) {
    return res.status(400).json({ error: 'Missing token or email.' });
  }
  try {
    const query = 'UPDATE users SET is_verified = true WHERE email = $1 AND verification_token = $2 RETURNING id';
    const result = await pool.query(query, [email, token]);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid token or email.' });
    }
    res.json({ message: 'Thank you for confirming your registration' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error: 'Email and password required.' });
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    if(result.rowCount === 0) return res.status(400).json({ error: 'Invalid credentials.' });
    
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if(!match) return res.status(400).json({ error: 'Invalid credentials.' });
    
    // Ideally generate a session token or JWT; here we'll simply return success
    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login error.' });
  }
});

export default router;
```

#### e) Email Utility – `backend/src/utils/email.ts`
- **Functionality:**  
  - For development, use a dummy function that logs the verification email and its link.
  - In production, integrate with an email service (Resend, SendGrid, etc.) using API keys.
  
_Sample snippet:_
```typescript
export const sendVerificationEmail = (to: string, token: string) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${token}&email=${to}`;
  console.log(`Send verification email to ${to}: Click this link to verify: ${verificationLink}`);
  // Future implementation: integrate with an email provider.
};
```

### 2.2 Database Schema Creation

Provide a SQL script (or instruct to run migration) to create the `users` table:
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

---

## 3. Integration & Testing

- **Environment Variables:**  
  - Frontend: Set `NEXT_PUBLIC_BACKEND_URL` in `.env.local` (e.g., http://localhost:4000).  
  - Backend: Set `DATABASE_URL` and `FRONTEND_URL` in `.env` (in the backend folder).
- **CORS:** Ensure CORS is enabled in the backend for communication with the frontend.
- **API Testing:**  
  - Use curl commands to test endpoints: registration, login, and verification.  
  - Validate error responses and proper HTTP status codes.
- **Error Handling:** All API endpoints include try-catch blocks and return user-friendly messages.

---

## Summary

• A new Next.js registration page (with captcha validation) is created in src/app/register/page.tsx along with modern UI styling.  
• Login and email verification pages are built to handle authentication and user validation.  
• A separate Express/TypeScript backend in the "backend" folder is set up to handle registration, email verification, and login endpoints, connected to a PostgreSQL database.  
• The database schema includes unique constraints on telephone and email, with secure password hashing using bcrypt.  
• Error handling and input validation are consistently implemented on both client and server.  
• Dummy email functionality logs verification links for free alternative initial development.  
• Environment variables and CORS configurations ensure smooth integration between frontend and backend.

This plan meets all requirements and lays out a clear structure for implementing a scalable and robust social media application.

---

## 4. Testing Plan for Next.js Application

### 1. Set Up Automated Testing
- Install Jest and React Testing Library:
  ```bash
  npm install --save-dev jest @testing-library/react @testing-library/jest-dom
  ```
- Create test files for each component in the `src/components/ui/` directory.
- Write tests to verify:
  - Rendering of components
  - Interaction (e.g., button clicks, form submissions)
  - Accessibility (using `@testing-library/jest-dom` for assertions)
  - Responsive behavior (using viewport testing)

### 2. Manual Testing
- Run the development server:
  ```bash
  npm run dev
  ```
- Verify the following pages:
  - Home
  - Login
  - Register
  - Verify
- Test the authentication flow:
  - Register a new user
  - Log in with the registered user
  - Verify the user account

### 3. Database Setup
- Use the memory database for testing to avoid external dependencies.

### 4. Mock External Services
- Mock any email services or external APIs used in the application.

### 5. Documentation
- Update the README or create a testing guide to document the testing process and how to run tests.

This plan outlines all frontend and backend changes required to build GreetMe – a social media app with registration, email verification, and login functionalities. We will use Next.js with TypeScript for the modern UI and an Express/TypeScript backend connected to a PostgreSQL database for scalable user management. Free alternatives will be used for email (a dummy email sender for now) and a simple math captcha mechanism for initial development.

---

## 1. Frontend Changes (Next.js)

### 1.1 Create New Pages in src/app/

#### a) Registration Page – `src/app/register/page.tsx`
- **UI Elements:**  
  - Input fields with labels: Name, Telephone Number, Email, Nick Name, Password (type="password"), and Captcha Code.  
  - A modern “Register” button styled with a clean layout (using CSS classes from `globals.css` or inline styles).  
  - A text link “Log In” (styled as a link) at the bottom.
- **Functionality & Error Handling:**  
  - Validate required fields client-side and show error messages for empty/invalid fields.
  - On submit, send a POST request to the backend endpoint `/api/register` (backend server URL configured via environment variables).
  - Handle server errors (e.g., duplicate telephone/email) by displaying readable error messages.
  - Generate and display a random simple math problem as the captcha. Validate the user’s answer before submission.
  
_Sample snippet:_
```typescript
const RegistrationPage = () => {
  const [formData, setFormData] = React.useState({
    name: '', telephone: '', email: '', nickname: '', password: '', captchaAnswer: ''
  });
  const [captcha, setCaptcha] = React.useState({ question: '', answer: 0 });
  const [error, setError] = React.useState('');
  
  React.useEffect(() => {
    // Generate a simple math captcha e.g., "3 + 4" = 7
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    setCaptcha({ question: `${a} + ${b}`, answer: a + b });
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(formData.captchaAnswer) !== captcha.answer) {
      setError('Incorrect captcha answer.');
      return;
    }
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Registration error.');
      } else {
        // Inform user to check their email for verification link.
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h1>Register at GreetMe</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Render input fields with proper labels */}
        {/* Example for Email */}
        <label>Email Id</label>
        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
        {/* Render remaining input fields similarly */}
        <label>Captcha: {captcha.question}</label>
        <input type="text" value={formData.captchaAnswer} onChange={e => setFormData({ ...formData, captchaAnswer: e.target.value })} required />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Log In</a>
      </p>
    </div>
  );
};

export default RegistrationPage;
```

#### b) Login Page – `src/app/login/page.tsx`
- **UI Elements:**  
  - Two input fields: “Enter your Mail Id” and “Password” (password type).  
  - A “Log In” button.
- **Functionality & Error Handling:**  
  - On submit, POST credentials to `/api/login` (backend).
  - Validate response, show error when credentials do not match.
  - On success, redirect to Home page.
  
_Sample snippet:_
```typescript
const LoginPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Login failed.');
      } else {
        window.location.href = '/home';
      }
    } catch (err) {
      setError('Network error.');
    }
  };

  return (
    <div className="container">
      <h1>Log In</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <label>Enter your Mail Id</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LoginPage;
```

#### c) Email Verification Page – `src/app/verify/page.tsx`
- **UI Elements:**  
  - A simple message: "Thank you for confirming your registration" and a link “Log In”.
- **Functionality:**  
  - Read query parameters (token and email) and send GET request to `/api/verify?token=...&email=...`.
  - Show appropriate success or error message.
  
_Sample snippet:_
```typescript
const VerifyPage = () => {
  const router = useRouter();
  const { token, email } = router.query;
  const [message, setMessage] = React.useState('Verifying...');
  
  React.useEffect(() => {
    if (token && email) {
      fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/verify?token=${token}&email=${email}`)
        .then(res => res.json())
        .then(data => setMessage(data.message || 'Verification failed.'))
        .catch(() => setMessage('Verification error.'));
    }
  }, [token, email]);
  
  return (
    <div className="container">
      <h1>{message}</h1>
      {message.includes('Thank you') && <a href="/login">Log In</a>}
    </div>
  );
};

export default VerifyPage;
```

#### d) Home Page – `src/app/home/page.tsx`
- **UI Elements:**  
  - Title “GreetMe” and a welcome message.
- **Functionality:**  
  - This is the landing page after a successful login.
  
_Sample snippet:_
```typescript
const HomePage = () => (
  <div className="container">
    <h1>GreetMe</h1>
    <p>Welcome to the social media platform.</p>
  </div>
);
export default HomePage;
```

---

## 2. Backend Changes (Express with TypeScript)

### 2.1 Create a New Folder "backend" at Project Root

#### a) Setup Basic Project Files:
- **File:** `backend/package.json`
  - Include dependencies: express, pg, bcrypt, cors, nodemailer (or a placeholder for email), typescript, ts-node-dev (for development), and @types packages.
- **File:** `backend/tsconfig.json`
  - Standard TypeScript config for Node.js projects.

#### b) Entry Point – `backend/src/index.ts`
- **Functionality:**  
  - Set up Express server with middleware (JSON body parser, CORS).
  - Mount routes from `routes/auth.ts`.
  - Global error handling middleware.
  
_Sample snippet:_
```typescript
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### c) Database Connection – `backend/src/db/db.ts`
- **Functionality:**  
  - Create a PostgreSQL connection using the `pg` package.
  - Export a pool connection.
  
_Sample snippet:_
```typescript
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/greetme'
});
export default pool;
```

#### d) User Routes & Business Logic – `backend/src/routes/auth.ts`
- **Endpoints:**  
  - **POST /api/register:**  
    Validate input, check for unique telephone/email (using SQL query with unique constraint), hash password with bcrypt, generate a verification token, insert user record, and call email utility to send a verification email.
  - **GET /api/verify:**  
    Validate token and email from query parameters, update user's `is_verified` flag.
  - **POST /api/login:**  
    Verify user credentials by comparing stored hashed password with bcrypt compare, return success/error.
- **Error Handling:**  
  - Use try-catch blocks and return appropriate HTTP codes with error messages.
  
_Sample snippet:_
```typescript
import { Router } from 'express';
import pool from '../db/db';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../utils/email';
import crypto from 'crypto';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, telephone, email, nickname, password } = req.body;
  if (!name || !telephone || !email || !nickname || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    // Check uniqueness of telephone and email
    const checkQuery = 'SELECT id FROM users WHERE telephone = $1 OR email = $2';
    const exists = await pool.query(checkQuery, [telephone, email]);
    if (exists.rowCount > 0) return res.status(400).json({ error: 'Telephone or Email already exists.' });
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    // Generate verification token
    const verification_token = crypto.randomBytes(20).toString('hex');
    
    const insertQuery = `INSERT INTO users (name, telephone, email, nickname, password_hash, is_verified, verification_token) 
                         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
    const result = await pool.query(insertQuery, [name, telephone, email, nickname, password_hash, false, verification_token]);
    
    // Send verification email (dummy implementation logs email)
    sendVerificationEmail(email, verification_token);
    
    res.status(201).json({ message: 'User registered. Please check your email for verification.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

router.get('/verify', async (req, res) => {
  const { token, email } = req.query;
  if (!token || !email) {
    return res.status(400).json({ error: 'Missing token or email.' });
  }
  try {
    const query = 'UPDATE users SET is_verified = true WHERE email = $1 AND verification_token = $2 RETURNING id';
    const result = await pool.query(query, [email, token]);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid token or email.' });
    }
    res.json({ message: 'Thank you for confirming your registration' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error: 'Email and password required.' });
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    if(result.rowCount === 0) return res.status(400).json({ error: 'Invalid credentials.' });
    
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if(!match) return res.status(400).json({ error: 'Invalid credentials.' });
    
    // Ideally generate a session token or JWT; here we'll simply return success
    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login error.' });
  }
});

export default router;
```

#### e) Email Utility – `backend/src/utils/email.ts`
- **Functionality:**  
  - For development, use a dummy function that logs the verification email and its link.
  - In production, integrate with an email service (Resend, SendGrid, etc.) using API keys.
  
_Sample snippet:_
```typescript
export const sendVerificationEmail = (to: string, token: string) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${token}&email=${to}`;
  console.log(`Send verification email to ${to}: Click this link to verify: ${verificationLink}`);
  // Future implementation: integrate with an email provider.
};
```

### 2.2 Database Schema Creation

Provide a SQL script (or instruct to run migration) to create the `users` table:
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

---

## 3. Integration & Testing

- **Environment Variables:**  
  - Frontend: Set `NEXT_PUBLIC_BACKEND_URL` in `.env.local` (e.g., http://localhost:4000).  
  - Backend: Set `DATABASE_URL` and `FRONTEND_URL` in `.env` (in the backend folder).
- **CORS:** Ensure CORS is enabled in the backend for communication with the frontend.
- **API Testing:**  
  - Use curl commands to test endpoints: registration, login, and verification.  
  - Validate error responses and proper HTTP status codes.
- **Error Handling:** All API endpoints include try-catch blocks and return user-friendly messages.

---

## Summary

• A new Next.js registration page (with captcha validation) is created in src/app/register/page.tsx along with modern UI styling.  
• Login and email verification pages are built to handle authentication and user validation.  
• A separate Express/TypeScript backend in the "backend" folder is set up to handle registration, email verification, and login endpoints, connected to a PostgreSQL database.  
• The database schema includes unique constraints on telephone and email, with secure password hashing using bcrypt.  
• Error handling and input validation are consistently implemented on both client and server.  
• Dummy email functionality logs verification links for free alternative initial development.  
• Environment variables and CORS configurations ensure smooth integration between frontend and backend.

This plan meets all requirements and lays out a clear structure for implementing a scalable and robust social media application.
