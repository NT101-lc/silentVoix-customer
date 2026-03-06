import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';
import { env } from '../config/env.js';

function buildToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

function publicUserRow(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    createdAt: row.created_at
  };
}

export async function signup({ fullName, email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);

  if (existingUser.rowCount > 0) {
    const error = new Error('Email is already in use.');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email, created_at',
    [fullName.trim(), normalizedEmail, passwordHash]
  );

  const user = publicUserRow(result.rows[0]);
  const token = buildToken(user);
  return { user, token };
}

export async function login({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  const result = await pool.query(
    'SELECT id, full_name, email, password_hash, created_at FROM users WHERE email = $1',
    [normalizedEmail]
  );

  if (result.rowCount === 0) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  const row = result.rows[0];
  const passwordValid = await bcrypt.compare(password, row.password_hash);

  if (!passwordValid) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  const user = publicUserRow(row);
  const token = buildToken(user);
  return { user, token };
}
