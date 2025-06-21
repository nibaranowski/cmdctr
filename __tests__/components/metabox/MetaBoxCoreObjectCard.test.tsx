import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MetaBoxCoreObjectCard from '../../../components/metabox/MetaBoxCoreObjectCard';
import { fundraisingManifest } from '../../../types/metaBoxManifest';

const mockCoreObject = {
  id: '1',
  name: 'Test Investor',
  currentPhase: 'sourcing',
  status: 'active',
  assignedAgent: 'ai-research',
  priority: 'high',
  updatedAt: '2024-01-15',
  investmentSize: '$10M',
  sector: 'SaaS',
};

describe('MetaBoxCoreObjectCard', () => {
  const mockOnClick = jest.fn();
  const mockOnDragStart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders core object card with basic information', () => {
    render(
      <MetaBoxCoreObjectCard
        coreObject={mockCoreObject}
        manifest={fundraisingManifest}
      />
    );
    
    // Should only render name once (in header)
    const nameElements = screen.getAllByText('Test Investor');
    expect(nameElements).toHaveLength(1);
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByTestId('core-object-1')).toBeInTheDocument();
  });

  it('renders status field with correct styling', () => {
    render(
      <MetaBoxCoreObjectCard
        coreObject={mockCoreObject}
        manifest={fundraisingManifest}
      />
    );
    
    const statusElement = screen.getByText('active');
    expect(statusElement).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('renders agent field with avatar and name', () => {
    // Create a manifest with agent field in first 3 fields
    const manifestWithAgent = {
      ...fundraisingManifest,
      fields: [
        { key: 'status', label: 'Status', type: 'status' as const, sortable: true, filterable: true },
        { key: 'assignedAgent', label: 'Agent', type: 'agent' as const, sortable: true, filterable: true },
        { key: 'currentPhase', label: 'Phase', type: 'string' as const, sortable: true, filterable: true },
      ],
    };
    
    render(
      <MetaBoxCoreObjectCard
        coreObject={mockCoreObject}
        manifest={manifestWithAgent}
      />
    );
    
    expect(screen.getByText('R')).toBeInTheDocument(); // Research Bot initial
    expect(screen.getByText('Research Bot')).toBeInTheDocument();
  });

  it('handles missing agent gracefully', () => {
    const objectWithoutAgent = { ...mockCoreObject, assignedAgent: 'non-existent' };
    const manifestWithAgent = {
      ...fundraisingManifest,
      fields: [
        { key: 'status', label: 'Status', type: 'status' as const, sortable: true, filterable: true },
        { key: 'assignedAgent', label: 'Agent', type: 'agent' as const, sortable: true, filterable: true },
        { key: 'currentPhase', label: 'Phase', type: 'string' as const, sortable: true, filterable: true },
      ],
    };
    
    render(
      <MetaBoxCoreObjectCard
        coreObject={objectWithoutAgent}
        manifest={manifestWithAgent}
      />
    );
    
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
  });

  it('renders date field in correct format', () => {
    render(
      <MetaBoxCoreObjectCard
        coreObject={mockCoreObject}
        manifest={fundraisingManifest}
      />
    );
    
    expect(screen.getByText('1/15/2024')).toBeInTheDocument();
  });

  it('renders number field with proper formatting', () => {
    const objectWithNumber = { ...mockCoreObject, investmentSize: 10000000 };
    const manifestWithNumber = {
      ...fundraisingManifest,
      fields: [
        { key: 'status', label: 'Status', type: 'status' as const, sortable: true, filterable: true },
        { key: 'investmentSize', label: 'Investment Size', type: 'number' as const, sortable: true, filterable: true },
        { key: 'currentPhase', label: 'Phase', type: 'string' as const, sortable: true, filterable: true },
      ],
    };
    
    render(
      <MetaBoxCoreObjectCard
        coreObject={objectWithNumber}
        manifest={manifestWithNumber}
      />
    );
    
    expect(screen.getByText('10,000,000')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MetaBoxCoreObjectCard
        coreObject={mockCoreObject}
        manifest={fundraisingManifest}
        onClick={mockOnClick}
      />
    );
    
    const card = screen.getByTestId('core-object-1');
    await user.click(card);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onDragStart when dragging starts', () => {
    render(
      <MetaBoxCoreObjectCard
        coreObject={mockCoreObject}
        manifest={fundraisingManifest}
        onDragStart={mockOnDragStart}
      />
    );
    
    const card = screen.getByTestId('core-object-1');
    fireEvent.dragStart(card);
    
    expect(mockOnDragStart).toHaveBeenCalledTimes(1);
  });

  it('applies selected styling when isSelected is true', () => {
    render(
      <MetaBoxCoreObjectCard
        coreObject={mockCoreObject}
        manifest={fundraisingManifest}
        isSelected={true}
      />
    );
    
    const card = screen.getByTestId('core-object-1');
    expect(card).toHaveClass('border-blue-500', 'bg-blue-50');
  });

  it('applies hover styling on mouse enter', () => {
    render(
      <MetaBoxCoreObjectCard
        coreObject={mockCoreObject}
        manifest={fundraisingManifest}
      />
    );
    
    const card = screen.getByTestId('core-object-1');
    expect(card).toHaveClass('hover:shadow-md');
  });

  it('renders priority badge with correct styling', () => {
    render(
      <MetaBoxCoreObjectCard
        coreObject={mockCoreObject}
        manifest={fundraisingManifest}
      />
    );
    
    const priorityBadge = screen.getByText('high');
    expect(priorityBadge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('handles missing priority gracefully', () => {
    const { priority, ...objectWithoutPriority } = mockCoreObject;
    
    render(
      <MetaBoxCoreObjectCard
        coreObject={objectWithoutPriority}
        manifest={fundraisingManifest}
      />
    );
    
    expect(screen.queryByText('high')).not.toBeInTheDocument();
  });

  it('renders fallback title when name is missing', () => {
    const { name, ...objectWithoutName } = mockCoreObject;
    
    render(
      <MetaBoxCoreObjectCard
        coreObject={objectWithoutName}
        manifest={fundraisingManifest}
      />
    );
    
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('renders fallback title when title is used instead of name', () => {
    const { name, ...objectWithoutName } = mockCoreObject;
    const objectWithTitle = { ...objectWithoutName, title: 'Test Title' };
    
    render(
      <MetaBoxCoreObjectCard
        coreObject={objectWithTitle}
        manifest={fundraisingManifest}
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('handles missing updatedAt gracefully', () => {
    const { updatedAt, ...objectWithoutDate } = mockCoreObject;
    
    render(
      <MetaBoxCoreObjectCard
        coreObject={objectWithoutDate}
        manifest={fundraisingManifest}
      />
    );
    
    expect(screen.queryByText('1/15/2024')).not.toBeInTheDocument();
  });

  it('renders custom className when provided', () => {
    render(
      <MetaBoxCoreObjectCard
        coreObject={mockCoreObject}
        manifest={fundraisingManifest}
        className="custom-class"
      />
    );
    
    const card = screen.getByTestId('core-object-1');
    expect(card).toHaveClass('custom-class');
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    render(
      <MetaBoxCoreObjectCard
        coreObject={mockCoreObject}
        manifest={fundraisingManifest}
        onClick={mockOnClick}
      />
    );
    
    const card = screen.getByTestId('core-object-1');
    await user.tab();
    expect(card).toHaveFocus();
    
    await user.keyboard('{Enter}');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('handles different priority levels with correct styling', () => {
    const priorities = [
      { priority: 'high', expectedClass: 'bg-red-100' },
      { priority: 'medium', expectedClass: 'bg-yellow-100' },
      { priority: 'low', expectedClass: 'bg-green-100' },
    ];

    priorities.forEach(({ priority, expectedClass }) => {
      const objectWithPriority = { ...mockCoreObject, priority };
      
      const { unmount } = render(
        <MetaBoxCoreObjectCard
          coreObject={objectWithPriority}
          manifest={fundraisingManifest}
        />
      );
      
      const priorityBadge = screen.getByText(priority);
      expect(priorityBadge).toHaveClass(expectedClass);
      
      unmount();
    });
  });

  it('handles different status levels with correct styling', () => {
    const statuses = [
      { status: 'active', expectedClass: 'bg-green-100' },
      { status: 'complete', expectedClass: 'bg-blue-100' },
      { status: 'pending', expectedClass: 'bg-yellow-100' },
    ];

    statuses.forEach(({ status, expectedClass }) => {
      const objectWithStatus = { ...mockCoreObject, status };
      
      const { unmount } = render(
        <MetaBoxCoreObjectCard
          coreObject={objectWithStatus}
          manifest={fundraisingManifest}
        />
      );
      
      const statusElement = screen.getByText(status);
      expect(statusElement).toHaveClass(expectedClass);
      
      unmount();
    });
  });
}); 