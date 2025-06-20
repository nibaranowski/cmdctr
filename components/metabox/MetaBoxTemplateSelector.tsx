import React, { useState } from 'react';

import { MetaBoxTemplate, MetaBoxPhase, META_BOX_TEMPLATES } from '../../models/MetaBox';

interface MetaBoxTemplateSelectorProps {
  onSelect: (template: MetaBoxTemplate) => void;
  onCancel: () => void;
  currentPhases: MetaBoxPhase[];
}

export const MetaBoxTemplateSelector: React.FC<MetaBoxTemplateSelectorProps> = ({
  onSelect,
  onCancel,
  currentPhases
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (templateKey: string) => {
    const templateData = META_BOX_TEMPLATES[templateKey as keyof typeof META_BOX_TEMPLATES];
    
    if (!templateData) return;

    // Create template with phases
    const phases: MetaBoxPhase[] = templateData.default_phases.map((phaseName, index) => ({
      id: `phase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: phaseName,
      order: index + 1,
      description: `Default ${phaseName.toLowerCase()} phase`,
      metabox_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const template = new MetaBoxTemplate({
      name: templateData.name,
      description: templateData.description,
      phases
    });

    onSelect(template);
  };

  const handleApply = () => {
    if (selectedTemplate) {
      handleTemplateSelect(selectedTemplate);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Select Template</h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {currentPhases.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Applying a template will replace all current phases. This action cannot be undone.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {Object.entries(META_BOX_TEMPLATES).map(([key, template]) => (
              <div
                key={key}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedTemplate === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(key)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        {template.default_phases.length} phases
                      </span>
                    </div>
                  </div>
                  {selectedTemplate === key && (
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {selectedTemplate === key && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h5 className="text-xs font-medium text-gray-700 mb-2">Phases:</h5>
                    <div className="space-y-1">
                      {template.default_phases.map((phase, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600">
                          <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full mr-2">
                            {index + 1}
                          </span>
                          {phase}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedTemplate}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 