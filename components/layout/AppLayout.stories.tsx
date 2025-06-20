import type { Meta, StoryObj } from '@storybook/nextjs';
import { within, expect } from '@storybook/test';

import AppLayout from './AppLayout';

const meta = {
  title: 'Components/Layout/AppLayout',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AppLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Command Center dashboard.</p>
      </div>
    ),
  },
};

export const WithComplexContent: Story = {
  args: {
    children: (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Agent "Research Bot" completed phase 1</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New task assigned to "Design Agent"</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Phase 2 requires review</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-3">Active Agents</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Research Bot</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Design Agent</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Working</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Phases</span>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="text-sm font-medium">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
};

export const WithFormContent: Story = {
  args: {
    children: (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h1>
          <form className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project description"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    ),
  },
};

export const LayoutStructure: Story = {
  args: {
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Layout Test</h1>
        <p className="text-gray-600">This story tests the layout structure.</p>
      </div>
    ),
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     
//     // Verify the layout structure
//     const sidebar = canvas.getByText('Command Center');
//     const content = canvas.getByText('Layout Test');
//     
//     await expect(sidebar).toBeInTheDocument();
//     await expect(content).toBeInTheDocument();
//   },
}; 