import { MetaBoxSchema, META_BOX_TEMPLATES } from '../../models/MetaBox';

describe('MetaBox Model', () => {
  describe('Schema Validation', () => {
    it('validates a correct meta box object', () => {
      const metaBox = {
        id: 'metabox_123',
        type: 'fundraising',
        name: 'Fundraising Pipeline',
        company_id: 'company_456',
        settings: {
          phases: ['phase_1', 'phase_2'],
          default_agents: {
            'phase_1': ['agent_1', 'agent_2'],
            'phase_2': ['agent_3']
          },
          permissions: {
            can_edit: ['user_1', 'user_2'],
            can_view: ['user_3'],
            can_manage: ['user_1']
          },
          integrations: ['integration_1'],
          notifications: {
            slack_channel: '#fundraising',
            email_notifications: true,
            webhook_url: 'https://example.com/webhook'
          }
        },
        created_at: '2024-06-01T12:00:00Z',
        updated_at: '2024-06-01T12:00:00Z',
        status: 'active'
      };

      const result = MetaBoxSchema.safeParse(metaBox);
      expect(result.success).toBe(true);
    });

    it('rejects meta box without required fields', () => {
      const invalidMetaBox = {
        id: 'metabox_123',
        // missing type, name, company_id, etc.
        created_at: '2024-06-01T12:00:00Z',
        updated_at: '2024-06-01T12:00:00Z'
      };

      const result = MetaBoxSchema.safeParse(invalidMetaBox);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(5); // type, name, company_id, settings, status
      }
    });

    it('rejects invalid meta box type', () => {
      const metaBox = {
        id: 'metabox_123',
        type: 'invalid_type',
        name: 'Test Meta Box',
        company_id: 'company_456',
        settings: {
          phases: [],
          default_agents: {},
          permissions: {
            can_edit: [],
            can_view: [],
            can_manage: []
          },
          integrations: [],
          notifications: {
            email_notifications: false
          }
        },
        created_at: '2024-06-01T12:00:00Z',
        updated_at: '2024-06-01T12:00:00Z',
        status: 'active'
      };

      const result = MetaBoxSchema.safeParse(metaBox);
      expect(result.success).toBe(false);
    });

    it('rejects invalid status', () => {
      const metaBox = {
        id: 'metabox_123',
        type: 'fundraising',
        name: 'Test Meta Box',
        company_id: 'company_456',
        settings: {
          phases: [],
          default_agents: {},
          permissions: {
            can_edit: [],
            can_view: [],
            can_manage: []
          },
          integrations: [],
          notifications: {
            email_notifications: false
          }
        },
        created_at: '2024-06-01T12:00:00Z',
        updated_at: '2024-06-01T12:00:00Z',
        status: 'invalid_status'
      };

      const result = MetaBoxSchema.safeParse(metaBox);
      expect(result.success).toBe(false);
    });
  });

  describe('Meta Box Templates', () => {
    it('has templates for all meta box types', () => {
      const expectedTypes = [
        'fundraising', 'hiring', 'selling', 'product', 'marketing',
        'reporting', 'support', 'legal', 'finance', 'knowledge', 'okrs'
      ];

      expectedTypes.forEach(type => {
        expect(META_BOX_TEMPLATES[type as keyof typeof META_BOX_TEMPLATES]).toBeDefined();
      });
    });

    it('fundraising template has correct phases and agents', () => {
      const fundraisingTemplate = META_BOX_TEMPLATES.fundraising;
      
      expect(fundraisingTemplate.name).toBe('Fundraising');
      expect(fundraisingTemplate.default_phases).toEqual([
        'Target List', 'Outreach', 'Scheduling', 'Negotiation', 'Closing'
      ]);
      expect(fundraisingTemplate.default_agents['Target List']).toContain('InvestorResearchAgent');
      expect(fundraisingTemplate.default_agents['Outreach']).toContain('AIOutreachAgent');
    });

    it('hiring template has correct phases and agents', () => {
      const hiringTemplate = META_BOX_TEMPLATES.hiring;
      
      expect(hiringTemplate.name).toBe('Hiring');
      expect(hiringTemplate.default_phases).toEqual([
        'Sourcing', 'Screening', 'Interviews', 'Offer', 'Onboarding'
      ]);
      expect(hiringTemplate.default_agents['Sourcing']).toContain('AIRecruiterAgent');
      expect(hiringTemplate.default_agents['Interviews']).toContain('InterviewInsightsAgent');
    });

    it('all templates have required properties', () => {
      Object.values(META_BOX_TEMPLATES).forEach(template => {
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('description');
        expect(template).toHaveProperty('default_phases');
        expect(template).toHaveProperty('default_agents');
        expect(Array.isArray(template.default_phases)).toBe(true);
        expect(typeof template.default_agents).toBe('object');
      });
    });
  });

  describe('Edge Cases', () => {
    it('accepts empty phases and agents arrays', () => {
      const metaBox = {
        id: 'metabox_123',
        type: 'fundraising',
        name: 'Empty Meta Box',
        company_id: 'company_456',
        settings: {
          phases: [],
          default_agents: {},
          permissions: {
            can_edit: [],
            can_view: [],
            can_manage: []
          },
          integrations: [],
          notifications: {
            email_notifications: false
          }
        },
        created_at: '2024-06-01T12:00:00Z',
        updated_at: '2024-06-01T12:00:00Z',
        status: 'active'
      };

      const result = MetaBoxSchema.safeParse(metaBox);
      expect(result.success).toBe(true);
    });

    it('accepts optional metadata', () => {
      const metaBox = {
        id: 'metabox_123',
        type: 'fundraising',
        name: 'Meta Box with Metadata',
        company_id: 'company_456',
        settings: {
          phases: [],
          default_agents: {},
          permissions: {
            can_edit: [],
            can_view: [],
            can_manage: []
          },
          integrations: [],
          notifications: {
            email_notifications: false
          }
        },
        created_at: '2024-06-01T12:00:00Z',
        updated_at: '2024-06-01T12:00:00Z',
        status: 'active',
        metadata: {
          custom_field: 'custom_value',
          priority: 'high'
        }
      };

      const result = MetaBoxSchema.safeParse(metaBox);
      expect(result.success).toBe(true);
    });
  });
}); 