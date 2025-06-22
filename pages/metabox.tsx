import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MetaBox, META_BOX_TEMPLATES, MetaBoxType } from '../models/MetaBox';
import { MetaBoxEditor } from '../components/metabox/MetaBoxEditor';
import { MetaBoxWorkspace } from '../components/metabox/MetaBoxWorkspace';

interface MetaBoxPageProps {
  user: {
    id: string;
    company_id: string;
  };
}

const MetaBoxPage: React.FC<MetaBoxPageProps> = ({ user }) => {
  const router = useRouter();
  const [metaBoxes, setMetaBoxes] = useState<MetaBox[]>([]);
  const [selectedMetaBox, setSelectedMetaBox] = useState<MetaBox | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'editor' | 'workspace'>('list');

  // Load meta boxes on component mount
  useEffect(() => {
    loadMetaBoxes();
  }, []);

  const loadMetaBoxes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/metabox?company_id=${user.company_id}&user_id=${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to load meta boxes');
      }

      const data = await response.json();
      setMetaBoxes(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meta boxes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMetaBox = async (templateType: MetaBoxType) => {
    try {
      const template = META_BOX_TEMPLATES[templateType];
      const newMetaBox = new MetaBox({
        name: `${template.name} Pipeline`,
        description: template.description,
        company_id: user.company_id,
        owner_id: user.id
      });

      // Apply template phases
      newMetaBox.applyTemplate({
        name: template.name,
        description: template.description,
        phases: template.default_phases.map((phaseName, index) => ({
          id: `phase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: phaseName,
          order: index + 1,
          description: `Default ${phaseName.toLowerCase()} phase`,
          metabox_id: newMetaBox.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
      });

      const response = await fetch('/api/metabox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMetaBox),
      });

      if (!response.ok) {
        throw new Error('Failed to create meta box');
      }

      const data = await response.json();
      setMetaBoxes(prev => [...prev, data.data]);
      setSelectedMetaBox(data.data);
      setViewMode('editor');
      setIsCreating(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create meta box');
    }
  };

  const handleSaveMetaBox = async (metaBox: MetaBox) => {
    try {
      const response = await fetch('/api/metabox', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...metaBox,
          user_id: user.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save meta box');
      }

      const data = await response.json();
      setMetaBoxes(prev => prev.map(mb => mb.id === metaBox.id ? data.data : mb));
      setSelectedMetaBox(data.data);
      setViewMode('workspace');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save meta box');
    }
  };

  const handleDeleteMetaBox = async (metaBoxId: string) => {
    if (!window.confirm('Are you sure you want to delete this meta box? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/metabox', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: metaBoxId,
          user_id: user.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete meta box');
      }

      setMetaBoxes(prev => prev.filter(mb => mb.id !== metaBoxId));
      if (selectedMetaBox?.id === metaBoxId) {
        setSelectedMetaBox(null);
        setViewMode('list');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete meta box');
    }
  };

  const handlePhaseAction = (phaseId: string, action: 'complete' | 'revert' | 'trigger') => {
    console.log(`Phase action: ${action} on phase ${phaseId}`);
    // Implement phase action logic
  };

  const handleAgentMessage = (phaseId: string, message: string) => {
    console.log(`Agent message for phase ${phaseId}: ${message}`);
    // Implement agent message logic
  };

  const handleObjectSelect = (objectId: string) => {
    console.log(`Selected object: ${objectId}`);
    // Implement object selection logic
  };

  const handleObjectMove = (objectId: string, fromPhase: string, toPhase: string) => {
    console.log(`Moving object ${objectId} from ${fromPhase} to ${toPhase}`);
    // Implement object move logic
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadMetaBoxes}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // MetaBox Editor View
  if (viewMode === 'editor' && selectedMetaBox) {
    return (
      <div className="h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setViewMode('list');
                  setSelectedMetaBox(null);
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Edit Meta Box</h1>
            </div>
          </div>
        </div>
        
        <MetaBoxEditor
          metaBox={selectedMetaBox}
          onSave={handleSaveMetaBox}
          onCancel={() => {
            setViewMode('list');
            setSelectedMetaBox(null);
          }}
          companyId={user.company_id}
          userId={user.id}
        />
      </div>
    );
  }

  // MetaBox Workspace View
  if (viewMode === 'workspace' && selectedMetaBox) {
    // Convert MetaBox to MetaBoxManifest for the workspace
    const manifest = {
      id: selectedMetaBox.id,
      name: selectedMetaBox.name,
      description: selectedMetaBox.description || '',
      phases: selectedMetaBox.phases.map(phase => ({
        id: phase.id,
        name: phase.name,
        description: phase.description || '',
        status: 'active',
        order: phase.order
      })),
      agents: [], // TODO: Add agents from the system
      fields: [
        { key: 'name', label: 'Name', type: 'text', sortable: true },
        { key: 'status', label: 'Status', type: 'status', sortable: true },
        { key: 'priority', label: 'Priority', type: 'text', sortable: true },
        { key: 'assignedAgent', label: 'Assigned Agent', type: 'agent', sortable: true }
      ]
    };

    return (
      <div className="h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setViewMode('list');
                  setSelectedMetaBox(null);
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">{selectedMetaBox.name}</h1>
            </div>
            <button
              onClick={() => setViewMode('editor')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>
          </div>
        </div>
        
        <MetaBoxWorkspace
          manifest={manifest}
          onPhaseAction={handlePhaseAction}
          onAgentMessage={handleAgentMessage}
          onObjectSelect={handleObjectSelect}
          onObjectMove={handleObjectMove}
        />
      </div>
    );
  }

  // MetaBox List View
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meta Boxes</h1>
            <p className="text-gray-600 mt-2">Manage your workflow templates and processes</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Meta Box
          </button>
        </div>

        {/* Template Selection Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Choose a Template</h3>
                <div className="space-y-3">
                  {Object.entries(META_BOX_TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => handleCreateMetaBox(key as MetaBoxType)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          {template.default_phases.length} phases
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meta Boxes Grid */}
        {metaBoxes.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No meta boxes</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first meta box.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Meta Box
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metaBoxes.map((metaBox) => (
              <div
                key={metaBox.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{metaBox.name}</h3>
                      {metaBox.description && (
                        <p className="text-sm text-gray-600 mb-4">{metaBox.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{metaBox.phases.length} phases</span>
                        <span>Created {new Date(metaBox.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMetaBox(metaBox);
                          setViewMode('workspace');
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded"
                        title="Open workspace"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMetaBox(metaBox);
                          setViewMode('editor');
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteMetaBox(metaBox.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaBoxPage; 