import React, { useEffect, useState } from 'react';

import { WorkspaceLayout, Phase, KanbanColumn, KanbanItem, Agent } from '../components/workspace/WorkspaceLayout';

// Sample data for the demo
const sampleAgents: Agent[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    status: 'online',
    role: 'Research Lead'
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    status: 'busy',
    role: 'Analyst'
  },
  {
    id: '3',
    name: 'Emma Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    status: 'online',
    role: 'Communications'
  }
];

const sarahChen = sampleAgents[0]!;
const mikeJohnson = sampleAgents[1]!;
const emmaDavis = sampleAgents[2]!;

const sampleColumns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To Do',
    items: [],
    phaseId: 'phase-2'
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    items: [],
    phaseId: 'phase-2'
  },
  {
    id: 'completed',
    title: 'Completed',
    items: [],
    phaseId: 'phase-1'
  }
];

const WorkspaceDemo: React.FC = () => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhases = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/phases');
      if (!res.ok) throw new Error('Failed to fetch phases');
      const data = await res.json();
      setPhases(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhases();
  }, []);

  const onAddPhase = async () => {
    const name = window.prompt('Enter phase name:');
    if (!name) return;
    try {
      setLoading(true);
      const res = await fetch('/api/phases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to add phase');
      await fetchPhases();
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading phases...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <WorkspaceLayout
      workspaceType="fundraising"
      title="Fundraising Pipeline"
      phases={phases}
      columns={sampleColumns}
      onAddPhase={onAddPhase}
    />
  );
};

export default WorkspaceDemo; 