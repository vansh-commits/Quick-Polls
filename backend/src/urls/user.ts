import { Router } from 'express';
import mongoose from 'mongoose';
import { authMiddleware } from './auth.js';
import { Vote } from '../models/Vote.js';
import { Poll } from '../models/Poll.js';

export const userRouter = Router();

userRouter.get('/me/votes', authMiddleware as any, async (req: any, res) => {
  const userId = req.userId as string;
  const votes = await Vote.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ _id: -1 }).lean();
  const pollIds = votes.map((v) => v.pollId);
  const polls = await Poll.find({ _id: { $in: pollIds } }).lean();
  const pollMap = new Map(polls.map((p) => [p._id.toString(), p]));
  const response = votes.map((v) => {
    const p = pollMap.get(v.pollId.toString());
    return {
      pollId: v.pollId.toString(),
      question: p?.question || 'Unknown',
      optionIndex: v.optionIndex,
      optionText: p?.options?.[v.optionIndex]?.text ?? '',
    };
  });
  return res.json(response);
});


