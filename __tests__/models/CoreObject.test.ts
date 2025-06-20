import { CoreObjectSchema, exampleCoreObject } from '../../models/CoreObject';

describe('CoreObject Model', () => {
  describe('Schema Validation', () => {
    it('validates a correct core object', () => {
      const result = CoreObjectSchema.safeParse(exampleCoreObject);
      expect(result.success).toBe(true);
    });

    it('validates core object with minimal required fields', () => {
      const minimalCoreObject = {
        id: 'coreobj_123',
        metabox_id: 'metabox_abc',
        title: 'Test Object',
        status: 'active',
        phase_id: 'phase_1',
        activity_log: [],
        created_at: '2024-06-01T12:00:00Z',
        updated_at: '2024-06-01T12:00:00Z'
      };

      const result = CoreObjectSchema.safeParse(minimalCoreObject);
      expect(result.success).toBe(true);
    });

    it('rejects core object without required fields', () => {
      const invalidCoreObject = {
        id: 'coreobj_123',
        // missing metabox_id, title, status, phase_id, etc.
        created_at: '2024-06-01T12:00:00Z',
        updated_at: '2024-06-01T12:00:00Z'
      };

      const result = CoreObjectSchema.safeParse(invalidCoreObject);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(5); // metabox_id, title, status, phase_id, activity_log
      }
    });

    it('rejects empty title', () => {
      const coreObject = {
        ...exampleCoreObject,
        title: ''
      };

      const result = CoreObjectSchema.safeParse(coreObject);
      expect(result.success).toBe(false);
    });

    it('rejects invalid status', () => {
      const coreObject = {
        ...exampleCoreObject,
        status: 'invalid_status'
      };

      const result = CoreObjectSchema.safeParse(coreObject);
      expect(result.success).toBe(false);
    });

    it('accepts all valid statuses', () => {
      const validStatuses = ['active', 'archived', 'draft', 'completed', 'blocked', 'pending'];
      
      validStatuses.forEach(status => {
        const coreObject = {
          ...exampleCoreObject,
          status
        };
        
        const result = CoreObjectSchema.safeParse(coreObject);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Activity Log', () => {
    it('validates activity log with all fields', () => {
      const coreObject = {
        ...exampleCoreObject,
        activity_log: [
          {
            id: 'act_1',
            agent_id: 'agent_1',
            core_object_id: 'coreobj_123',
            user_id: 'user_1',
            type: 'comment',
            message: 'Test activity',
            timestamp: '2024-06-01T12:00:00Z'
          }
        ]
      };

      const result = CoreObjectSchema.safeParse(coreObject);
      expect(result.success).toBe(true);
    });

    it('validates activity log with optional fields', () => {
      const coreObject = {
        ...exampleCoreObject,
        activity_log: [
          {
            id: 'act_1',
            type: 'comment',
            message: 'Test activity',
            timestamp: '2024-06-01T12:00:00Z'
            // agent_id, core_object_id, user_id are optional
          }
        ]
      };

      const result = CoreObjectSchema.safeParse(coreObject);
      expect(result.success).toBe(true);
    });

    it('rejects activity log with invalid timestamp', () => {
      const coreObject = {
        ...exampleCoreObject,
        activity_log: [
          {
            id: 'act_1',
            type: 'comment',
            message: 'Test activity',
            timestamp: 'invalid-timestamp'
          }
        ]
      };

      const result = CoreObjectSchema.safeParse(coreObject);
      expect(result.success).toBe(false);
    });
  });

  describe('Data Field', () => {
    it('accepts various data types', () => {
      const coreObject = {
        ...exampleCoreObject,
        data: {
          string_field: 'test',
          number_field: 123,
          boolean_field: true,
          array_field: [1, 2, 3],
          object_field: { nested: 'value' },
          null_field: null
        }
      };

      const result = CoreObjectSchema.safeParse(coreObject);
      expect(result.success).toBe(true);
    });

    it('accepts empty data object', () => {
      const coreObject = {
        ...exampleCoreObject,
        data: {}
      };

      const result = CoreObjectSchema.safeParse(coreObject);
      expect(result.success).toBe(true);
    });

    it('accepts undefined data', () => {
      const coreObject = {
        ...exampleCoreObject,
        data: undefined
      };

      const result = CoreObjectSchema.safeParse(coreObject);
      expect(result.success).toBe(true);
    });
  });

  describe('Optional Fields', () => {
    it('accepts core object without optional fields', () => {
      const coreObject = {
        id: 'coreobj_123',
        metabox_id: 'metabox_abc',
        title: 'Test Object',
        status: 'active',
        phase_id: 'phase_1',
        activity_log: [],
        created_at: '2024-06-01T12:00:00Z',
        updated_at: '2024-06-01T12:00:00Z'
        // description, assigned_user_id, agent_id, data, metadata are optional
      };

      const result = CoreObjectSchema.safeParse(coreObject);
      expect(result.success).toBe(true);
    });

    it('accepts core object with all optional fields', () => {
      const coreObject = {
        ...exampleCoreObject,
        description: 'Test description',
        assigned_user_id: 'user_1',
        agent_id: 'agent_1',
        data: { test: 'data' },
        metadata: { custom: 'metadata' }
      };

      const result = CoreObjectSchema.safeParse(coreObject);
      expect(result.success).toBe(true);
    });
  });

  describe('Example Object', () => {
    it('example object is valid', () => {
      const result = CoreObjectSchema.safeParse(exampleCoreObject);
      expect(result.success).toBe(true);
    });

    it('example object has correct structure', () => {
      expect(exampleCoreObject).toHaveProperty('id');
      expect(exampleCoreObject).toHaveProperty('metabox_id');
      expect(exampleCoreObject).toHaveProperty('title');
      expect(exampleCoreObject).toHaveProperty('status');
      expect(exampleCoreObject).toHaveProperty('phase_id');
      expect(exampleCoreObject).toHaveProperty('activity_log');
      expect(exampleCoreObject).toHaveProperty('created_at');
      expect(exampleCoreObject).toHaveProperty('updated_at');
    });

    it('example object has realistic data', () => {
      expect(exampleCoreObject.title).toBe('Investor: Sequoia Capital');
      expect(exampleCoreObject.status).toBe('active');
      expect(exampleCoreObject.activity_log).toHaveLength(1);
      expect(exampleCoreObject.data).toHaveProperty('email');
      expect(exampleCoreObject.data).toHaveProperty('last_contacted');
    });
  });
}); 