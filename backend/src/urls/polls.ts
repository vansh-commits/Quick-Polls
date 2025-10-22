import { Router } from 'express';
import mongoose, { Types } from 'mongoose';
import { z } from 'zod';
import { Poll } from '../models/Poll.js';
import { Vote } from '../models/Vote.js';
import { io } from '../server.js';
import { authMiddleware } from './auth.js';

export const pollRouter = Router();

const createPollSchema = z.object({
  question: z.string().min(3),
  options: z.array(z.string().min(1)).min(2)
});

pollRouter.post('/', authMiddleware as any, async (req: any, res) => {
  const parsed = createPollSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }
  const { question, options } = parsed.data;
  const poll = await Poll.create({
    userId: req.userId ? new mongoose.Types.ObjectId(req.userId) : null,
    question,
    options: options.map((text) => ({ text, votes: 0 }))
  });
  return res.json({ id: (poll._id as Types.ObjectId).toString(), question: poll.question, options: poll.options });
});

pollRouter.get('/', async (_req, res) => {
  const polls = await Poll.find().sort({ createdAt: -1 }).lean();
  const response = polls.map((p) => ({
    id: (p._id as Types.ObjectId).toString(),
    question: p.question,
    options: p.options.map((o) => ({ text: o.text, votes: o.votes }))
  }));
  return res.json(response);
});

const voteSchema = z.object({ optionIndex: z.number().int().min(0) });

pollRouter.post('/:id/vote', authMiddleware as any, async (req: any, res) => {
  const pollId = req.params.id;
  const parsed = voteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }
  const { optionIndex } = parsed.data;
  const poll = await Poll.findById(pollId);
  if (!poll) return res.status(404).json({ error: 'Poll not found' });
  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return res.status(400).json({ error: 'Invalid option index' });
  }
  await Vote.create({ pollId: poll._id, userId: req.userId ? new mongoose.Types.ObjectId(req.userId) : null, optionIndex });

  poll.options[optionIndex].votes += 1;
  await poll.save();

  const payload = {
    id: (poll._id as Types.ObjectId)
    .toString(),
    question: poll.question,
    options: poll.options.map((o) => ({ text: o.text, votes: o.votes }))
  };

  io.to(`poll:${pollId}`).emit('poll-updated', payload);

  return res.json(payload);
});

pollRouter.get('/:id', async (req, res) => {
  const pollId = req.params.id;
  const poll = await Poll.findById(pollId).lean();
  if (!poll) return res.status(404).json({ error: 'Poll not found' });
  return res.json({
    id: (poll._id as Types.ObjectId).toString(),
    question: poll.question,
    options: poll.options.map((o) => ({ text: o.text, votes: o.votes }))
  });
});


