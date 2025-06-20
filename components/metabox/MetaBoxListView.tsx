import React, { useState, useMemo } from 'react';

import { MetaBox } from '../../models/MetaBox';

import { CoreObjectCard } from './CoreObjectCard';
import { CoreObject } from './types';

interface MetaBoxListViewProps {
  metaBox: MetaBox;
  coreObjects: CoreObject[];
  selectedObjectId: string | null;
  canEdit: boolean;
  onObjectSelect: (objectId: string) => void;
  onObjectUpdate?: (objectId: string, updates: Partial<CoreObject>) => Promise<void>;
  onObjectDelete?: (objectId: string) => Promise<void>;
  'data-testid'?: string;
}

type SortField = 'title' | 'status' | 'phase' | 'assignee' | 'created_at' | 'updated_at';
type SortDirection = 'asc' | 'desc';

export const MetaBoxListView: React.FC<MetaBoxListViewProps> = ({
  metaBox,
  coreObjects,
  selectedObjectId,
  canEdit,
  onObjectSelect,
  onObjectUpdate,
  onObjectDelete,
  'data-testid': dataTestId
}) => {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterPhase, setFilterPhase] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Sort and filter objects
  const sortedAndFilteredObjects = useMemo(() => {
    let filtered = [...coreObjects];

    // Apply filters
    if (filterPhase !== 'all') {
      filtered = filtered.filter(obj => obj.phase === filterPhase);
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(obj => obj.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle date fields
      if (sortField === 'created_at' || sortField === 'updated_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string fields
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [coreObjects, sortField, sortDirection, filterPhase, filterStatus]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="flex-1 overflow-hidden" data-testid={dataTestId}>
      {/* Filters and Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Phase Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Phase</label>
              <select
                value={filterPhase}
                onChange={(e) => setFilterPhase(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Phases</option>
                {metaBox.phases.map((phase) => (
                  <option key={phase.id} value={phase.name}>{phase.name}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {sortedAndFilteredObjects.length} of {coreObjects.length} items
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
            <div className="col-span-4">
              <button
                onClick={() => handleSort('title')}
                className="flex items-center space-x-1 hover:text-gray-900"
              >
                <span>Title</span>
                {getSortIcon('title')}
              </button>
            </div>
            <div className="col-span-2">
              <button
                onClick={() => handleSort('status')}
                className="flex items-center space-x-1 hover:text-gray-900"
              >
                <span>Status</span>
                {getSortIcon('status')}
              </button>
            </div>
            <div className="col-span-2">
              <button
                onClick={() => handleSort('phase')}
                className="flex items-center space-x-1 hover:text-gray-900"
              >
                <span>Phase</span>
                {getSortIcon('phase')}
              </button>
            </div>
            <div className="col-span-2">
              <button
                onClick={() => handleSort('assignee')}
                className="flex items-center space-x-1 hover:text-gray-900"
              >
                <span>Assignee</span>
                {getSortIcon('assignee')}
              </button>
            </div>
            <div className="col-span-2">
              <button
                onClick={() => handleSort('updated_at')}
                className="flex items-center space-x-1 hover:text-gray-900"
              >
                <span>Updated</span>
                {getSortIcon('updated_at')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto">
        {sortedAndFilteredObjects.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">No items found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedAndFilteredObjects.map((object) => (
              <div
                key={object.id}
                className={`px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedObjectId === object.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => onObjectSelect(object.id)}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Title */}
                  <div className="col-span-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {object.title}
                      </h3>
                      {object.priority && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          object.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          object.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          object.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {object.priority}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      object.status === 'active' ? 'bg-green-100 text-green-800' :
                      object.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      object.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {object.status}
                    </span>
                  </div>

                  {/* Phase */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-900">{object.phase}</span>
                  </div>

                  {/* Assignee */}
                  <div className="col-span-2">
                    {object.assignee ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-700">
                            {object.assignee.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 truncate">{object.assignee}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Unassigned</span>
                    )}
                  </div>

                  {/* Updated */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-500">
                      {new Date(object.updated_at).toLocaleDateString()}
                    </span>
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