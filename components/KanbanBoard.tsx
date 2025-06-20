import React, { useState } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
}

interface KanbanBoardProps {
  tasks?: Task[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks = [] }) => {
  const [boardTasks, setBoardTasks] = useState<Task[]>(tasks);

  const columns = [
    { id: 'todo' as const, title: 'To Do', color: 'bg-gray-100' },
    { id: 'in-progress' as const, title: 'In Progress', color: 'bg-blue-100' },
    { id: 'done' as const, title: 'Done', color: 'bg-green-100' },
  ];

  const getTasksByStatus = (status: Task['status']) => {
    return boardTasks.filter(task => task.status === status);
  };

  return (
    <div className="flex gap-4 p-4" role="region" aria-label="Kanban board">
      {columns.map(column => (
        <div 
          key={column.id} 
          className={`flex-1 ${column.color} rounded-lg p-4`}
          role="region"
          aria-label={`${column.title} column`}
        >
          <h3 className="font-semibold mb-4">{column.title}</h3>
          <div className="space-y-2">
            {getTasksByStatus(column.id).map(task => (
              <div 
                key={task.id} 
                className="bg-white p-3 rounded shadow"
                role="article"
                aria-labelledby={`task-${task.id}-title`}
              >
                <h4 id={`task-${task.id}-title`} className="font-medium">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 