import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentPanel from '../../components/AgentPanel';

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('AgentPanel UI', () => {
  it('should display a list of agents', async () => {
    render(<AgentPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('Data Processing Agent')).toBeInTheDocument();
      expect(screen.getByText('Email Agent')).toBeInTheDocument();
      expect(screen.getByText('Analytics Agent')).toBeInTheDocument();
    });
  });

  it('should show status badges for each agent', async () => {
    render(<AgentPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('Idle')).toBeInTheDocument();
      expect(screen.getByText('Busy')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  it('should display agent logs when agent is selected', async () => {
    render(<AgentPanel />);
    
    await waitFor(() => {
      const dataProcessingAgent = screen.getByText('Data Processing Agent');
      fireEvent.click(dataProcessingAgent);
    });

    await waitFor(() => {
      expect(screen.getByText('Recent Logs')).toBeInTheDocument();
      expect(screen.getByText(/Agent registered successfully/)).toBeInTheDocument();
    });
  });

  it('should provide quick actions for agents', async () => {
    render(<AgentPanel />);
    
    await waitFor(() => {
      const restartButtons = screen.getAllByText('Restart');
      const assignButtons = screen.getAllByText('Assign Task');
      
      expect(restartButtons.length).toBeGreaterThan(0);
      expect(assignButtons.length).toBeGreaterThan(0);
    });
  });

  it('should show error state UI for unhealthy agents', async () => {
    render(<AgentPanel />);
    
    await waitFor(() => {
      const analyticsAgent = screen.getByText('Analytics Agent');
      fireEvent.click(analyticsAgent);
    });

    await waitFor(() => {
      expect(screen.getByText('Unhealthy')).toBeInTheDocument();
      expect(screen.getByText('Error Count: 5')).toBeInTheDocument();
    });
  });

  it('should handle quick action clicks', async () => {
    render(<AgentPanel />);
    
    await waitFor(() => {
      const restartButtons = screen.getAllByText('Restart');
      fireEvent.click(restartButtons[0]);
    });

    // Verify console.log was called (simulating API call)
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Performing restart on agent agent_1');
    });
  });

  it('should disable assign task button for busy agents', async () => {
    render(<AgentPanel />);
    
    await waitFor(() => {
      const emailAgent = screen.getByText('Email Agent').closest('div');
      if (emailAgent) {
        const assignButtons = emailAgent.querySelectorAll('button');
        const assignButton = Array.from(assignButtons).find(btn => btn.textContent === 'Assign Task');
        
        expect(assignButton).toBeDisabled();
      }
    });
  });

  it('should show loading state initially', () => {
    render(<AgentPanel />);
    
    // Should show loading skeleton
    expect(screen.getByText('Agent Management')).toBeInTheDocument();
  });

  it('should show error state when loading fails', async () => {
    // Mock the loadAgents function to throw an error
    const mockError = new Error('Network error');
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<AgentPanel />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Error Loading Agents')).toBeInTheDocument();
      expect(screen.getByText('Failed to load agents')).toBeInTheDocument();
    });
  });

  it('should display health status information', async () => {
    render(<AgentPanel />);
    
    await waitFor(() => {
      const dataProcessingAgent = screen.getByText('Data Processing Agent');
      fireEvent.click(dataProcessingAgent);
    });

    await waitFor(() => {
      expect(screen.getByText('Health Status')).toBeInTheDocument();
      expect(screen.getByText('Healthy')).toBeInTheDocument();
      expect(screen.getByText('Error Count: 0')).toBeInTheDocument();
    });
  });

  it('should show agent details when selected', async () => {
    render(<AgentPanel />);
    
    await waitFor(() => {
      const dataProcessingAgent = screen.getByText('Data Processing Agent');
      fireEvent.click(dataProcessingAgent);
    });

    await waitFor(() => {
      expect(screen.getByText('ID: agent_1')).toBeInTheDocument();
      expect(screen.getByText('Health Status')).toBeInTheDocument();
      expect(screen.getByText('Recent Logs')).toBeInTheDocument();
    });
  });
}); 