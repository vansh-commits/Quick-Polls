import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const authRouter = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

authRouter.post('/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    let errorMessage = 'Invalid payload';
    if (errors.email) errorMessage = 'Invalid email format';
    else if (errors.password) errorMessage = 'Password must be at least 6 characters';
    return res.status(400).json({ error: errorMessage });
  }
  const { email, password } = parsed.data;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });
  const token = jwt.sign({ sub: (user as any)._id.toString(), email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '30d' });
  return res.json({ token });
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    let errorMessage = 'Invalid payload';
    if (errors.email) errorMessage = 'Invalid email format';
    else if (errors.password) errorMessage = 'Password is required';
    return res.status(400).json({ error: errorMessage });
  }
  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: (user as any)._id.toString(), email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '30d' });
  return res.json({ token });
});

export function authMiddleware(req: any, res: any, next: any) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}


