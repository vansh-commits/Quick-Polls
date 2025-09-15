import mongoose, { Schema, Document, Model } from 'mongoose';

export interface PollOption {
  text: string;
  votes: number;
}

export interface PollDocument extends Document {
  userId: mongoose.Types.ObjectId | null;
  question: string;
  options: PollOption[];
  createdAt: Date;
}

const optionSchema = new Schema<PollOption>({
  text: { type: String, required: true },
  votes: { type: Number, required: true, default: 0 },
});

const pollSchema = new Schema<PollDocument>({
  userId: { type: Schema.Types.ObjectId, required: false, default: null },
  question: { type: String, required: true },
  options: { type: [optionSchema], required: true, validate: (v: PollOption[]) => v.length >= 2 },
  createdAt: { type: Date, required: true, default: Date.now },
});

export const Poll: Model<PollDocument> = mongoose.models.Poll || mongoose.model<PollDocument>('Poll', pollSchema);


