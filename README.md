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

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test Types
```bash
# Fast tests (no coverage)
npm run test:fast

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# With coverage
npm run test:coverage
```

### Quality Checks
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# All quality checks
npm run quality:check
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Push code to GitHub
   - Import project in Vercel dashboard

2. **Configure Environment Variables**
   - Add all required environment variables in Vercel dashboard

3. **Deploy**
   ```bash
   npm run build
   vercel --prod
   ```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📚 Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Write code following our [coding standards](CONTRIBUTING.md)
- Add tests for new functionality
- Update documentation as needed

### 3. Quality Checks
```bash
npm run quality:check
```

### 4. Commit Changes
```bash
npm run commit
```

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```

## 🏗 Project Structure

```
companyOS/
├── components/          # Reusable UI components
├── lib/                # Utility functions and configurations
├── pages/              # Next.js pages and API routes
├── styles/             # Global styles and Tailwind config
├── __tests__/          # Test files
├── .github/            # GitHub Actions workflows
├── docs/               # Documentation
└── scripts/            # Build and deployment scripts
```

## 🔍 Code Quality

### Linting & Formatting
- **ESLint**: TypeScript, React, and Next.js rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality gates

### Testing Strategy
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API route testing
- **E2E Tests**: Playwright for critical user flows
- **Coverage**: Minimum 80% coverage required

### Performance
- **Lighthouse CI**: Performance, SEO, accessibility
- **Bundle Analysis**: Webpack bundle analyzer
- **Core Web Vitals**: Real user metrics

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run quality checks
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/nicolasbaranowski/companyOS/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nicolasbaranowski/companyOS/discussions)

## 🏆 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Testing with [Jest](https://jestjs.io/) and [Playwright](https://playwright.dev/)

---

**Made with ❤️ by the Command Center team** 