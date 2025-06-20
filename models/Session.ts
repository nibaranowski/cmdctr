import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  userId: string;
  device: string;
  ip: string;
  location: string;
  createdAt: Date;
  lastActive: Date;
  isActive: boolean;
}

const SessionSchema = new Schema<ISession>({
  userId: { type: String, required: true },
  device: { type: String, required: true },
  ip: { type: String, required: true },
  location: { type: String, default: 'Unknown' },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

export const Session = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema); 