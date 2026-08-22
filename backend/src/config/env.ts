import dotenv from 'dotenv';

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000'),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
  CORS_ORIGIN: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? 'https://account-software-basic.vercel.app' : 'http://localhost:3000'),
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || 'logs/app.log',
};

// Validate required environment variables
if (!env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL is required in .env file');
}
if (!env.JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is required in .env file');
}

export default env;
