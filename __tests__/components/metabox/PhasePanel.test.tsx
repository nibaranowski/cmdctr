import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhasePanel from '../../../components/metabox/PhasePanel';
import { fundraisingManifest } from '../../../types/metaBoxManifest';

// Mock the manifest for testing
const mockManifest = {
  ...fundraisingManifest,
  phases: [
    {
      id: 'phase-1',
      name: 'Lead Generation',
      status: 'active' as const,
      agentId: 'agent-1',
      description: 'Generate qualified leads',
    },
    {
      id: 'phase-2',
      name: 'Qualification',
      status: 'pending' as const,
      agentId: 'agent-2',
      description: 'Qualify leads',
    },
  ],
  agents: [
    {
      id: 'agent-1',
      name: 'Lead Agent',
      status: 'online' as const,
      avatarUrl: '/avatars/lead.png',
    },
    {
      id: 'agent-2',
      name: 'Qualification Agent',
      status: 'busy' as const,
      avatarUrl: '/avatars/qualification.png',
    },
  ],
};

describe('PhasePanel', () => {
  const mockOnPhaseAction = jest.fn();
  const mockOnAgentMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders phase panel with header', () => {
    render(<PhasePanel manifest={mockManifest} />);
    
    expect(screen.getByText('Fundraising Pipeline')).toBeInTheDocument();
    expect(screen.getByText('2 phases • 2 agents')).toBeInTheDocument();
  });

  it('renders all phases', () => {
    render(<PhasePanel manifest={mockManifest} />);
    
    expect(screen.getByText('Lead Generation')).toBeInTheDocument();
    expect(screen.getByText('Qualification')).toBeInTheDocument();
  });

  it('shows phase status indicators', () => {
    render(<PhasePanel manifest={mockManifest} />);
    
    const phaseElements = screen.getAllByTestId(/phase-/);
    expect(phaseElements).toHaveLength(2);
  });

  it('shows agent avatars with status indicators', () => {
    render(<PhasePanel manifest={mockManifest} />);
    
    expect(screen.getByText('L')).toBeInTheDocument(); // Lead Agent initial
    expect(screen.getByText('Q')).toBeInTheDocument(); // Qualification Agent initial
  });

  it('expands phase when clicked', async () => {
    const user = userEvent.setup();
    render(<PhasePanel manifest={mockManifest} />);
    
    const expandButton = screen.getByLabelText('Expand Lead Generation phase');
    await user.click(expandButton);
    
    expect(screen.getByText('Lead Agent')).toBeInTheDocument();
    expect(screen.getByText('online')).toBeInTheDocument();
  });

  it('collapses phase when clicked again', async () => {
    const user = userEvent.setup();
    render(<PhasePanel manifest={mockManifest} />);
    
    const expandButton = screen.getByLabelText('Expand Lead Generation phase');
    await user.click(expandButton);
    
    // Should show expanded content
    expect(screen.getByText('Lead Agent')).toBeInTheDocument();
    
    // Click again to collapse
    await user.click(expandButton);
    
    // Should hide expanded content
    expect(screen.queryByText('Lead Agent')).not.toBeInTheDocument();
  });

  it('calls onPhaseAction when phase action buttons are clicked', async () => {
    const user = userEvent.setup();
    render(
      <PhasePanel 
        manifest={mockManifest} 
        onPhaseAction={mockOnPhaseAction}
      />
    );
    
    // Expand phase first
    const expandButton = screen.getByLabelText('Expand Lead Generation phase');
    await user.click(expandButton);
    
    // Click phase action buttons
    const completeButton = screen.getByText('Mark Complete');
    await user.click(completeButton);
    
    expect(mockOnPhaseAction).toHaveBeenCalledWith('phase-1', 'complete');
  });

  it('calls onAgentMessage when message is sent', async () => {
    const user = userEvent.setup();
    render(
      <PhasePanel 
        manifest={mockManifest} 
        onAgentMessage={mockOnAgentMessage}
      />
    );
    
    // Expand phase first
    const expandButton = screen.getByLabelText('Expand Lead Generation phase');
    await user.click(expandButton);
    
    // Type message
    const messageInput = screen.getByPlaceholderText('Ask agent for help...');
    await user.type(messageInput, 'Hello agent!');
    
    // Send message
    const sendButton = screen.getByText('Send');
    await user.click(sendButton);
    
    expect(mockOnAgentMessage).toHaveBeenCalledWith('phase-1', 'Hello agent!');
  });

  it('sends message on Enter key press', async () => {
    const user = userEvent.setup();
    render(
      <PhasePanel 
        manifest={mockManifest} 
        onAgentMessage={mockOnAgentMessage}
      />
    );
    
    // Expand phase first
    const expandButton = screen.getByLabelText('Expand Lead Generation phase');
    await user.click(expandButton);
    
    // Type message and press Enter
    const messageInput = screen.getByPlaceholderText('Ask agent for help...');
    await user.type(messageInput, 'Hello agent!{enter}');
    
    expect(mockOnAgentMessage).toHaveBeenCalledWith('phase-1', 'Hello agent!');
  });

  it('clears message input after sending', async () => {
    const user = userEvent.setup();
    render(
      <PhasePanel 
        manifest={mockManifest} 
        onAgentMessage={mockOnAgentMessage}
      />
    );
    
    // Expand phase first
    const expandButton = screen.getByLabelText('Expand Lead Generation phase');
    await user.click(expandButton);
    
    // Type and send message
    const messageInput = screen.getByPlaceholderText('Ask agent for help...');
    await user.type(messageInput, 'Hello agent!');
    await user.click(screen.getByText('Send'));
    
    // Input should be cleared
    expect(messageInput).toHaveValue('');
  });

  it('disables complete button for completed phases', async () => {
    const user = userEvent.setup();
    const completedManifest = {
      ...mockManifest,
      phases: [
        {
          id: 'phase-1',
          name: 'Lead Generation',
          status: 'complete' as const,
          agentId: 'agent-1',
        }
      ],
    };
    
    render(
      <PhasePanel 
        manifest={completedManifest} 
        onPhaseAction={mockOnPhaseAction}
      />
    );
    
    // Expand phase
    const expandButton = screen.getByLabelText('Expand Lead Generation phase');
    await user.click(expandButton);
    
    // Complete button should be disabled
    const completeButton = screen.getByText('Mark Complete');
    expect(completeButton).toBeDisabled();
  });

  it('disables revert button for pending phases', async () => {
    const user = userEvent.setup();
    render(
      <PhasePanel 
        manifest={mockManifest} 
        onPhaseAction={mockOnPhaseAction}
      />
    );
    
    // Expand the pending phase
    const expandButton = screen.getByLabelText('Expand Qualification phase');
    await user.click(expandButton);
    
    // Revert button should be disabled
    const revertButton = screen.getByText('Revert');
    expect(revertButton).toBeDisabled();
  });

  it('handles empty manifest gracefully', () => {
    const emptyManifest = { ...mockManifest, phases: [], agents: [] };
    render(<PhasePanel manifest={emptyManifest} />);
    
    expect(screen.getByText('Fundraising Pipeline')).toBeInTheDocument();
    expect(screen.getByText('0 phases • 0 agents')).toBeInTheDocument();
  });

  it('handles missing agent gracefully', () => {
    const manifestWithoutAgent = {
      ...mockManifest,
      phases: [
        {
          id: 'phase-1',
          name: 'Lead Generation',
          status: 'active' as const,
          agentId: 'non-existent',
        }
      ],
    };
    
    render(<PhasePanel manifest={manifestWithoutAgent} />);
    
    // Should render without crashing
    expect(screen.getByText('Lead Generation')).toBeInTheDocument();
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    render(<PhasePanel manifest={mockManifest} />);
    
    // Tab to expand button
    await user.tab();
    const expandButton = screen.getByLabelText('Expand Lead Generation phase');
    expect(expandButton).toHaveFocus();
    
    // Press Enter to expand
    await user.keyboard('{Enter}');
    expect(screen.getByText('Lead Agent')).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(<PhasePanel manifest={mockManifest} />);
    
    const expandButton = screen.getByLabelText('Expand Lead Generation phase');
    expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    
    // After expanding
    fireEvent.click(expandButton);
    expect(expandButton).toHaveAttribute('aria-expanded', 'true');
  });
}); 