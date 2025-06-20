import { z } from 'zod';

export interface MetaBox {
  id: string;
  type: 'fundraising' | 'hiring' | 'selling' | 'product' | 'marketing' | 'reporting' | 'support' | 'legal' | 'finance' | 'knowledge' | 'okrs';
  name: string;
  company_id: string;
  settings: {
    phases: string[]; // Array of phase IDs
    default_agents: Record<string, string[]>; // phase_id -> agent_ids
    permissions: {
      can_edit: string[]; // User IDs
      can_view: string[]; // User IDs
      can_manage: string[]; // User IDs
    };
    integrations: string[]; // Integration IDs
    notifications: {
      slack_channel?: string;
      email_notifications: boolean;
      webhook_url?: string;
    };
  };
  created_at: string; // ISO8601
  updated_at: string; // ISO8601
  status: 'active' | 'archived' | 'draft';
  metadata?: Record<string, unknown>;
}

export const MetaBoxSchema = z.object({
  id: z.string(),
  type: z.enum([
    'fundraising', 'hiring', 'selling', 'product', 'marketing', 
    'reporting', 'support', 'legal', 'finance', 'knowledge', 'okrs'
  ]),
  name: z.string().min(1, 'Meta box name is required'),
  company_id: z.string(),
  settings: z.object({
    phases: z.array(z.string()),
    default_agents: z.record(z.array(z.string())),
    permissions: z.object({
      can_edit: z.array(z.string()),
      can_view: z.array(z.string()),
      can_manage: z.array(z.string())
    }),
    integrations: z.array(z.string()),
    notifications: z.object({
      slack_channel: z.string().optional(),
      email_notifications: z.boolean(),
      webhook_url: z.string().url().optional()
    })
  }),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  status: z.enum(['active', 'archived', 'draft']),
  metadata: z.record(z.unknown()).optional()
});

export interface MetaBoxCreateInput {
  type: MetaBox['type'];
  name: string;
  company_id: string;
  settings?: Partial<MetaBox['settings']>;
  status?: MetaBox['status'];
}

export interface MetaBoxUpdateInput {
  name?: string;
  settings?: Partial<MetaBox['settings']>;
  status?: MetaBox['status'];
  metadata?: Record<string, unknown>;
}

export interface MetaBoxFilter {
  company_id: string;
  type?: MetaBox['type'][];
  status?: MetaBox['status'][];
  created_at_before?: string;
  created_at_after?: string;
}

// Meta box templates for easy company setup
export const META_BOX_TEMPLATES: Record<MetaBox['type'], {
  name: string;
  description: string;
  default_phases: string[];
  default_agents: Record<string, string[]>;
}> = {
  fundraising: {
    name: 'Fundraising',
    description: 'Manage investor pipeline, due diligence, and deal tracking',
    default_phases: ['Target List', 'Outreach', 'Scheduling', 'Negotiation', 'Closing'],
    default_agents: {
      'Target List': ['InvestorResearchAgent', 'NetworkGraphAgent'],
      'Outreach': ['AIOutreachAgent', 'ConflictDetectionAgent'],
      'Scheduling': ['SmartSchedulerAgent'],
      'Negotiation': ['AvatarNegotiationAgent'],
      'Closing': ['ClosingAgent']
    }
  },
  hiring: {
    name: 'Hiring',
    description: 'AI-powered candidate sourcing, screening, and interview coordination',
    default_phases: ['Sourcing', 'Screening', 'Interviews', 'Offer', 'Onboarding'],
    default_agents: {
      'Sourcing': ['AIRecruiterAgent', 'ReferenceAgent'],
      'Screening': ['AIScreeningAgent'],
      'Interviews': ['InterviewInsightsAgent'],
      'Offer': ['OfferNegotiatorAgent'],
      'Onboarding': ['OnboardingCopilotAgent']
    }
  },
  selling: {
    name: 'Selling',
    description: 'Lead qualification, proposal generation, and sales process automation',
    default_phases: ['Lead Gen', 'Qualification', 'Demo', 'Proposal', 'Negotiation', 'Onboarding'],
    default_agents: {
      'Lead Gen': ['LeadGenAgent'],
      'Qualification': ['LeadQualAgent'],
      'Demo': ['DemoSchedulerAgent'],
      'Proposal': ['ProposalAgent'],
      'Negotiation': ['SalesNegotiationAgent'],
      'Onboarding': ['CustomerOnboardingAgent']
    }
  },
  product: {
    name: 'Product',
    description: 'Feature prioritization, user feedback analysis, and roadmap planning',
    default_phases: ['Backlog', 'Scoping', 'Build', 'QA'],
    default_agents: {
      'Backlog': ['IdeaCollectorAgent'],
      'Scoping': ['SpecWriterAgent'],
      'Build': ['PRReviewerAgent'],
      'QA': ['BugScanAgent']
    }
  },
  marketing: {
    name: 'Marketing',
    description: 'Campaign orchestration, content generation, and performance tracking',
    default_phases: ['Planning', 'Content', 'Distribution'],
    default_agents: {
      'Planning': ['CampaignPlannerAgent'],
      'Content': ['ContentGeneratorAgent'],
      'Distribution': ['ChannelManagerAgent']
    }
  },
  reporting: {
    name: 'Reporting',
    description: 'Automated report generation, data analysis, and insights',
    default_phases: ['Draft', 'Review', 'Publish'],
    default_agents: {
      'Draft': ['ReportDraftAgent'],
      'Review': ['DataQAAgent'],
      'Publish': ['PublisherAgent']
    }
  },
  support: {
    name: 'Support',
    description: 'Customer support automation and ticket management',
    default_phases: ['Intake', 'Resolution'],
    default_agents: {
      'Intake': ['TicketClassifierAgent'],
      'Resolution': ['SupportCopilotAgent']
    }
  },
  legal: {
    name: 'Legal',
    description: 'Contract review, compliance monitoring, and legal workflow automation',
    default_phases: ['Review', 'Approve'],
    default_agents: {
      'Review': ['LegalScanAgent'],
      'Approve': ['ApprovalWorkflowAgent']
    }
  },
  finance: {
    name: 'Finance',
    description: 'Financial operations, invoicing, and reconciliation',
    default_phases: ['Invoicing', 'Reconciliation'],
    default_agents: {
      'Invoicing': ['InvoiceAgent'],
      'Reconciliation': ['ReconcileAgent']
    }
  },
  knowledge: {
    name: 'Knowledge',
    description: 'Knowledge management, documentation, and instant answers',
    default_phases: ['Intake', 'Answering'],
    default_agents: {
      'Intake': ['KnowledgeMinerAgent'],
      'Answering': ['InstantAnswerAgent']
    }
  },
  okrs: {
    name: 'OKRs',
    description: 'Objective and key results tracking, progress monitoring',
    default_phases: ['Draft', 'Progress', 'Retrospective'],
    default_agents: {
      'Draft': ['OKRCoachAgent'],
      'Progress': ['CheckInAgent'],
      'Retrospective': ['RetroBotAgent']
    }
  }
}; 