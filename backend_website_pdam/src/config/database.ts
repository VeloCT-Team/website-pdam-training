import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

// Create a PostgreSQL connection pool with explicit config
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'pdam_db',
  user: 'postgres',
  password: 'Cecem1706',
});

// Create adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
