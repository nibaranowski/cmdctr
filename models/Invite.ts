import mongoose, { Document, Schema } from 'mongoose';

export interface IInvite extends Document {
  email: string;
  role: string;
  permissions: string[];
  companyId?: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expiresAt: Date;
  createdAt: Date;
}

const InviteSchema = new Schema<IInvite>({
  email: { type: String, required: true },
  role: { type: String, required: true },
  permissions: { type: [String], default: ['read'] },
  companyId: { type: String },
  invitedBy: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'expired', 'revoked'], default: 'pending' },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Invite = mongoose.models.Invite || mongoose.model<IInvite>('Invite', InviteSchema); 