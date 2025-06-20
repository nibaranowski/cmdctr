// Company model for MongoDB
// See: https://mongoosejs.com/docs/guide.html
import { z } from 'zod';

import { IntegrationSchema } from './Integration';

export interface Company {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending' | 'banned';
  plan: 'free' | 'pro' | 'enterprise';
  integrations: Array<import('./Integration').Integration>;
  created_at: string; // ISO8601
}

export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'inactive', 'pending', 'banned']),
  plan: z.enum(['free', 'pro', 'enterprise']),
  integrations: z.array(IntegrationSchema),
  created_at: z.string().datetime(),
});

export interface CompanyCreateInput {
  name: string;
  plan?: 'free' | 'pro' | 'enterprise';
  settings?: Partial<Company['settings']>;
}

export interface CompanyUpdateInput {
  name?: string;
  status?: Company['status'];
  plan?: Company['plan'];
  settings?: Partial<Company['settings']>;
  billing?: Partial<Company['billing']>;
}

export interface ICompany {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  foundedYear?: number;
  website?: string;
  logo?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    email: string;
    phone?: string;
  };
  settings: {
    timezone: string;
    currency: string;
    language: string;
  };
  subscription?: {
    plan: 'free' | 'basic' | 'pro' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled';
    startDate: Date;
    endDate?: Date;
    stripeCustomerId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CreateCompanyInput {
  name: string;
  slug: string;
  description?: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  foundedYear?: number;
  website?: string;
  logo?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    email: string;
    phone?: string;
  };
  settings?: {
    timezone?: string;
    currency?: string;
    language?: string;
  };
} 