import { MetaBox, MetaBoxSchema, MetaBoxTemplate, MetaBoxPhase } from '../../models/MetaBox';

describe('MetaBox Model', () => {
  describe('Schema Validation', () => {
    it('should validate a valid meta box', () => {
      const validMetaBox = {
        id: 'metabox_001',
        name: 'Fundraising Pipeline',
        description: 'Complete fundraising workflow',
        company_id: 'company_001',
        owner_id: 'user_001',
        shared_with: ['user_002'],
        phases: [
          {
            id: 'phase_001',
            name: 'Lead Generation',
            order: 1,
            description: 'Identify potential investors',
            metabox_id: 'metabox_001',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        templates: [
          {
            id: 'template_001',
            name: 'Standard Fundraising',
            description: 'Default fundraising template',
            phases: [
              {
                id: 'phase_001',
                name: 'Lead Generation',
                order: 1,
                description: 'Identify potential investors',
                metabox_id: 'metabox_001',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            version: 1
          }
        ],
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const result = MetaBoxSchema.safeParse(validMetaBox);
      expect(result.success).toBe(true);
    });

    it('should reject meta box without required fields', () => {
      const invalidMetaBox = {
        id: 'metabox_001',
        // Missing name, company_id, etc.
      };

      const result = MetaBoxSchema.safeParse(invalidMetaBox);
      expect(result.success).toBe(false);
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

  describe('CRUD Operations', () => {
    it('should create a new meta box', async () => {
      const metaBoxData = {
        name: 'Test Meta Box',
        description: 'Test description',
        company_id: 'company_001'
      };

      const metaBox = new MetaBox(metaBoxData);
      expect(metaBox.name).toBe(metaBoxData.name);
      expect(metaBox.id).toBeDefined();
      expect(metaBox.created_at).toBeDefined();
    });

    it('should update meta box properties', async () => {
      const metaBox = new MetaBox({
        name: 'Original Name',
        description: 'Original description',
        company_id: 'company_001'
      });

      const originalUpdatedAt = metaBox.updated_at;
      
      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      metaBox.update({
        name: 'Updated Name',
        description: 'Updated description'
      });

      expect(metaBox.name).toBe('Updated Name');
      expect(metaBox.description).toBe('Updated description');
      expect(new Date(metaBox.updated_at).getTime()).toBeGreaterThan(new Date(originalUpdatedAt).getTime());
    });

    it('should add phases to meta box', async () => {
      const metaBox = new MetaBox({
        name: 'Test Meta Box',
        company_id: 'company_001'
      });

      const phase = {
        id: 'phase_001',
        name: 'Test Phase',
        order: 1
      };

      metaBox.addPhase(phase);
      expect(metaBox.phases).toHaveLength(1);
      expect(metaBox.phases[0].name).toBe('Test Phase');
    });

    it('should remove phases from meta box', async () => {
      const metaBox = new MetaBox({
        name: 'Test Meta Box',
        company_id: 'company_001'
      });

      const phase = {
        id: 'phase_001',
        name: 'Test Phase',
        order: 1
      };

      metaBox.addPhase(phase);
      expect(metaBox.phases).toHaveLength(1);

      metaBox.removePhase('phase_001');
      expect(metaBox.phases).toHaveLength(0);
    });
  });

  describe('Template Management', () => {
    it('should create template from meta box', async () => {
      const metaBox = new MetaBox({
        name: 'Source Meta Box',
        company_id: 'company_001'
      });

      metaBox.addPhase({
        id: 'phase_001',
        name: 'Phase 1',
        order: 1
      });

      const template = metaBox.createTemplate('Test Template', 'Template description');
      expect(template.name).toBe('Test Template');
      expect(template.phases).toHaveLength(1);
    });

    it('should apply template to meta box', async () => {
      const template = new MetaBoxTemplate({
        name: 'Test Template',
        description: 'Template description',
        phases: [
          {
            id: 'phase_001',
            name: 'Template Phase 1',
            order: 1,
            metabox_id: 'metabox_001',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'phase_002',
            name: 'Template Phase 2',
            order: 2,
            metabox_id: 'metabox_001',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      });

      const metaBox = new MetaBox({
        name: 'Target Meta Box',
        company_id: 'company_001'
      });

      metaBox.applyTemplate(template);
      expect(metaBox.phases).toHaveLength(2);
      expect(metaBox.phases[0].name).toBe('Template Phase 1');
    });
  });

  describe('Permissions and Access Control', () => {
    it('should check user permissions for meta box', async () => {
      const metaBox = new MetaBox({
        name: 'Test Meta Box',
        company_id: 'company_001',
        owner_id: 'user_001'
      });

      expect(metaBox.canAccess('user_001')).toBe(true);
      expect(metaBox.canEdit('user_001')).toBe(true);
      expect(metaBox.canAccess('user_002')).toBe(false);
    });

    it('should handle shared meta boxes', async () => {
      const metaBox = new MetaBox({
        name: 'Shared Meta Box',
        company_id: 'company_001',
        owner_id: 'user_001',
        shared_with: ['user_002', 'user_003']
      });

      expect(metaBox.canAccess('user_002')).toBe(true);
      expect(metaBox.canEdit('user_002')).toBe(false); // Read-only access
    });
  });

  describe('Conflict Resolution', () => {
    it('should detect concurrent modifications', async () => {
      const metaBox = new MetaBox({
        name: 'Test Meta Box',
        company_id: 'company_001'
      });

      const version1 = metaBox.version;
      metaBox.update({ name: 'Updated Name' });
      const version2 = metaBox.version;

      expect(version2).toBeGreaterThan(version1);
    });

    it('should resolve merge conflicts', async () => {
      const metaBox = new MetaBox({
        name: 'Test Meta Box',
        company_id: 'company_001'
      });

      // Simulate concurrent updates
      const conflict = metaBox.detectConflict({
        version: metaBox.version - 1,
        changes: { name: 'Conflicting Name' }
      });

      expect(conflict.hasConflict).toBe(true);
    });
  });
}); 