import { z } from 'zod';

// Environment variable schema with validation
const envSchema = z.object({
  // Database
  MONGODB_URI: z.string().url(),
  
  // Authentication (Clerk)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().optional(),
  
  // Payments (Stripe)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  // Analytics
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
  
  // Monitoring & Logging (Better Stack)
  BETTERSTACK_SOURCE_TOKEN: z.string().optional(),
  
  // Email
  RESEND_API_KEY: z.string().optional(),
  
  // App Configuration
  NEXT_PUBLIC_APP_NAME: z.string().default('cmdctr'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('true'),
  NEXT_PUBLIC_ENABLE_MONITORING: z.string().transform(val => val === 'true').default('true'),
  NEXT_PUBLIC_ENABLE_EMAIL: z.string().transform(val => val === 'true').default('true'),
  
  // Security
  JWT_SECRET: z.string().optional(),
  ENCRYPTION_KEY: z.string().optional(),
  
  // Integrations
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  SLACK_BOT_TOKEN: z.string().optional(),
  SLACK_SIGNING_SECRET: z.string().optional(),
  
  // Development
  DEBUG: z.string().optional(),
  VERBOSE: z.string().transform(val => val === 'true').default('false'),
  MOCK_EXTERNAL_SERVICES: z.string().transform(val => val === 'true').default('false'),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional()
});

// Parse and validate environment variables
const env = envSchema.parse(process.env);

// Export validated environment variables
export { env };

// Helper function to get feature flags
export const features = {
  analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  monitoring: env.NEXT_PUBLIC_ENABLE_MONITORING,
  email: env.NEXT_PUBLIC_ENABLE_EMAIL,
} as const;

// Helper function to check if we're in production
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isStaging = env.NODE_ENV === 'staging'; 