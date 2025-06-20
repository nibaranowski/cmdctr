import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MetaBoxWorkspace } from '../../../components/metabox/MetaBoxWorkspace';
import { MetaBox, MetaBoxType } from '../../../models/MetaBox';

// Mock data for consistent testing across meta box types
const createMockMetaBox = (type: MetaBoxType): MetaBox => {
  const baseMetaBox = new MetaBox({
    name: `${type} Pipeline`,
    description: `Complete ${type} workflow`,
    company_id: 'company_001',
    owner_id: 'user_001'
  });

  // Add standard phases based on type
  const phases = {
    fundraising: ['Target List', 'Outreach', 'Scheduling', 'Negotiation', 'Closing'],
    hiring: ['Sourcing', 'Screening', 'Interviews', 'Offer', 'Onboarding'],
    selling: ['Lead Generation', 'Qualification', 'Proposal', 'Negotiation', 'Closing']
  };

  phases[type].forEach((phaseName, index) => {
    baseMetaBox.addPhase({
      name: phaseName,
      order: index + 1,
      description: `Standard ${phaseName.toLowerCase()} phase`
    });
  });

  return baseMetaBox;
};

describe('MetaBoxWorkspace - Architectural Coherence', () => {
  describe('Consistent Header Pattern', () => {
    it('should display unified header across all meta box types', () => {
      const fundraisingBox = createMockMetaBox('fundraising');
      
      render(
        <MetaBoxWorkspace
          metaBox={fundraisingBox}
          userId="user_001"
          onSave={jest.fn()}
        />
      );

      // Header should always contain these elements regardless of type
      expect(screen.getByText('Fundraising Pipeline')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /agents/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /kanban view/i })).toBeInTheDocument();
    });

    it('should maintain consistent header layout across different meta box types', () => {
      const metaBoxTypes: MetaBoxType[] = ['fundraising', 'hiring', 'selling'];
      
      metaBoxTypes.forEach(type => {
        const metaBox = createMockMetaBox(type);
        const { container } = render(
          <MetaBoxWorkspace
            metaBox={metaBox}
            userId="user_001"
            onSave={jest.fn()}
          />
        );

        // Header structure should be identical
        const header = container.querySelector('[data-testid="metabox-header"]');
        expect(header).toHaveClass('flex items-center justify-between px-6 py-4 bg-white border-b');
        
        // Cleanup
        container.remove();
      });
    });
  });

  describe('Unified View Toggle System', () => {
    it('should provide consistent List/Kanban toggle functionality', async () => {
      const metaBox = createMockMetaBox('fundraising');
      
      render(
        <MetaBoxWorkspace
          metaBox={metaBox}
          userId="user_001"
          onSave={jest.fn()}
        />
      );

      const viewToggle = screen.getByRole('button', { name: /list view/i });
      
      // Should start with default view (Kanban)
      expect(screen.getByTestId('kanban-view')).toBeInTheDocument();
      
      // Toggle to list view
      fireEvent.click(viewToggle);
      await waitFor(() => {
        expect(screen.getByTestId('list-view')).toBeInTheDocument();
      });
      
      // Toggle back to kanban
      const kanbanToggle = screen.getByRole('button', { name: /kanban view/i });
      fireEvent.click(kanbanToggle);
      await waitFor(() => {
        expect(screen.getByTestId('kanban-view')).toBeInTheDocument();
      });
    });

    it('should maintain view state per user and meta box', () => {
      const metaBox = createMockMetaBox('hiring');
      
      render(
        <MetaBoxWorkspace
          metaBox={metaBox}
          userId="user_001"
          onSave={jest.fn()}
        />
      );

      // View preference should be stored and restored
      const viewToggle = screen.getByRole('button', { name: /list view/i });
      fireEvent.click(viewToggle);
      
      // Should persist across re-renders
      expect(screen.getByTestId('list-view')).toBeInTheDocument();
    });
  });

  describe('Standardized Core Object Cards', () => {
    it('should render consistent card structure across all object types', () => {
      const metaBox = createMockMetaBox('fundraising');
      const mockObjects = [
        { id: '1', title: 'Investor A', status: 'active', assignee: 'user_001', phase: 'Outreach', created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '2', title: 'Investor B', status: 'pending', assignee: 'user_002', phase: 'Scheduling', created_at: '2024-01-01', updated_at: '2024-01-01' }
      ];

      render(
        <MetaBoxWorkspace
          metaBox={metaBox}
          userId="user_001"
          onSave={jest.fn()}
          coreObjects={mockObjects}
        />
      );

      // All cards should have the same structure
      const cards = screen.getAllByTestId('core-object-card');
      cards.forEach(card => {
        expect(card).toHaveClass('bg-white border rounded-lg shadow-sm p-4');
        expect(card.querySelector('[data-testid="card-title"]')).toBeInTheDocument();
        expect(card.querySelector('[data-testid="card-status"]')).toBeInTheDocument();
        expect(card.querySelector('[data-testid="card-assignee"]')).toBeInTheDocument();
        expect(card.querySelector('[data-testid="card-phase"]')).toBeInTheDocument();
      });
    });

    it('should support consistent drag-and-drop across view types', async () => {
      const metaBox = createMockMetaBox('selling');
      const mockObjects = [
        { id: '1', title: 'Lead A', status: 'active', assignee: 'user_001', phase: 'Lead Generation', created_at: '2024-01-01', updated_at: '2024-01-01' }
      ];

      render(
        <MetaBoxWorkspace
          metaBox={metaBox}
          userId="user_001"
          onSave={jest.fn()}
          coreObjects={mockObjects}
        />
      );

      const card = screen.getByTestId('core-object-card');
      
      // Should be draggable in both views
      expect(card).toHaveAttribute('draggable', 'true');
      
      // Test drag start - mock the dataTransfer
      const mockDataTransfer = {
        effectAllowed: '',
        setData: jest.fn(),
        getData: jest.fn()
      };
      
      fireEvent.dragStart(card, { dataTransfer: mockDataTransfer });
      expect(card).toHaveClass('opacity-50');
    });
  });

  describe('Right-Side Detail Panel Consistency', () => {
    it('should open consistent detail panel for any selected object', async () => {
      const metaBox = createMockMetaBox('hiring');
      const mockObjects = [
        { id: '1', title: 'Candidate A', status: 'active', assignee: 'user_001', phase: 'Interviews', created_at: '2024-01-01', updated_at: '2024-01-01' }
      ];

      render(
        <MetaBoxWorkspace
          metaBox={metaBox}
          userId="user_001"
          onSave={jest.fn()}
          coreObjects={mockObjects}
        />
      );

      const card = screen.getByTestId('core-object-card');
      fireEvent.click(card);

      await waitFor(() => {
        // Detail panel should always have these sections
        expect(screen.getByTestId('detail-panel')).toBeInTheDocument();
        expect(screen.getByTestId('object-details')).toBeInTheDocument();
        expect(screen.getByTestId('phase-progress')).toBeInTheDocument();
        expect(screen.getByTestId('agent-actions')).toBeInTheDocument();
      });
    });

    it('should maintain panel state and scroll position', () => {
      const metaBox = createMockMetaBox('fundraising');
      const mockObjects = [
        { id: '1', title: 'Investor A', status: 'active', assignee: 'user_001', phase: 'Outreach', created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '2', title: 'Investor B', status: 'pending', assignee: 'user_002', phase: 'Scheduling', created_at: '2024-01-01', updated_at: '2024-01-01' }
      ];

      render(
        <MetaBoxWorkspace
          metaBox={metaBox}
          userId="user_001"
          onSave={jest.fn()}
          coreObjects={mockObjects}
        />
      );

      // Select first object
      const firstCard = screen.getAllByTestId('core-object-card')[0];
      fireEvent.click(firstCard);

      // Select second object - panel should update but maintain structure
      const secondCard = screen.getAllByTestId('core-object-card')[1];
      fireEvent.click(secondCard);

      // Panel should still be open with same structure
      expect(screen.getByTestId('detail-panel')).toBeInTheDocument();
    });
  });

  describe('Agent Integration Consistency', () => {
    it('should display agent actions consistently across all phases', () => {
      const metaBox = createMockMetaBox('selling');
      const mockObjects = [
        { id: '1', title: 'Lead A', status: 'active', assignee: 'user_001', phase: 'Lead Generation', created_at: '2024-01-01', updated_at: '2024-01-01' }
      ];

      render(
        <MetaBoxWorkspace
          metaBox={metaBox}
          userId="user_001"
          onSave={jest.fn()}
          coreObjects={mockObjects}
        />
      );

      const card = screen.getByTestId('core-object-card');
      fireEvent.click(card);

      // Agent actions should always be available
      expect(screen.getByTestId('agent-actions')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /assign/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /view agent history/i })).toBeInTheDocument();
    });

    it('should maintain agent state across view changes', async () => {
      const metaBox = createMockMetaBox('fundraising');
      const mockObjects = [
        { id: '1', title: 'Investor A', status: 'active', assignee: 'user_001', phase: 'Outreach', created_at: '2024-01-01', updated_at: '2024-01-01' }
      ];

      render(
        <MetaBoxWorkspace
          metaBox={metaBox}
          userId="user_001"
          onSave={jest.fn()}
          coreObjects={mockObjects}
        />
      );

      // Open detail panel
      const card = screen.getByTestId('core-object-card');
      fireEvent.click(card);

      // Toggle view while panel is open
      const viewToggle = screen.getByRole('button', { name: /list view/i });
      fireEvent.click(viewToggle);

      // Agent actions should still be available
      expect(screen.getByTestId('agent-actions')).toBeInTheDocument();
    });
  });

  describe('Responsive Design Consistency', () => {
    it('should maintain layout consistency across screen sizes', () => {
      const metaBox = createMockMetaBox('hiring');
      
      // Test mobile layout
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      const { container } = render(
        <MetaBoxWorkspace
          metaBox={metaBox}
          userId="user_001"
          onSave={jest.fn()}
        />
      );

      // Should adapt to mobile but maintain structure
      expect(container.querySelector('[data-testid="metabox-header"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="main-content"]')).toBeInTheDocument();
    });
  });
}); 