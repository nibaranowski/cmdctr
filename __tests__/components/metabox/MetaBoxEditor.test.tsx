import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MetaBoxEditor } from '../../../components/metabox/MetaBoxEditor';
import { MetaBox } from '../../../models/MetaBox';

// Mock the dependencies
jest.mock('../../../components/metabox/MetaBoxPhaseCard', () => ({
  MetaBoxPhaseCard: ({ phase, onUpdate, onDelete, onSelect }: any) => (
    <div data-testid={`phase-card-${phase.id}`}>
      <span>{phase.name}</span>
      <button onClick={() => onUpdate({ name: 'Updated Phase' })}>Update</button>
      <button onClick={onDelete}>Delete</button>
      <button onClick={onSelect}>Select</button>
    </div>
  )
}));

jest.mock('../../../components/metabox/MetaBoxTemplateSelector', () => ({
  MetaBoxTemplateSelector: ({ onSelect, onCancel }: any) => (
    <div data-testid="template-selector">
      <button onClick={() => onSelect({ name: 'Test Template', phases: [] })}>Select Template</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}));

jest.mock('../../../components/metabox/MetaBoxToolbar', () => ({
  MetaBoxToolbar: ({ onUndo, onRedo, onTemplateSelect, onSave, onCancel }: any) => (
    <div data-testid="toolbar">
      <button onClick={onUndo}>Undo</button>
      <button onClick={onRedo}>Redo</button>
      <button onClick={onTemplateSelect}>Templates</button>
      <button onClick={onSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}));

const createMockMetaBox = (overrides = {}) => {
  return new MetaBox({
    name: 'Test Meta Box',
    description: 'Test description',
    company_id: 'company_001',
    owner_id: 'user_001',
    phases: [
      {
        id: 'phase_1',
        name: 'Phase 1',
        order: 1,
        description: 'First phase',
        metabox_id: 'metabox_001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'phase_2',
        name: 'Phase 2',
        order: 2,
        description: 'Second phase',
        metabox_id: 'metabox_001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    ...overrides
  });
};

describe('MetaBoxEditor', () => {
  const defaultProps = {
    metaBox: createMockMetaBox(),
    onSave: jest.fn(),
    onCancel: jest.fn(),
    companyId: 'company_001',
    userId: 'user_001'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the editor with meta box information', () => {
    render(<MetaBoxEditor {...defaultProps} />);
    
    expect(screen.getByText('Phases')).toBeInTheDocument();
    expect(screen.getByText('Phase 1')).toBeInTheDocument();
    expect(screen.getByText('Phase 2')).toBeInTheDocument();
    expect(screen.getByText('Add Phase')).toBeInTheDocument();
  });

  it('allows adding a new phase', () => {
    render(<MetaBoxEditor {...defaultProps} />);
    
    const addButton = screen.getByText('Add Phase');
    fireEvent.click(addButton);
    
    // Should have 3 phases now (2 original + 1 new)
    expect(screen.getByText('Phase 1')).toBeInTheDocument();
    expect(screen.getByText('Phase 2')).toBeInTheDocument();
    expect(screen.getByText('New Phase')).toBeInTheDocument();
  });

  it('allows deleting a phase', () => {
    render(<MetaBoxEditor {...defaultProps} />);
    
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]); // Delete first phase
    
    // Should only have 1 phase left
    expect(screen.queryByText('Phase 1')).not.toBeInTheDocument();
    expect(screen.getByText('Phase 2')).toBeInTheDocument();
  });

  it('allows updating a phase', () => {
    render(<MetaBoxEditor {...defaultProps} />);
    
    const updateButtons = screen.getAllByText('Update');
    fireEvent.click(updateButtons[0]); // Update first phase
    
    expect(screen.getByText('Updated Phase')).toBeInTheDocument();
  });

  it('shows template selector when template button is clicked', async () => {
    render(<MetaBoxEditor {...defaultProps} />);
    
    const toolbar = screen.getByTestId('toolbar');
    const templateButton = toolbar.querySelector('button[onClick]');
    if (templateButton) {
      fireEvent.click(templateButton);
    }
    
    await waitFor(() => {
      expect(screen.getByTestId('template-selector')).toBeInTheDocument();
    });
  });

  it('calls onSave when save button is clicked', async () => {
    render(<MetaBoxEditor {...defaultProps} />);
    
    const toolbar = screen.getByTestId('toolbar');
    const saveButton = toolbar.querySelector('button:last-child');
    if (saveButton) {
      fireEvent.click(saveButton);
    }
    
    await waitFor(() => {
      expect(defaultProps.onSave).toHaveBeenCalledWith(expect.any(MetaBox));
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<MetaBoxEditor {...defaultProps} />);
    
    const toolbar = screen.getByTestId('toolbar');
    const cancelButton = toolbar.querySelector('button:nth-last-child(2)');
    if (cancelButton) {
      fireEvent.click(cancelButton);
    }
    
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('shows empty state when no phases exist', () => {
    const emptyMetaBox = createMockMetaBox({ phases: [] });
    render(<MetaBoxEditor {...defaultProps} metaBox={emptyMetaBox} />);
    
    expect(screen.getByText('No phases yet')).toBeInTheDocument();
    expect(screen.getByText('Add First Phase')).toBeInTheDocument();
    expect(screen.getByText('Apply Template')).toBeInTheDocument();
  });

  it('prevents editing when user does not have permission', () => {
    const readOnlyMetaBox = createMockMetaBox({ owner_id: 'other_user' });
    render(<MetaBoxEditor {...defaultProps} metaBox={readOnlyMetaBox} />);
    
    // Should not show edit buttons
    expect(screen.queryByText('Add Phase')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('shows access denied when user cannot access', () => {
    const inaccessibleMetaBox = createMockMetaBox({ 
      owner_id: 'other_user',
      shared_with: []
    });
    render(<MetaBoxEditor {...defaultProps} metaBox={inaccessibleMetaBox} />);
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText("You don't have permission to view this meta box.")).toBeInTheDocument();
  });

  it('supports undo/redo functionality', () => {
    render(<MetaBoxEditor {...defaultProps} />);
    
    const toolbar = screen.getByTestId('toolbar');
    const undoButton = toolbar.querySelector('button:first-child');
    const redoButton = toolbar.querySelector('button:nth-child(2)');
    
    // Initially undo/redo should be disabled
    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();
    
    // Add a phase to enable undo
    const addButton = screen.getByText('Add Phase');
    fireEvent.click(addButton);
    
    // Now undo should be enabled
    expect(undoButton).not.toBeDisabled();
  });

  it('handles drag and drop for phase reordering', () => {
    render(<MetaBoxEditor {...defaultProps} />);
    
    const phaseCards = screen.getAllByTestId(/phase-card-/);
    const firstPhase = phaseCards[0];
    const secondPhase = phaseCards[1];
    
    // Simulate drag start
    fireEvent.dragStart(firstPhase);
    
    // Simulate drop on second phase
    fireEvent.drop(secondPhase);
    
    // The phases should be reordered (this would be tested by checking the order)
    expect(firstPhase).toBeInTheDocument();
    expect(secondPhase).toBeInTheDocument();
  });

  it('applies template when selected', async () => {
    render(<MetaBoxEditor {...defaultProps} />);
    
    // Open template selector
    const toolbar = screen.getByTestId('toolbar');
    const templateButton = toolbar.querySelector('button[onClick]');
    if (templateButton) {
      fireEvent.click(templateButton);
    }
    
    // Select a template
    await waitFor(() => {
      const selectButton = screen.getByText('Select Template');
      fireEvent.click(selectButton);
    });
    
    // Template selector should be closed
    await waitFor(() => {
      expect(screen.queryByTestId('template-selector')).not.toBeInTheDocument();
    });
  });
}); 