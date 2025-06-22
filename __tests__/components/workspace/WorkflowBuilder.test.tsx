import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkflowBuilder from '../../../components/workspace/WorkflowBuilder';

// Mock data for triggers and actions
const mockTriggers = [
  { id: 't1', name: 'Phase Change', trigger_type: 'on_phase_change' },
  { id: 't2', name: 'Agent Action', trigger_type: 'on_agent_action' }
];
const mockActions = [
  { id: 'a1', name: 'Send Slack Message', type: 'webhook' },
  { id: 'a2', name: 'Move to Next Phase', type: 'phase_transition' }
];

describe('WorkflowBuilder UI', () => {
  it('renders the builder with no steps', () => {
    render(<WorkflowBuilder triggers={[]} actions={[]} />);
    expect(screen.getByText(/create a new workflow/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add trigger/i })).toBeInTheDocument();
  });

  it('allows adding a trigger and an action', () => {
    render(<WorkflowBuilder triggers={mockTriggers} actions={mockActions} />);
    fireEvent.click(screen.getByRole('button', { name: /add trigger/i }));
    fireEvent.click(screen.getByText(/phase change/i));
    expect(screen.getByText(/if phase change/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /add action/i }));
    fireEvent.click(screen.getByText(/send slack message/i));
    expect(screen.getByText(/then send slack message/i)).toBeInTheDocument();
  });

  it('validates required fields and shows error states', () => {
    render(<WorkflowBuilder triggers={mockTriggers} actions={mockActions} />);
    fireEvent.click(screen.getByRole('button', { name: /save workflow/i }));
    expect(screen.getByText(/please add at least one trigger/i)).toBeInTheDocument();
    expect(screen.getByText(/please add at least one action/i)).toBeInTheDocument();
  });

  it('allows editing and removing steps', () => {
    render(<WorkflowBuilder triggers={mockTriggers} actions={mockActions} />);
    fireEvent.click(screen.getByRole('button', { name: /add trigger/i }));
    fireEvent.click(screen.getByText(/phase change/i));
    fireEvent.click(screen.getByRole('button', { name: /add action/i }));
    fireEvent.click(screen.getByText(/send slack message/i));
    // Remove action
    fireEvent.click(screen.getByRole('button', { name: /remove action/i }));
    expect(screen.queryByText(/then send slack message/i)).not.toBeInTheDocument();
    // Remove trigger
    fireEvent.click(screen.getByRole('button', { name: /remove trigger/i }));
    expect(screen.queryByText(/if phase change/i)).not.toBeInTheDocument();
  });

  it('can open integration settings modal and save settings', () => {
    render(<WorkflowBuilder triggers={mockTriggers} actions={mockActions} />);
    fireEvent.click(screen.getByRole('button', { name: /integration settings/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/webhook url/i), { target: { value: 'https://hooks.slack.com/test' } });
    fireEvent.click(screen.getByRole('button', { name: /save settings/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('can test/run the workflow and show logs/results', () => {
    render(<WorkflowBuilder triggers={mockTriggers} actions={mockActions} />);
    fireEvent.click(screen.getByRole('button', { name: /add trigger/i }));
    fireEvent.click(screen.getByText(/phase change/i));
    fireEvent.click(screen.getByRole('button', { name: /add action/i }));
    fireEvent.click(screen.getByText(/send slack message/i));
    fireEvent.click(screen.getByRole('button', { name: /test workflow/i }));
    expect(screen.getByText(/test results/i)).toBeInTheDocument();
    expect(screen.getByText(/logs/i)).toBeInTheDocument();
  });

  it('is accessible via keyboard and has ARIA labels', () => {
    render(<WorkflowBuilder triggers={mockTriggers} actions={mockActions} />);
    const addTriggerBtn = screen.getByRole('button', { name: /add trigger/i });
    addTriggerBtn.focus();
    expect(addTriggerBtn).toHaveFocus();
    expect(addTriggerBtn).toHaveAttribute('aria-label', 'Add Trigger');
    // Tab to next button
    fireEvent.keyDown(document.activeElement || document.body, { key: 'Tab', code: 'Tab' });
    const addActionBtn = screen.getByRole('button', { name: /add action/i });
    expect(addActionBtn).toBeInTheDocument();
    expect(addActionBtn).toHaveAttribute('aria-label', 'Add Action');
  });
}); 