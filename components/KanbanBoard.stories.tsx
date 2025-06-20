import type { Meta, StoryObj } from '@storybook/nextjs';

import { KanbanBoard, Task } from './KanbanBoard';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Workspace/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    tasks: {
      control: 'object',
      description: 'Array of tasks to display on the board',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design System Update',
    description: 'Update the design system with new components',
    status: 'todo',
  },
  {
    id: '2',
    title: 'API Integration',
    description: 'Integrate the new API endpoints',
    status: 'in-progress',
  },
  {
    id: '3',
    title: 'User Testing',
    description: 'Conduct user testing sessions',
    status: 'done',
  },
  {
    id: '4',
    title: 'Performance Optimization',
    description: 'Optimize the application performance',
    status: 'todo',
  },
  {
    id: '5',
    title: 'Documentation Update',
    description: 'Update the technical documentation',
    status: 'in-progress',
  },
];

export const Default: Story = {
  args: {
    tasks: mockTasks,
  },
};

export const Empty: Story = {
  args: {
    tasks: [],
  },
};

export const TodoHeavy: Story = {
  args: {
    tasks: [
      {
        id: '1',
        title: 'Task 1',
        description: 'First task to do',
        status: 'todo',
      },
      {
        id: '2',
        title: 'Task 2',
        description: 'Second task to do',
        status: 'todo',
      },
      {
        id: '3',
        title: 'Task 3',
        description: 'Third task to do',
        status: 'todo',
      },
      {
        id: '4',
        title: 'Task 4',
        description: 'Fourth task to do',
        status: 'todo',
      },
    ],
  },
};

export const InProgressHeavy: Story = {
  args: {
    tasks: [
      {
        id: '1',
        title: 'Active Task 1',
        description: 'Currently working on this',
        status: 'in-progress',
      },
      {
        id: '2',
        title: 'Active Task 2',
        description: 'Another active task',
        status: 'in-progress',
      },
      {
        id: '3',
        title: 'Active Task 3',
        description: 'Third active task',
        status: 'in-progress',
      },
    ],
  },
};

export const DoneHeavy: Story = {
  args: {
    tasks: [
      {
        id: '1',
        title: 'Completed Task 1',
        description: 'Successfully completed',
        status: 'done',
      },
      {
        id: '2',
        title: 'Completed Task 2',
        description: 'Another completed task',
        status: 'done',
      },
      {
        id: '3',
        title: 'Completed Task 3',
        description: 'Third completed task',
        status: 'done',
      },
      {
        id: '4',
        title: 'Completed Task 4',
        description: 'Fourth completed task',
        status: 'done',
      },
      {
        id: '5',
        title: 'Completed Task 5',
        description: 'Fifth completed task',
        status: 'done',
      },
    ],
  },
};

export const LongTaskTitles: Story = {
  args: {
    tasks: [
      {
        id: '1',
        title: 'This is a very long task title that might wrap to multiple lines and test the layout',
        description: 'A task with a very long title to test how the component handles text overflow',
        status: 'todo',
      },
      {
        id: '2',
        title: 'Another extremely long task title that goes on and on and on',
        description: 'Another task with a long title to test layout',
        status: 'in-progress',
      },
      {
        id: '3',
        title: 'Short title',
        description: 'This task has a short title but a very long description that might wrap to multiple lines and test how the component handles long descriptions in the task cards',
        status: 'done',
      },
    ],
  },
}; 