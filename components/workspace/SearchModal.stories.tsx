import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { SearchModal } from './SearchModal';
import { KanbanCard } from './types';

const meta: Meta<typeof SearchModal> = {
  title: 'Workspace/SearchModal',
  component: SearchModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the search modal is open',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when modal is closed',
    },
    onCardSelect: {
      action: 'card selected',
      description: 'Callback when a card is selected',
    },
    'data-testid': {
      control: 'text',
      description: 'Test ID for the modal',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockCards: KanbanCard[] = [
  {
    id: '1',
    title: 'Design System Update',
    columnId: 'todo',
    description: 'Update the design system with new components and improve consistency',
    priority: 'high',
    assignee: 'Alice Johnson',
    tags: ['design', 'ui', 'system'],
    dueDate: '2024-02-15',
  },
  {
    id: '2',
    title: 'API Integration',
    columnId: 'in-progress',
    description: 'Integrate the new API endpoints for user management',
    priority: 'urgent',
    assignee: 'Bob Smith',
    tags: ['api', 'backend', 'integration'],
    dueDate: '2024-02-10',
  },
  {
    id: '3',
    title: 'User Testing',
    columnId: 'done',
    description: 'Conduct user testing sessions and gather feedback',
    priority: 'medium',
    assignee: 'Carol Davis',
    tags: ['testing', 'user-research', 'feedback'],
    dueDate: '2024-02-08',
  },
  {
    id: '4',
    title: 'Performance Optimization',
    columnId: 'todo',
    description: 'Optimize the application performance and reduce load times',
    priority: 'high',
    assignee: 'David Wilson',
    tags: ['performance', 'optimization', 'speed'],
    dueDate: '2024-02-20',
  },
  {
    id: '5',
    title: 'Documentation Update',
    columnId: 'in-progress',
    description: 'Update the technical documentation and API docs',
    priority: 'low',
    assignee: 'Eve Brown',
    tags: ['documentation', 'docs', 'technical'],
    dueDate: '2024-02-25',
  },
  {
    id: '6',
    title: 'Bug Fixes',
    columnId: 'todo',
    description: 'Fix critical bugs in the authentication system',
    priority: 'urgent',
    assignee: 'Frank Miller',
    tags: ['bug-fix', 'auth', 'critical'],
    dueDate: '2024-02-05',
  },
  {
    id: '7',
    title: 'Feature Implementation',
    columnId: 'in-progress',
    description: 'Implement new dashboard features for analytics',
    priority: 'medium',
    assignee: 'Grace Lee',
    tags: ['feature', 'dashboard', 'analytics'],
    dueDate: '2024-02-18',
  },
  {
    id: '8',
    title: 'Code Review',
    columnId: 'done',
    description: 'Review pull requests and provide feedback',
    priority: 'low',
    assignee: 'Henry Taylor',
    tags: ['code-review', 'pr', 'feedback'],
    dueDate: '2024-02-12',
  },
];

// Wrapper component to handle state
const SearchModalWrapper = ({ isOpen, onClose, cards, onCardSelect, ...props }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  const handleClose = () => {
    setIsModalOpen(false);
    onClose();
  };

  const handleCardSelect = (cardId: string) => {
    onCardSelect(cardId);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Open Search Modal
      </button>
      <SearchModal
        isOpen={isModalOpen}
        onClose={handleClose}
        cards={cards}
        onCardSelect={handleCardSelect}
        {...props}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <SearchModalWrapper {...args} />,
  args: {
    cards: mockCards,
  },
};

export const Empty: Story = {
  render: (args) => <SearchModalWrapper {...args} />,
  args: {
    cards: [],
  },
};

export const SingleCard: Story = {
  render: (args) => <SearchModalWrapper {...args} />,
  args: {
    cards: [mockCards[0]],
  },
};

export const ManyCards: Story = {
  render: (args) => <SearchModalWrapper {...args} />,
  args: {
    cards: [
      ...mockCards,
      {
        id: '9',
        title: 'Mobile App Development',
        columnId: 'todo',
        description: 'Develop mobile app for iOS and Android',
        priority: 'high',
        assignee: 'Ivy Chen',
        tags: ['mobile', 'ios', 'android'],
        dueDate: '2024-03-01',
      },
      {
        id: '10',
        title: 'Database Migration',
        columnId: 'in-progress',
        description: 'Migrate from MySQL to PostgreSQL',
        priority: 'urgent',
        assignee: 'Jack Anderson',
        tags: ['database', 'migration', 'postgresql'],
        dueDate: '2024-02-28',
      },
      {
        id: '11',
        title: 'Security Audit',
        columnId: 'todo',
        description: 'Conduct comprehensive security audit',
        priority: 'high',
        assignee: 'Kate Martinez',
        tags: ['security', 'audit', 'compliance'],
        dueDate: '2024-03-05',
      },
      {
        id: '12',
        title: 'Deployment Automation',
        columnId: 'done',
        description: 'Automate deployment pipeline with CI/CD',
        priority: 'medium',
        assignee: 'Liam O\'Connor',
        tags: ['deployment', 'automation', 'ci-cd'],
        dueDate: '2024-02-14',
      },
    ],
  },
};

export const WithTestId: Story = {
  render: (args) => <SearchModalWrapper {...args} />,
  args: {
    cards: mockCards,
    'data-testid': 'search-modal-test',
  },
}; 