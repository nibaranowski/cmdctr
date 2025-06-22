import { WorkflowEventSchema, WorkflowTriggerSchema } from '../../models/WorkflowEvent';

describe('WorkflowEvent Model', () => {
  describe('WorkflowEventSchema', () => {
    it('validates a correct workflow event', () => {
      const event = {
        id: 'event_001',
        company_id: 'comp_001',
        event_type: 'phase_change',
        trigger_type: 'on_phase_change',
        source_id: 'phase_001',
        source_type: 'phase',
        metadata: {
          phase_id: 'phase_001',
          payload: { from: 'research', to: 'outreach' }
        },
        timestamp: new Date().toISOString(),
        processed: false,
        created_at: new Date().toISOString()
      };
      expect(WorkflowEventSchema.parse(event)).toBeTruthy();
    });

    it('validates all event types', () => {
      const eventTypes = [
        'phase_change',
        'agent_action',
        'integration_trigger',
        'task_completed',
        'task_failed',
        'workflow_started',
        'workflow_completed',
        'workflow_failed',
        'webhook_received',
        'manual_trigger'
      ];

      eventTypes.forEach(eventType => {
        const event = {
          id: `event_${eventType}`,
          company_id: 'comp_001',
          event_type: eventType,
          trigger_type: 'on_manual',
          source_id: 'source_001',
          source_type: 'agent',
          metadata: {},
          timestamp: new Date().toISOString(),
          processed: false,
          created_at: new Date().toISOString()
        };
        expect(() => WorkflowEventSchema.parse(event)).not.toThrow();
      });
    });

    it('validates all trigger types', () => {
      const triggerTypes = [
        'on_phase_change',
        'on_agent_action',
        'on_task_completion',
        'on_webhook',
        'on_schedule',
        'on_manual',
        'on_error'
      ];

      triggerTypes.forEach(triggerType => {
        const event = {
          id: `event_${triggerType}`,
          company_id: 'comp_001',
          event_type: 'manual_trigger',
          trigger_type: triggerType,
          source_id: 'source_001',
          source_type: 'user',
          metadata: {},
          timestamp: new Date().toISOString(),
          processed: false,
          created_at: new Date().toISOString()
        };
        expect(() => WorkflowEventSchema.parse(event)).not.toThrow();
      });
    });

    it('validates all source types', () => {
      const sourceTypes = ['agent', 'phase', 'task', 'workflow', 'integration', 'user'];

      sourceTypes.forEach(sourceType => {
        const event = {
          id: `event_${sourceType}`,
          company_id: 'comp_001',
          event_type: 'manual_trigger',
          trigger_type: 'on_manual',
          source_id: `${sourceType}_001`,
          source_type: sourceType,
          metadata: {},
          timestamp: new Date().toISOString(),
          processed: false,
          created_at: new Date().toISOString()
        };
        expect(() => WorkflowEventSchema.parse(event)).not.toThrow();
      });
    });

    it('rejects invalid event type', () => {
      const event = {
        id: 'event_001',
        company_id: 'comp_001',
        event_type: 'invalid_type',
        trigger_type: 'on_manual',
        source_id: 'source_001',
        source_type: 'agent',
        metadata: {},
        timestamp: new Date().toISOString(),
        processed: false,
        created_at: new Date().toISOString()
      };
      expect(() => WorkflowEventSchema.parse(event)).toThrow();
    });

    it('rejects missing required fields', () => {
      const event = {
        id: 'event_001',
        company_id: 'comp_001',
        event_type: 'phase_change',
        // Missing trigger_type, source_id, etc.
        metadata: {},
        timestamp: new Date().toISOString(),
        processed: false,
        created_at: new Date().toISOString()
      };
      expect(() => WorkflowEventSchema.parse(event)).toThrow();
    });

    it('accepts complex metadata', () => {
      const event = {
        id: 'event_001',
        company_id: 'comp_001',
        event_type: 'agent_action',
        trigger_type: 'on_agent_action',
        source_id: 'agent_001',
        source_type: 'agent',
        metadata: {
          agent_id: 'agent_001',
          task_id: 'task_001',
          payload: {
            action: 'send_email',
            recipient: 'investor@example.com',
            template: 'intro_email',
            variables: { name: 'John Doe', company: 'TechCorp' }
          },
          execution_time_ms: 1250,
          retry_count: 0
        },
        timestamp: new Date().toISOString(),
        processed: false,
        created_at: new Date().toISOString()
      };
      expect(WorkflowEventSchema.parse(event)).toBeTruthy();
    });

    it('validates processed event with processed_at timestamp', () => {
      const event = {
        id: 'event_001',
        company_id: 'comp_001',
        event_type: 'task_completed',
        trigger_type: 'on_task_completion',
        source_id: 'task_001',
        source_type: 'task',
        metadata: {},
        timestamp: new Date().toISOString(),
        processed: true,
        processed_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      expect(WorkflowEventSchema.parse(event)).toBeTruthy();
    });
  });

  describe('WorkflowTriggerSchema', () => {
    it('validates a correct workflow trigger', () => {
      const trigger = {
        id: 'trigger_001',
        company_id: 'comp_001',
        name: 'Auto-notify on phase change',
        description: 'Send Slack notification when phase changes',
        trigger_type: 'on_phase_change',
        conditions: [
          {
            field: 'phase_id',
            operator: 'equals',
            value: 'phase_001'
          }
        ],
        actions: [
          {
            type: 'webhook',
            config: {
              url: 'https://hooks.slack.com/services/123/456/789',
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: { text: 'Phase changed to Outreach!' }
            },
            retry_config: {
              max_retries: 3,
              retry_delay_ms: 1000,
              backoff_multiplier: 2
            }
          }
        ],
        enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      expect(WorkflowTriggerSchema.parse(trigger)).toBeTruthy();
    });

    it('validates all action types', () => {
      const actionTypes = ['webhook', 'agent_action', 'phase_transition', 'notification', 'integration_call'];

      actionTypes.forEach(actionType => {
        const trigger = {
          id: `trigger_${actionType}`,
          company_id: 'comp_001',
          name: `Test ${actionType} trigger`,
          trigger_type: 'on_manual',
          conditions: [],
          actions: [
            {
              type: actionType,
              config: { test: true }
            }
          ],
          enabled: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        expect(() => WorkflowTriggerSchema.parse(trigger)).not.toThrow();
      });
    });

    it('validates all condition operators', () => {
      const operators = ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'exists'];

      operators.forEach(operator => {
        const trigger = {
          id: `trigger_${operator}`,
          company_id: 'comp_001',
          name: `Test ${operator} condition`,
          trigger_type: 'on_manual',
          conditions: [
            {
              field: 'status',
              operator: operator,
              value: operator === 'exists' ? null : 'active'
            }
          ],
          actions: [
            {
              type: 'notification',
              config: { message: 'Test' }
            }
          ],
          enabled: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        expect(() => WorkflowTriggerSchema.parse(trigger)).not.toThrow();
      });
    });

    it('rejects trigger without name', () => {
      const trigger = {
        id: 'trigger_001',
        company_id: 'comp_001',
        // Missing name
        trigger_type: 'on_manual',
        conditions: [],
        actions: [
          {
            type: 'notification',
            config: { message: 'Test' }
          }
        ],
        enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      expect(() => WorkflowTriggerSchema.parse(trigger)).toThrow();
    });

    it('rejects trigger without actions', () => {
      const trigger = {
        id: 'trigger_001',
        company_id: 'comp_001',
        name: 'Test trigger',
        trigger_type: 'on_manual',
        conditions: [],
        actions: [], // Empty actions array
        enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      expect(() => WorkflowTriggerSchema.parse(trigger)).toThrow();
    });

    it('accepts complex retry configuration', () => {
      const trigger = {
        id: 'trigger_001',
        company_id: 'comp_001',
        name: 'Complex retry trigger',
        trigger_type: 'on_webhook',
        conditions: [
          {
            field: 'status',
            operator: 'equals',
            value: 'success'
          }
        ],
        actions: [
          {
            type: 'webhook',
            config: {
              url: 'https://api.example.com/webhook',
              method: 'POST',
              headers: { 'Authorization': 'Bearer token123' },
              body: { event: 'phase_change' }
            },
            retry_config: {
              max_retries: 5,
              retry_delay_ms: 2000,
              backoff_multiplier: 1.5
            }
          }
        ],
        enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      expect(WorkflowTriggerSchema.parse(trigger)).toBeTruthy();
    });
  });
}); 