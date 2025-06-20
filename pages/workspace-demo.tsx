import React from 'react';

import { KanbanBoard, KanbanColumn as KanbanColumnType, KanbanCard as KanbanCardType } from '../components/workspace/KanbanBoard';

// Demo data
const demoColumns: KanbanColumnType[] = [
  { id: 'col-1', title: 'To Do', order: 1, color: '#3B82F6' },
  { id: 'col-2', title: 'In Progress', order: 2, color: '#F59E0B' },
  { id: 'col-3', title: 'Done', order: 3, color: '#10B981' }
];

const demoCards: KanbanCardType[] = [
  {
    id: 'card-1',
    title: 'Implement drag and drop',
    description: 'Add drag and drop functionality to the Kanban board',
    status: 'todo',
    priority: 'high',
    columnId: 'col-1',
    tags: ['feature', 'ui'],
    assignee: 'John Doe',
    dueDate: '2024-01-15'
  },
  {
    id: 'card-2',
    title: 'Add keyboard navigation',
    description: 'Implement keyboard shortcuts for navigation',
    status: 'in-progress',
    priority: 'medium',
    columnId: 'col-2',
    tags: ['accessibility'],
    assignee: 'Jane Smith',
    dueDate: '2024-01-20'
  },
  {
    id: 'card-3',
    title: 'Write tests',
    description: 'Add comprehensive test coverage',
    status: 'done',
    priority: 'low',
    columnId: 'col-3',
    tags: ['testing'],
    assignee: 'Bob Johnson',
    dueDate: '2024-01-10'
  }
];

export default function WorkspaceDemo() {
  const handleCardMove = async (cardId: string, targetColumnId: string, position: number) => {
    console.log('Moving card:', cardId, 'to column:', targetColumnId, 'at position:', position);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const handleCardCreate = async (columnId: string, card: Omit<KanbanCardType, 'id'>) => {
    console.log('Creating card in column:', columnId, card);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const handleCardUpdate = async (cardId: string, updates: Partial<KanbanCardType>) => {
    console.log('Updating card:', cardId, updates);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const handleCardDelete = async (cardId: string) => {
    console.log('Deleting card:', cardId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const handleColumnReorder = async (columnId: string, newOrder: number) => {
    console.log('Reordering column:', columnId, 'to order:', newOrder);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const handleCardSelect = (cardId: string) => {
    console.log('Selected card:', cardId);
  };

  return (
    <div className="h-screen bg-gray-50">
      <KanbanBoard
        columns={demoColumns}
        cards={demoCards}
        onCardMove={handleCardMove}
        onCardCreate={handleCardCreate}
        onCardUpdate={handleCardUpdate}
        onCardDelete={handleCardDelete}
        onColumnReorder={handleColumnReorder}
        onCardSelect={handleCardSelect}
      />
    </div>
  );
} 