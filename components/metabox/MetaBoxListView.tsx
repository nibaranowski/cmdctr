import React, { useState, useMemo } from 'react';

import { MetaBoxManifest, MetaBoxCoreObjectField } from '../../types/metaBoxManifest';

interface CoreObject {
  id: string;
  currentPhase: string;
  [key: string]: any;
}

interface MetaBoxListViewProps {
  manifest: MetaBoxManifest;
  coreObjects: CoreObject[];
  selectedObjectId?: string | null;
  onObjectSelect?: (objectId: string) => void;
}

type SortField = string;
type SortDirection = 'asc' | 'desc';

const MetaBoxListView: React.FC<MetaBoxListViewProps> = ({
  manifest,
  coreObjects,
  selectedObjectId,
  onObjectSelect,
}) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilter = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredAndSortedObjects = useMemo(() => {
    const filtered = coreObjects.filter(obj => {
      return Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        const objValue = obj[field];
        return objValue?.toString().toLowerCase().includes(value.toLowerCase());
      });
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [coreObjects, sortField, sortDirection, filters]);

  const getFieldValue = (field: MetaBoxCoreObjectField, value: any) => {
    switch (field.type) {
      case 'status':
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            value === 'active' ? 'bg-green-100 text-green-800' :
            value === 'complete' ? 'bg-blue-100 text-blue-800' :
            value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {value || '-'}
          </span>
        );
      
      case 'agent':
        const agent = manifest.agents.find(a => a.id === value);
        return agent ? (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
              {agent.name.charAt(0)}
            </div>
            <span className="text-sm text-gray-900">{agent.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Unassigned</span>
        );
      
      case 'date':
        return (
          <span className="text-sm text-gray-600">
            {value ? new Date(value).toLocaleDateString() : '-'}
          </span>
        );
      
      case 'number':
        return (
          <span className="text-sm font-medium text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value || '-'}
          </span>
        );
      
      default:
        return (
          <span className="text-sm text-gray-900 truncate">
            {value || '-'}
          </span>
        );
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return (
      <svg className={`w-4 h-4 ${sortDirection === 'asc' ? 'text-blue-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-4 gap-4">
          {manifest.fields.slice(0, 4).map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Filter {field.label}
              </label>
              <input
                type="text"
                value={filters[field.key] || ''}
                onChange={(e) => handleFilter(field.key, e.target.value)}
                placeholder={`Filter ${field.label}...`}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              {manifest.fields.map((field) => (
                <th
                  key={field.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    field.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => field.sortable && handleSort(field.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{field.label}</span>
                    {field.sortable && <SortIcon field={field.key} />}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phase
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedObjects.length === 0 ? (
              <tr>
                <td colSpan={manifest.fields.length + 3} className="px-6 py-12 text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No items found</p>
                </td>
              </tr>
            ) : (
              filteredAndSortedObjects.map((coreObject) => (
                <tr
                  key={coreObject.id}
                  className={`cursor-pointer transition-colors ${
                    selectedObjectId === coreObject.id
                      ? 'bg-blue-50 border-l-4 border-l-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onObjectSelect?.(coreObject.id)}
                  data-testid={`list-item-${coreObject.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                          {(coreObject.name || coreObject.title || '#').charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {coreObject.name || coreObject.title || `#${coreObject.id}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {coreObject.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {manifest.fields.map((field) => (
                    <td key={field.key} className="px-6 py-4 whitespace-nowrap">
                      {getFieldValue(field, coreObject[field.key])}
                    </td>
                  ))}
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {coreObject.currentPhase || 'No phase'}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {coreObject.updatedAt ? new Date(coreObject.updatedAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetaBoxListView; 