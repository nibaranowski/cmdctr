import React from 'react';

import { KanbanBoard } from './KanbanBoard';
import { LeftPanel } from './LeftPanel';
import { PhaseSidebar } from './PhaseSidebar';

interface WorkspaceLayoutProps {
  workspaceType: 'fundraising' | 'hiring' | 'marketing' | 'product' | 'selling';
  title: string;
  phases: Phase[];
  columns: KanbanColumn[];
  onAddPhase?: () => void;
}

export interface Phase {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'pending';
  agents: Agent[];
  metrics: PhaseMetrics;
  quickActions: QuickAction[];
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  role: string;
}

export interface PhaseMetrics {
  totalItems: number;
  completedItems: number;
  inProgressItems: number;
  blockedItems: number;
}

export interface QuickAction {
  id: string;
  name: string;
  icon: string;
  action: () => void;
}

export interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
  phaseId?: string;
}

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: Agent;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  workspaceType,
  title,
  phases,
  columns,
  onAddPhase,
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Optional/Navigation */}
      <LeftPanel workspaceType={workspaceType} />
      
      {/* Center/Main Panel - Kanban Board */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <KanbanBoard 
            title={title}
            columns={columns}
            workspaceType={workspaceType}
          />
        </div>
      </div>
      
      {/* Right Sidebar - Phase Overview */}
      <PhaseSidebar phases={phases} workspaceType={workspaceType} onAddPhase={onAddPhase} />
    </div>
  );
}; 