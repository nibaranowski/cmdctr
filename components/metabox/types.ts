export interface CoreObject {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'completed' | 'archived';
  phase: string;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  assignee?: string;
  created_at: string;
  updated_at: string;
} 