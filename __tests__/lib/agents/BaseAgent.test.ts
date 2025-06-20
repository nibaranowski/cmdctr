import { BaseAgent } from '../../../lib/agents/BaseAgent';
import { AgentContext, AgentResult } from '../../../lib/agents/types';

// Create a concrete implementation for testing
class TestAgent extends BaseAgent {
  constructor() {
    super('test-agent', 'Test agent for testing', 'test-phase', 'test-meta-box');
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    if (context.userId === 'error-user') {
      throw new Error('Test error');
    }
    return this.createResult({ message: 'success' }, { custom: 'data' });
  }

  // Expose protected methods for testing
  public testHandleError(error: Error): Promise<AgentResult> {
    return this.handleError(error);
  }

  public testCreateResult<T>(data: T, metadata?: Record<string, any>): AgentResult<T> {
    return this.createResult(data, metadata);
  }
}

describe('BaseAgent', () => {
  let agent: TestAgent;
  let mockContext: AgentContext;

  beforeEach(() => {
    agent = new TestAgent();
    mockContext = {
      userId: 'test-user',
      organizationId: 'test-org',
      metadata: { test: 'data' }
    };
  });

  it('should create agent with correct properties', () => {
    expect(agent.name).toBe('test-agent');
    expect(agent.description).toBe('Test agent for testing');
    expect(agent.phase).toBe('test-phase');
    expect(agent.metaBox).toBe('test-meta-box');
  });

  it('should execute successfully', async () => {
    const result = await agent.execute(mockContext);
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ message: 'success' });
    expect(result.metadata).toBeDefined();
    if (result.metadata) {
      expect(result.metadata).toMatchObject({
        agentName: 'test-agent',
        phase: 'test-phase',
        metaBox: 'test-meta-box',
        custom: 'data'
      });
      expect(result.metadata.timestamp).toBeDefined();
    }
  });

  it('should handle errors correctly', async () => {
    const errorContext = { ...mockContext, userId: 'error-user' };
    
    // The error should be thrown and caught by the orchestrator
    await expect(agent.execute(errorContext)).rejects.toThrow('Test error');
  });

  it('should handle errors in handleError method', async () => {
    const testError = new Error('Test error message');
    const result = await agent.testHandleError(testError);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Test error message');
    expect(result.metadata).toBeDefined();
    if (result.metadata) {
      expect(result.metadata).toMatchObject({
        agentName: 'test-agent',
        phase: 'test-phase',
        metaBox: 'test-meta-box'
      });
      expect(result.metadata.timestamp).toBeDefined();
    }
  });

  it('should create result with data and metadata', () => {
    const testData = { test: 'value' };
    const testMetadata = { custom: 'metadata' };
    const result = agent.testCreateResult(testData, testMetadata);
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual(testData);
    expect(result.metadata).toBeDefined();
    if (result.metadata) {
      expect(result.metadata).toMatchObject({
        agentName: 'test-agent',
        phase: 'test-phase',
        metaBox: 'test-meta-box',
        custom: 'metadata'
      });
      expect(result.metadata.timestamp).toBeDefined();
    }
  });

  it('should create result with data only', () => {
    const testData = { test: 'value' };
    const result = agent.testCreateResult(testData);
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual(testData);
    expect(result.metadata).toBeDefined();
    if (result.metadata) {
      expect(result.metadata).toMatchObject({
        agentName: 'test-agent',
        phase: 'test-phase',
        metaBox: 'test-meta-box'
      });
      expect(result.metadata.timestamp).toBeDefined();
    }
  });

  it('should handle console.error in handleError', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const testError = new Error('Test error');
    
    await agent.testHandleError(testError);
    
    expect(consoleSpy).toHaveBeenCalledWith('Agent test-agent error:', testError);
    consoleSpy.mockRestore();
  });
}); 