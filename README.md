# Command Center - The Command Center for Modern Business

[![CI/CD Pipeline](https://github.com/nicolasbaranowski/companyOS/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/nicolasbaranowski/companyOS/actions)
[![Code Coverage](https://codecov.io/gh/nicolasbaranowski/companyOS/branch/main/graph/badge.svg)](https://codecov.io/gh/nicolasbaranowski/companyOS)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Manage hiring, fundraising, product, marketing & ops — all in one place, powered by AI agents.

## 🚀 Features

- **AI-Powered Workspaces**: Intelligent automation for every business function
- **Unified Dashboard**: Single command center for all operations
- **Real-time Analytics**: Comprehensive insights and reporting
- **Enterprise Security**: SOC 2 compliant with advanced security features
- **Scalable Architecture**: Built for high-growth companies

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Stripe** - Payment processing
- **Clerk** - Authentication & user management

### DevOps & Quality
- **ESLint + Prettier** - Code quality & formatting
- **Jest + React Testing Library** - Unit & integration testing
- **Playwright** - End-to-end testing
- **Husky** - Git hooks
- **GitHub Actions** - CI/CD pipeline
- **Sentry** - Error monitoring
- **PostHog** - Product analytics
- **Lighthouse CI** - Performance monitoring

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (local or Atlas)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/nicolasbaranowski/companyOS.git
cd companyOS
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your configuration
# See Environment Variables section below
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

### Required
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/cmdctr

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
```

### Optional
```bash
# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://your_dsn@sentry.io/project_id
SENTRY_AUTH_TOKEN=your_token

# Email
RESEND_API_KEY=re_your_key
```

## SMTP/Email Configuration

To enable email sending for magic links and invites, set the following environment variables in your `.env.local` or deployment environment:

```
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=no-reply@cmdctr.com
```

- `SMTP_HOST`: Your SMTP server hostname (e.g., smtp.sendgrid.net, smtp.gmail.com)
- `SMTP_PORT`: SMTP port (usually 587 for TLS, 465 for SSL)
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `EMAIL_FROM`: The default sender address for all emails

Emails are sent for magic link logins and user invites. Make sure your SMTP credentials are valid and the sender address is authorized by your provider.

## 🧪 Testing

### Run All Tests
```