import { z } from 'zod';

// Data interfaces (for serialization/deserialization)
export interface MetaBoxPhaseData {
  id: string;
  name: string;
  order: number;
  description?: string;
  agent_id?: string;
  metabox_id: string;
  created_at: string;
  updated_at: string;
}

export interface MetaBoxTemplateData {
  id: string;
  name: string;
  description: string;
  phases: MetaBoxPhaseData[];
  created_at: string;
  updated_at: string;
  version: number;
}

export interface MetaBoxData {
  id: string;
  name: string;
  description?: string;
  company_id: string;
  owner_id?: string;
  shared_with: string[];
  phases: MetaBoxPhaseData[];
  templates: MetaBoxTemplateData[];
  version: number;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

// Class interfaces (extend data interfaces with methods)
export interface MetaBoxPhase extends MetaBoxPhaseData {
  update(changes: Partial<Pick<MetaBoxPhaseData, 'name' | 'order' | 'description' | 'agent_id'>>): void;
}

export interface MetaBoxTemplate extends MetaBoxTemplateData {
  update(changes: Partial<Pick<MetaBoxTemplateData, 'name' | 'description' | 'phases'>>): void;
}

export interface MetaBox extends MetaBoxData {
  update(changes: Partial<Pick<MetaBoxData, 'name' | 'description' | 'shared_with' | 'metadata'>>): void;
  addPhase(phase: Omit<MetaBoxPhaseData, 'id' | 'metabox_id' | 'created_at' | 'updated_at'>): void;
  removePhase(phaseId: string): boolean;
  createTemplate(name: string, description: string): MetaBoxTemplate;
  applyTemplate(template: MetaBoxTemplate): void;
  canAccess(userId: string): boolean;
  canEdit(userId: string): boolean;
  detectConflict(change: { version: number; changes: Record<string, unknown> }): { hasConflict: boolean; message?: string };
}

// Zod schemas
export const MetaBoxPhaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  order: z.number().int().nonnegative(),
  description: z.string().optional(),
  agent_id: z.string().optional(),
  metabox_id: z.string().min(1),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const MetaBoxTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  phases: z.array(MetaBoxPhaseSchema),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  version: z.number().int().positive()
});

export const MetaBoxSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  company_id: z.string().min(1),
  owner_id: z.string().optional(),
  shared_with: z.array(z.string()),
  phases: z.array(MetaBoxPhaseSchema),
  templates: z.array(MetaBoxTemplateSchema),
  version: z.number().int().positive(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  metadata: z.record(z.unknown()).optional()
});

// MetaBox class implementation
export class MetaBox implements MetaBox {
  public id: string;
  public name: string;
  public description?: string;
  public company_id: string;
  public owner_id?: string;
  public shared_with: string[];
  public phases: MetaBoxPhase[];
  public templates: MetaBoxTemplate[];
  public version: number;
  public created_at: string;
  public updated_at: string;
  public metadata?: Record<string, unknown>;

  constructor(data: Partial<MetaBoxData> & { name: string; company_id: string }) {
    this.id = data.id || `metabox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = data.name;
    this.description = data.description;
    this.company_id = data.company_id;
    this.owner_id = data.owner_id;
    this.shared_with = data.shared_with || [];
    this.phases = (data.phases || []).map(phaseData => new MetaBoxPhase(phaseData));
    this.templates = (data.templates || []).map(templateData => new MetaBoxTemplate(templateData));
    this.version = data.version || 1;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
    this.metadata = data.metadata;
  }

  update(changes: Partial<Pick<MetaBoxData, 'name' | 'description' | 'shared_with' | 'metadata'>>): void {
    if (changes.name !== undefined) this.name = changes.name;
    if (changes.description !== undefined) this.description = changes.description;
    if (changes.shared_with !== undefined) this.shared_with = changes.shared_with;
    if (changes.metadata !== undefined) this.metadata = changes.metadata;
    this.version++;
    this.updated_at = new Date().toISOString();
  }

  addPhase(phase: Omit<MetaBoxPhaseData, 'id' | 'metabox_id' | 'created_at' | 'updated_at'>): void {
    const newPhase = new MetaBoxPhase({
      ...phase,
      metabox_id: this.id
    });
    this.phases.push(newPhase);
    this.phases.sort((a, b) => a.order - b.order);
    this.version++;
    this.updated_at = new Date().toISOString();
  }

  removePhase(phaseId: string): boolean {
    const initialLength = this.phases.length;
    this.phases = this.phases.filter(phase => phase.id !== phaseId);
    if (this.phases.length !== initialLength) {
      this.version++;
      this.updated_at = new Date().toISOString();
      return true;
    }
    return false;
  }

  createTemplate(name: string, description: string): MetaBoxTemplate {
    const template = new MetaBoxTemplate({
      name,
      description,
      phases: this.phases.map(phase => ({
        id: phase.id,
        name: phase.name,
        order: phase.order,
        description: phase.description,
        agent_id: phase.agent_id,
        metabox_id: phase.metabox_id,
        created_at: phase.created_at,
        updated_at: phase.updated_at
      }))
    });
    this.templates.push(template);
    this.version++;
    this.updated_at = new Date().toISOString();
    return template;
  }

  applyTemplate(template: MetaBoxTemplate): void {
    this.phases = template.phases.map(phaseData => new MetaBoxPhase({
      ...phaseData,
      id: `phase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metabox_id: this.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    this.version++;
    this.updated_at = new Date().toISOString();
  }

