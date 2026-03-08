import dotenv from 'dotenv';
import { existsSync } from 'node:fs';

dotenv.config();

const isRunningInDocker = existsSync('/.dockerenv');
const dbHost = process.env.DB_HOST || (isRunningInDocker ? 'db' : 'localhost');
const defaultDatabaseUrl = `postgres://postgres:postgres@${dbHost}:5432/silentvoix`;
const rawFrontendOrigins =
  process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://localhost:8080';

export const env = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || defaultDatabaseUrl,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendOrigins: rawFrontendOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
};
