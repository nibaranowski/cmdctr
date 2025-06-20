import { IntegrationSchema } from '../../models/Integration';

describe('Integration Model', () => {
  it('validates a correct integration object', () => {
    const integration = {
      id: 'int1',
      company_id: 'comp1',
      type: 'stripe',
      config: {
        apiKey: 'sk_test_123',
        webhookSecret: 'whsec_123'
      },
      status: 'active'
    };
    expect(IntegrationSchema.parse(integration)).toBeTruthy();
  });

  it('rejects invalid integration type', () => {
    const integration = {
      id: 'int2',
      company_id: 'comp1',
      type: 'invalid_type',
      config: {},
      status: 'active'
    };
    expect(() => IntegrationSchema.parse(integration)).toThrow();
  });

  it('rejects invalid status', () => {
    const integration = {
      id: 'int3',
      company_id: 'comp1',
      type: 'stripe',
      config: {},
      status: 'unknown'
    };
    expect(() => IntegrationSchema.parse(integration)).toThrow();
  });

  it('rejects missing required fields', () => {
    const integration = {
      id: 'int4',
      company_id: 'comp1',
      type: 'stripe',
      status: 'active'
    };
    expect(() => IntegrationSchema.parse(integration)).toThrow();
  });

  it('validates all supported integration types', () => {
    const validTypes = ['stripe', 'clerk', 'firebase', 'sentry', 'posthog', 'mercury', 'slack', 'zapier'];
    
    validTypes.forEach(type => {
      const integration = {
        id: `int_${type}`,
        company_id: 'comp1',
        type,
        config: {},
        status: 'active'
      };
      expect(() => IntegrationSchema.parse(integration)).not.toThrow();
    });
  });

  it('validates all supported status values', () => {
    const validStatuses = ['active', 'inactive', 'error', 'pending'];
    
    validStatuses.forEach(status => {
      const integration = {
        id: `int_${status}`,
        company_id: 'comp1',
        type: 'stripe',
        config: {},
        status
      };
      expect(() => IntegrationSchema.parse(integration)).not.toThrow();
    });
  });

  it('accepts complex configuration objects', () => {
    const integration = {
      id: 'int5',
      company_id: 'comp1',
      type: 'slack',
      config: {
        botToken: 'xoxb-123',
        signingSecret: 'secret123',
        channels: ['#general', '#random'],
        webhookUrl: 'https://hooks.slack.com/services/123/456/789',
        settings: {
          notifications: true,
          autoReply: false
        }
      },
      status: 'active'
    };
    expect(IntegrationSchema.parse(integration)).toBeTruthy();
  });
}); 