  canAccess(userId: string): boolean {
    return this.owner_id === userId || this.shared_with.includes(userId);
  }

  canEdit(userId: string): boolean {
    return this.owner_id === userId;
  }

  detectConflict(change: { version: number; changes: Record<string, unknown> }): { hasConflict: boolean; message?: string } {
    if (change.version < this.version) {
      return {
        hasConflict: true,
        message: `Version conflict: local version ${this.version}, incoming version ${change.version}`
      };
    }
    return { hasConflict: false };
  }
}

// Template class implementation
export class MetaBoxTemplate implements MetaBoxTemplate {
  public id: string;
  public name: string;
  public description: string;
  public phases: MetaBoxPhase[];
  public created_at: string;
  public updated_at: string;
  public version: number;

  constructor(data: Partial<MetaBoxTemplateData> & { name: string; description: string }) {
    this.id = data.id || `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = data.name;
    this.description = data.description;
    this.phases = (data.phases || []).map(phaseData => new MetaBoxPhase(phaseData));
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
    this.version = data.version || 1;
  }

  update(changes: Partial<Pick<MetaBoxTemplateData, 'name' | 'description' | 'phases'>>): void {
    if (changes.name !== undefined) this.name = changes.name;
    if (changes.description !== undefined) this.description = changes.description;
    if (changes.phases !== undefined) {
      this.phases = changes.phases.map(phaseData => new MetaBoxPhase(phaseData));
    }
    this.version++;
    this.updated_at = new Date().toISOString();
  }
}

// Phase class implementation
export class MetaBoxPhase implements MetaBoxPhase {
  public id: string;
  public name: string;
  public order: number;
  public description?: string;
  public agent_id?: string;
  public metabox_id: string;
  public created_at: string;
  public updated_at: string;

  constructor(data: Partial<MetaBoxPhaseData> & { name: string; order: number; metabox_id: string }) {
    this.id = data.id || `phase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = data.name;
    this.order = data.order;
    this.description = data.description;
    this.agent_id = data.agent_id;
    this.metabox_id = data.metabox_id;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  update(changes: Partial<Pick<MetaBoxPhaseData, 'name' | 'order' | 'description' | 'agent_id'>>): void {
    if (changes.name !== undefined) this.name = changes.name;
    if (changes.order !== undefined) this.order = changes.order;
    if (changes.description !== undefined) this.description = changes.description;
    if (changes.agent_id !== undefined) this.agent_id = changes.agent_id;
    this.updated_at = new Date().toISOString();
  }
}

// Predefined templates
export const META_BOX_TEMPLATES = {
  fundraising: {
    name: 'Fundraising',
    description: 'Complete fundraising pipeline with investor research and outreach',
    default_phases: ['Target List', 'Outreach', 'Scheduling', 'Negotiation', 'Closing'],
    default_agents: {
      'Target List': ['InvestorResearchAgent'],
      'Outreach': ['AIOutreachAgent'],
      'Scheduling': ['MeetingSchedulerAgent'],
      'Negotiation': ['DealNegotiatorAgent'],
      'Closing': ['LegalReviewAgent']
    }
  },
  hiring: {
    name: 'Hiring',
    description: 'End-to-end hiring process from sourcing to onboarding',
    default_phases: ['Sourcing', 'Screening', 'Interviews', 'Offer', 'Onboarding'],
    default_agents: {
      'Sourcing': ['AIRecruiterAgent'],
      'Screening': ['ResumeScreenerAgent'],
      'Interviews': ['InterviewInsightsAgent'],
      'Offer': ['OfferNegotiatorAgent'],
      'Onboarding': ['OnboardingCoordinatorAgent']
    }
  },
  selling: {
    name: 'Sales',
    description: 'Sales pipeline with lead qualification and deal management',
    default_phases: ['Lead Generation', 'Qualification', 'Proposal', 'Negotiation', 'Closing'],
    default_agents: {
      'Lead Generation': ['LeadGeneratorAgent'],
      'Qualification': ['LeadQualifierAgent'],
      'Proposal': ['ProposalWriterAgent'],
      'Negotiation': ['SalesNegotiatorAgent'],
      'Closing': ['DealCloserAgent']
    }
  }
} as const;

export type MetaBoxType = keyof typeof META_BOX_TEMPLATES; 