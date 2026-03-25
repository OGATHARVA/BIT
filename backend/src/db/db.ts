import pkg from 'pg';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

export const query = async (text: string, params?: unknown[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug(`Query executed in ${duration}ms`);
    return result;
  } catch (error) {
    logger.error('Database query error:', error);
    throw error;
  }
};

export const getClient = async () => {
  return pool.connect();
};

export const initializeDatabase = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    logger.info('Database connection successful:', result.rows[0]);
    await runMigrations();
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

const runMigrations = async () => {
  logger.info('Running database migrations...');
  
  const migrations = [
    // Users table
    `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `,
    // Quotations table
    `
    CREATE TABLE IF NOT EXISTS quotations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      client_name VARCHAR(255) NOT NULL,
      client_company VARCHAR(255),
      project_name VARCHAR(255) NOT NULL,
      quotation_date DATE NOT NULL,
      validity_date DATE NOT NULL,
      letterhead_url VARCHAR(255),
      tax_percent DECIMAL(5,2) DEFAULT 0,
      tone VARCHAR(50) DEFAULT 'Professional',
      description_style VARCHAR(50) DEFAULT 'Medium',
      generated_content JSONB,
      status VARCHAR(50) DEFAULT 'draft',
      version INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `,
    // Quotation items table
    `
    CREATE TABLE IF NOT EXISTS quotation_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
      item_name VARCHAR(255) NOT NULL,
      quantity DECIMAL(10,2) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `,
    // Proposals table
    `
    CREATE TABLE IF NOT EXISTS proposals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      template_id VARCHAR(50) NOT NULL,
      template_name VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      client_name VARCHAR(255) NOT NULL,
      client_company VARCHAR(255),
      project_name VARCHAR(255) NOT NULL,
      proposal_date DATE NOT NULL,
      validity_date DATE NOT NULL,
      prepared_by VARCHAR(255),
      problem_statement TEXT,
      client_requirements TEXT,
      objectives TEXT,
      notes TEXT,
      services TEXT[],
      deliverables TEXT,
      estimated_timeline VARCHAR(255),
      budget VARCHAR(255),
      key_features TEXT,
      scope_of_work TEXT,
      tone VARCHAR(50) DEFAULT 'Professional',
      proposal_style VARCHAR(50) DEFAULT 'Detailed',
      sections JSONB,
      status VARCHAR(50) DEFAULT 'draft',
      version INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `,
    // Create indexes
    `
    CREATE INDEX IF NOT EXISTS idx_quotations_user_id ON quotations(user_id);
    CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at);
    CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
    CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation_id ON quotation_items(quotation_id);
    CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON proposals(user_id);
    CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at);
    CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
    `,
  ];

  for (const migration of migrations) {
    try {
      await query(migration);
    } catch (error) {
      logger.warn('Migration already exists or error:', error);
    }
  }
  
  logger.info('Migrations completed');
};

export const closePool = async () => {
  await pool.end();
};
