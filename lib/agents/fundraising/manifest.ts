import { MetaBoxConfig } from '../types';

export const FundraisingMetaBox: MetaBoxConfig = {
  id: 'fundraising',
  name: 'Fundraising',
  description: 'End-to-end fundraising workflow with AI-powered agents',
  phases: [
    'identifying_investors',
    'conflict_check',
    'network_intro',
    'direct_outreach',
    'automated_intro',
    'scheduling',
    'avatar_negotiation',
    'negotiation',
    'closing'
  ],
  agents: [
    {
      id: 'investor_research',
      name: 'Investor Research Agent',
      description: 'Identifies and researches potential investors that match company criteria',
      phase: 'identifying_investors',
      metaBox: 'fundraising',
      config: {
        apis: ['crunchbase', 'pitchbook', 'linkedin'],
        updateFrequency: '24h',
      }
    },
    {
      id: 'conflict_detection',
      name: 'Conflict Detection Agent',
      description: 'Analyzes potential conflicts with investors portfolio companies',
      phase: 'conflict_check',
      metaBox: 'fundraising',
      config: {
        conflictTypes: ['direct_competitor', 'indirect_competitor', 'market_overlap'],
        dataSource: ['crunchbase', 'internal_db']
      }
    },
    {
      id: 'warm_intro_scout',
      name: 'Warm Intro Scout Agent',
      description: 'Identifies potential warm introduction paths to investors',
      phase: 'network_intro',
      metaBox: 'fundraising',
      config: {
        networks: ['linkedin', 'internal_network', 'apollo'],
        depthLevel: 2
      }
    },
    {
      id: 'direct_outreach',
      name: 'Direct Outreach Agent',
      description: 'Manages direct outreach campaigns to investors',
      phase: 'direct_outreach',
      metaBox: 'fundraising',
      config: {
        channels: ['email', 'linkedin'],
        templates: ['intro', 'follow_up', 'meeting_request']
      }
    },
    {
      id: 'network_intersection',
      name: 'Network Intersection Agent',
      description: 'Analyzes network intersections for automated introductions',
      phase: 'automated_intro',
      metaBox: 'fundraising',
      config: {
        networks: ['linkedin', 'angellist', 'internal'],
        minConnectionStrength: 7
      }
    },
    {
      id: 'auto_scheduler',
      name: 'Auto Scheduler Agent',
      description: 'Handles meeting scheduling with investors',
      phase: 'scheduling',
      metaBox: 'fundraising',
      config: {
        calendars: ['google', 'outlook'],
        bufferTime: '15m'
      }
    },
    {
      id: 'avatar_pitch',
      name: 'Avatar Pitch Agent',
      description: 'AI avatar for initial pitch meetings and Q&A',
      phase: 'avatar_negotiation',
      metaBox: 'fundraising',
      config: {
        models: ['gpt4', 'claude'],
        knowledgeBase: ['pitch_deck', 'financials', 'market']
      }
    },
    {
      id: 'negotiation',
      name: 'Negotiation Agent',
      description: 'Assists in term sheet negotiation and deal structuring',
      phase: 'negotiation',
      metaBox: 'fundraising',
      config: {
        templates: ['term_sheet', 'cap_table'],
        benchmarks: ['market_data', 'historical']
      }
    },
    {
      id: 'closing',
      name: 'Closing Agent',
      description: 'Manages closing process, documentation and wire transfers',
      phase: 'closing',
      metaBox: 'fundraising',
      config: {
        documents: ['closing_docs', 'wire_instructions'],
        notifications: ['email', 'slack']
      }
    }
  ]
}; 