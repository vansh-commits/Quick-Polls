import mongoose, { Schema, Document, Model } from 'mongoose';

export interface VoteDocument extends Document {
  pollId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | null;
  optionIndex: number;
}

const voteSchema = new Schema<VoteDocument>({
  pollId: { type: Schema.Types.ObjectId, ref: 'Poll', required: true },
  userId: { type: Schema.Types.ObjectId, required: false, default: null },
  optionIndex: { type: Number, required: true },
});

voteSchema.index({ pollId: 1, userId: 1 }, { unique: false });

export const Vote: Model<VoteDocument> = mongoose.models.Vote || mongoose.model<VoteDocument>('Vote', voteSchema);


