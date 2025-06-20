import type { Meta, StoryObj } from '@storybook/nextjs';

import { MetaBox } from '../../models/MetaBox';

import { MetaBoxKanbanView } from './MetaBoxKanbanView';
import { CoreObject } from './types';

const meta: Meta<typeof MetaBoxKanbanView> = {
  title: 'MetaBox/MetaBoxKanbanView',
  component: MetaBoxKanbanView,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    selectedObjectId: {
      control: 'text',
      description: 'ID of the currently selected object',
    },
    draggedObjectId: {
      control: 'text',
      description: 'ID of the object being dragged',
    },
    isDragging: {
      control: 'boolean',
      description: 'Whether an object is currently being dragged',
    },
    canEdit: {
      control: 'boolean',
      description: 'Whether the user can edit objects',
    },
    onObjectSelect: {
      action: 'object selected',
      description: 'Callback when an object is selected',
    },
    onDragStart: {
      action: 'drag started',
      description: 'Callback when dragging starts',
    },
    onDragEnd: {
      action: 'drag ended',
      description: 'Callback when dragging ends',
    },
    onDrop: {
      action: 'dropped',
      description: 'Callback when an object is dropped',
    },
    'data-testid': {
      control: 'text',
      description: 'Test ID for the component',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockMetaBox = new MetaBox({
  name: 'Product Development',
  company_id: 'company_1',
  description: 'Product development workflow',
  phases: [
    {
      id: 'phase_1',
      name: 'Research',
      order: 1,
      metabox_id: 'metabox_1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'phase_2',
      name: 'Design',
      order: 2,
      metabox_id: 'metabox_1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'phase_3',
      name: 'Development',
      order: 3,
      metabox_id: 'metabox_1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'phase_4',
      name: 'Testing',
      order: 4,
      metabox_id: 'metabox_1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ],
});

const mockCoreObjects: CoreObject[] = [
  {
    id: '1',
    title: 'User Research Analysis',
    status: 'completed',
    phase: 'Research',
    priority: 'high',
    assignee: 'Alice Johnson',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    title: 'UI/UX Design System',
    status: 'active',
    phase: 'Design',
    priority: 'urgent',
    assignee: 'Bob Smith',
    created_at: '2024-01-18T09:00:00Z',
    updated_at: '2024-01-22T11:45:00Z',
  },
  {
    id: '3',
    title: 'Frontend Architecture',
    status: 'active',
    phase: 'Development',
    priority: 'high',
    assignee: 'Carol Davis',
    created_at: '2024-01-20T14:00:00Z',
    updated_at: '2024-01-23T16:20:00Z',
  },
  {
    id: '4',
    title: 'API Integration',
    status: 'pending',
    phase: 'Development',
    priority: 'medium',
    assignee: 'David Wilson',
    created_at: '2024-01-21T08:00:00Z',
    updated_at: '2024-01-21T08:00:00Z',
  },
  {
    id: '5',
    title: 'Unit Test Suite',
    status: 'pending',
    phase: 'Testing',
    priority: 'low',
    assignee: 'Eve Brown',
    created_at: '2024-01-22T12:00:00Z',
    updated_at: '2024-01-22T12:00:00Z',
  },
  {
    id: '6',
    title: 'Security Audit',
    status: 'active',
    phase: 'Testing',
    priority: 'urgent',
    assignee: 'Grace Lee',
    created_at: '2024-01-23T09:00:00Z',
    updated_at: '2024-01-24T13:15:00Z',
  },
];

const manyObjects: CoreObject[] = [
  ...mockCoreObjects,
  {
    id: '7',
    title: 'Database Schema Design',
    status: 'completed',
    phase: 'Design',
    priority: 'high',
    assignee: 'Henry Taylor',
    created_at: '2024-01-16T13:00:00Z',
    updated_at: '2024-01-19T17:45:00Z',
  },
  {
    id: '8',
    title: 'Mobile App Development',
    status: 'active',
    phase: 'Development',
    priority: 'urgent',
    assignee: 'Ivy Chen',
    created_at: '2024-01-19T10:00:00Z',
    updated_at: '2024-01-24T14:30:00Z',
  },
  {
    id: '9',
    title: 'User Acceptance Testing',
    status: 'pending',
    phase: 'Testing',
    priority: 'high',
    assignee: 'Jack Anderson',
    created_at: '2024-01-23T15:00:00Z',
    updated_at: '2024-01-23T15:00:00Z',
  },
  {
    id: '10',
    title: 'Deployment Pipeline',
    status: 'active',
    phase: 'Development',
    priority: 'medium',
    assignee: 'Kate Martinez',
    created_at: '2024-01-20T16:00:00Z',
    updated_at: '2024-01-24T10:20:00Z',
  },
];

export const Default: Story = {
  args: {
    metaBox: mockMetaBox,
    coreObjects: mockCoreObjects,
    selectedObjectId: null,
    draggedObjectId: null,
    isDragging: false,
    canEdit: true,
  },
};

export const WithSelection: Story = {
  args: {
    metaBox: mockMetaBox,
    coreObjects: mockCoreObjects,
    selectedObjectId: '2',
    draggedObjectId: null,
    isDragging: false,
    canEdit: true,
  },
};

export const WithDragging: Story = {
  args: {
    metaBox: mockMetaBox,
    coreObjects: mockCoreObjects,
    selectedObjectId: null,
    draggedObjectId: '3',
    isDragging: true,
    canEdit: true,
  },
};

export const ReadOnly: Story = {
  args: {
    metaBox: mockMetaBox,
    coreObjects: mockCoreObjects,
    selectedObjectId: null,
    draggedObjectId: null,
    isDragging: false,
    canEdit: false,
  },
};

export const ManyObjects: Story = {
  args: {
    metaBox: mockMetaBox,
    coreObjects: manyObjects,
    selectedObjectId: null,
    draggedObjectId: null,
    isDragging: false,
    canEdit: true,
  },
};

export const Empty: Story = {
  args: {
    metaBox: mockMetaBox,
    coreObjects: [],
    selectedObjectId: null,
    draggedObjectId: null,
    isDragging: false,
    canEdit: true,
  },
};

export const SingleObject: Story = {
  args: {
    metaBox: mockMetaBox,
    coreObjects: mockCoreObjects.slice(0, 1),
    selectedObjectId: null,
    draggedObjectId: null,
    isDragging: false,
    canEdit: true,
  },
};

export const WithTestId: Story = {
  args: {
    metaBox: mockMetaBox,
    coreObjects: mockCoreObjects,
    selectedObjectId: null,
    draggedObjectId: null,
    isDragging: false,
    canEdit: true,
    'data-testid': 'metabox-kanban-view-test',
  },
}; 