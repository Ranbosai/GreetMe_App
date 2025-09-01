import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { initializeDatabase } from './db/db';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:8000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GreetMe API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', authRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Internal Server Error',
    ...(isDevelopment && { stack: err.stack })
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 GreetMe API Server is running!`);
      console.log(`📍 Server: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      console.log(`📧 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'Using default connection'}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('\n📋 Available endpoints:');
      console.log('   POST /api/register - User registration');
      console.log('   GET  /api/verify   - Email verification');
      console.log('   POST /api/login    - User login');
      console.log('   GET  /api/profile/:id - Get user profile');
      console.log('   GET  /health       - Health check\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();
