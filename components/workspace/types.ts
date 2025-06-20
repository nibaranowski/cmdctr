export interface KanbanCard {
    id: string;
    title: string;
    columnId: string;
    description?: string;
    priority: 'urgent' | 'high' | 'medium' | 'low';
    assignee?: string;
    tags?: string[];
    dueDate?: string;
  } 