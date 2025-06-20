import mongoose, { Document, Schema } from 'mongoose';

export interface IMagicLinkToken extends Document {
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const MagicLinkTokenSchema = new Schema<IMagicLinkToken>({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const MagicLinkToken = mongoose.models.MagicLinkToken || mongoose.model<IMagicLinkToken>('MagicLinkToken', MagicLinkTokenSchema); 