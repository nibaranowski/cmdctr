import Head from 'next/head'
import React, { useState } from 'react'

import AgentPanel from '../components/AgentPanel'
import AppLayout from '../components/layout/AppLayout'

export default function Agents() {
  const [activeTab, setActiveTab] = useState<'panel' | 'api'>('panel');

  return (
    <>
      <Head>
        <title>Agent Framework - Command Center</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <AppLayout>
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Agent Framework</h2>
              <p className="text-sm text-gray-600">Monitor and manage your AI agents</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('panel')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'panel'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Agent Panel
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'api'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                API Testing
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'panel' ? (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Management Panel</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Monitor and manage your AI agents in real-time. View status, health, logs, and perform quick actions.
                </p>
                <AgentPanel />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">API Testing Interface</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Test the agent lifecycle API endpoints directly from this interface.
                </p>
                <APITestingInterface />
              </div>
            </div>
          )}
        </main>
      </AppLayout>
    </>
  );
}

const APITestingInterface: React.FC = () => {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async (action: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents/lifecycle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...data,
        }),
      });

      const result = await response.json();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Agent Registration</h4>
          <button
            onClick={() => testAPI('register', {
              data: {
                name: 'Test Agent',
                config: { maxRetries: 3, backoffMs: 1000 }
              }
            })}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Register Agent
          </button>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Task Assignment</h4>
          <button
            onClick={() => testAPI('assign', {
              agentId: 'test_agent_123',
              data: {
                taskId: 'task_456',
                taskType: 'data_processing',
                payload: { data: 'test' }
              }
            })}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Assign Task
          </button>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Health Check</h4>
          <button
            onClick={() => testAPI('health', { agentId: 'test_agent_123' })}
            disabled={loading}
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
          >
            Check Health
          </button>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Log Action</h4>
          <button
            onClick={() => testAPI('log', {
              agentId: 'test_agent_123',
              data: {
                action: 'test_action',
                message: 'Test log entry',
                level: 'info'
              }
            })}
            disabled={loading}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            Add Log Entry
          </button>
        </div>
      </div>

      {/* Response Display */}
      <div>
        <h4 className="font-medium text-gray-900 mb-2">API Response</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : response ? (
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">{response}</pre>
          ) : (
            <div className="text-gray-500">Click a button above to test the API</div>
          )}
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">API Documentation</h4>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>POST /api/agents/lifecycle</strong></p>
          <p>All agent lifecycle operations go through this single endpoint with different action types:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>register:</strong> Register a new agent with name and config</li>
            <li><strong>assign:</strong> Assign a task to an agent</li>
            <li><strong>health:</strong> Check agent health status</li>
            <li><strong>log:</strong> Add a log entry for an agent</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 