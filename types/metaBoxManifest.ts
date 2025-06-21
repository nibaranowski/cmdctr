export interface MetaBoxPhase {
  id: string;
  name: string;
  agentId: string;
  status: 'active' | 'complete' | 'pending';
}

export interface MetaBoxAgent {
  id: string;
  name: string;
  avatarUrl: string;
  status: 'online' | 'offline' | 'busy';
}

export interface MetaBoxCoreObjectField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'status' | 'date' | 'agent';
  sortable?: boolean;
  filterable?: boolean;
}

export interface MetaBoxManifest {
  id: string;
  name: string;
  coreObjectType: string;
  phases: MetaBoxPhase[];
  agents: MetaBoxAgent[];
  fields: MetaBoxCoreObjectField[];
}

export const fundraisingManifest: MetaBoxManifest = {
  id: 'fundraising',
  name: 'Fundraising',
  coreObjectType: 'Investor',
  phases: [
    { id: 'sourcing', name: 'Sourcing', agentId: 'ai-research', status: 'active' },
    { id: 'outreach', name: 'Outreach', agentId: 'ai-outreach', status: 'pending' },
    { id: 'negotiation', name: 'Negotiation', agentId: 'ai-negotiator', status: 'pending' },
    { id: 'closed', name: 'Closed', agentId: 'ai-admin', status: 'pending' },
  ],
  agents: [
    { id: 'ai-research', name: 'Research Bot', avatarUrl: '/avatars/research.png', status: 'online' },
    { id: 'ai-outreach', name: 'Outreach Bot', avatarUrl: '/avatars/outreach.png', status: 'online' },
    { id: 'ai-negotiator', name: 'Negotiator Bot', avatarUrl: '/avatars/negotiator.png', status: 'offline' },
    { id: 'ai-admin', name: 'Admin Bot', avatarUrl: '/avatars/admin.png', status: 'busy' },
  ],
  fields: [
    { key: 'name', label: 'Name', type: 'string', sortable: true, filterable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true, filterable: true },
    { key: 'currentPhase', label: 'Phase', type: 'string', sortable: true, filterable: true },
    { key: 'assignedAgent', label: 'Agent', type: 'agent', sortable: true, filterable: true },
  ],
}; 