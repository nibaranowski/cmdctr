import { AgentSchema } from '../../models/Agent';

describe('Agent Model', () => {
  const validAgent = {
    id: 'agent-1',
    name: 'Marketing Agent',
    description: 'AI agent for marketing tasks',
    company_id: 'company-1',
    metabox_id: 'metabox-1',
    phase_id: 'phase-1',
    agent_type: 'ai',
    status: 'active',
    capabilities: ['email_marketing', 'social_media'],
    skills: [
      {
        name: 'Content Creation',
        level: 'advanced',
        description: 'Expert in creating engaging content'
      }
    ],
    current_task_id: 'task-1',
    current_core_object_id: 'coreobj-1',
    current_phase_id: 'phase-1',
    performance_metrics: {
      tasks_completed: 50,
      tasks_failed: 2,
      average_completion_time_hours: 4.5,
      success_rate: 96,
      last_activity: '2024-06-01T12:00:00Z'
    },
    availability: {
      is_available: true,
      working_hours: {
        start: '09:00',
        end: '17:00',
        timezone: 'UTC'
      },
      max_concurrent_tasks: 5,
      current_task_count: 2
    },
    configuration: {
      model: 'gpt-4',
      api_keys: {
        openai: 'sk-123'
      },
      settings: {
        temperature: 0.7
      },
      webhooks: [
        {
          url: 'https://example.com/webhook',
          events: ['task_completed', 'task_failed']
        }
      ]
    },
    permissions: {
      can_create_tasks: true,
      can_assign_tasks: true,
      can_access_projects: true,
      can_manage_other_agents: false,
      can_access_company_data: true
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-06-01T12:00:00Z',
    last_heartbeat: '2024-06-01T12:00:00Z',
    metadata: {
      department: 'marketing',
      priority: 'high'
    }
  };

  it('validates a correct agent object', () => {
    expect(AgentSchema.parse(validAgent)).toEqual(validAgent);
  });

  it('rejects agent without required fields', () => {
    const { id, ...invalidAgent } = validAgent;
    expect(() => AgentSchema.parse(invalidAgent)).toThrow();
  });

  it('rejects empty name', () => {
    const agent = { ...validAgent, name: '' };
    expect(() => AgentSchema.parse(agent)).toThrow();
  });

  it('rejects invalid agent_type', () => {
    const agent = { ...validAgent, agent_type: 'invalid_type' };
    expect(() => AgentSchema.parse(agent)).toThrow();
  });

  it('rejects invalid status', () => {
    const agent = { ...validAgent, status: 'invalid_status' };
    expect(() => AgentSchema.parse(agent)).toThrow();
  });

  it('accepts all valid agent types', () => {
    const validTypes = ['ai', 'human', 'hybrid'];
    validTypes.forEach(type => {
      const agent = { ...validAgent, agent_type: type };
      expect(AgentSchema.parse(agent)).toBeDefined();
    });
  });

  it('accepts all valid statuses', () => {
    const validStatuses = ['active', 'idle', 'busy', 'offline', 'error', 'maintenance'];
    validStatuses.forEach(status => {
      const agent = { ...validAgent, status };
      expect(AgentSchema.parse(agent)).toBeDefined();
    });
  });

  it('rejects invalid working hours format', () => {
    const agent = {
      ...validAgent,
      availability: {
        ...validAgent.availability,
        working_hours: {
          start: '25:00', // Invalid hour
          end: '17:00',
          timezone: 'UTC'
        }
      }
    };
    expect(() => AgentSchema.parse(agent)).toThrow();
  });

  it('rejects negative performance metrics', () => {
    const agent = {
      ...validAgent,
      performance_metrics: {
        ...validAgent.performance_metrics,
        tasks_completed: -1
      }
    };
    expect(() => AgentSchema.parse(agent)).toThrow();
  });

  it('rejects success rate above 100', () => {
    const agent = {
      ...validAgent,
      performance_metrics: {
        ...validAgent.performance_metrics,
        success_rate: 101
      }
    };
    expect(() => AgentSchema.parse(agent)).toThrow();
  });

  it('accepts optional metabox_id and phase_id', () => {
    const { metabox_id, phase_id, ...agentWithoutAssignment } = validAgent;
    expect(AgentSchema.parse(agentWithoutAssignment)).toBeDefined();
  });

  it('accepts optional current_core_object_id', () => {
    const { current_core_object_id, ...agentWithoutCurrentObject } = validAgent;
    expect(AgentSchema.parse(agentWithoutCurrentObject)).toBeDefined();
  });

  it('rejects invalid webhook URL', () => {
    const agent = {
      ...validAgent,
      configuration: {
        ...validAgent.configuration,
        webhooks: [
          {
            url: 'invalid-url',
            events: ['task_completed']
          }
        ]
      }
    };
    expect(() => AgentSchema.parse(agent)).toThrow();
  });

  it('accepts empty capabilities array', () => {
    const agent = { ...validAgent, capabilities: [] };
    expect(AgentSchema.parse(agent)).toBeDefined();
  });

  it('accepts empty skills array', () => {
    const agent = { ...validAgent, skills: [] };
    expect(AgentSchema.parse(agent)).toBeDefined();
  });

  it('rejects invalid skill level', () => {
    const agent = {
      ...validAgent,
      skills: [
        {
          name: 'Test Skill',
          level: 'invalid_level',
          description: 'Test description'
        }
      ]
    };
    expect(() => AgentSchema.parse(agent)).toThrow();
  });

  it('accepts all valid skill levels', () => {
    const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    validLevels.forEach(level => {
      const agent = {
        ...validAgent,
        skills: [
          {
            name: 'Test Skill',
            level,
            description: 'Test description'
          }
        ]
      };
      expect(AgentSchema.parse(agent)).toBeDefined();
    });
  });
}); 