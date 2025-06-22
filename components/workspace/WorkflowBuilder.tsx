import React, { useState } from 'react';

interface Trigger {
  id: string;
  name: string;
  trigger_type: string;
}

interface Action {
  id: string;
  name: string;
  type: string;
}

interface WorkflowBuilderProps {
  triggers: Trigger[];
  actions: Action[];
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ triggers, actions }) => {
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showTestResults, setShowTestResults] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showTriggerList, setShowTriggerList] = useState(false);
  const [showActionList, setShowActionList] = useState(false);

  const handleAddTrigger = () => setShowTriggerList(true);
  const handleAddAction = () => setShowActionList(true);
  const handleSelectTrigger = (trigger: Trigger) => {
    setSelectedTrigger(trigger);
    setShowTriggerList(false);
  };
  const handleSelectAction = (action: Action) => {
    setSelectedAction(action);
    setShowActionList(false);
  };
  const handleRemoveTrigger = () => setSelectedTrigger(null);
  const handleRemoveAction = () => setSelectedAction(null);
  const handleSaveWorkflow = () => {
    const errs = [];
    if (!selectedTrigger) errs.push('Please add at least one trigger');
    if (!selectedAction) errs.push('Please add at least one action');
    setErrors(errs);
  };
  const handleTestWorkflow = () => setShowTestResults(true);

  return (
    <div>
      <h2>Create a new workflow</h2>
      {!selectedTrigger && (
        <>
          <button aria-label="Add Trigger" onClick={handleAddTrigger}>Add Trigger</button>
          {showTriggerList && (
            <div>
              {triggers.map(trigger => (
                <button key={trigger.id} onClick={() => handleSelectTrigger(trigger)}>{trigger.name}</button>
              ))}
            </div>
          )}
        </>
      )}
      {selectedTrigger && (
        <div>
          <span>{`If ${selectedTrigger.name.toLowerCase()}`}</span>
          <button aria-label="Remove Trigger" onClick={handleRemoveTrigger}>Remove Trigger</button>
        </div>
      )}
      {!selectedAction && (
        <>
          <button aria-label="Add Action" onClick={handleAddAction}>Add Action</button>
          {showActionList && (
            <div>
              {actions.map(action => (
                <button key={action.id} onClick={() => handleSelectAction(action)}>{action.name}</button>
              ))}
            </div>
          )}
        </>
      )}
      {selectedAction && (
        <div>
          <span>{`Then ${selectedAction.name.toLowerCase()}`}</span>
          <button aria-label="Remove Action" onClick={handleRemoveAction}>Remove Action</button>
        </div>
      )}
      <button aria-label="Integration Settings" onClick={() => setShowSettings(true)}>Integration Settings</button>
      <button aria-label="Save Workflow" onClick={handleSaveWorkflow}>Save Workflow</button>
      {selectedTrigger && selectedAction && (
        <button aria-label="Test Workflow" onClick={handleTestWorkflow}>Test Workflow</button>
      )}
      {errors.map((err, i) => <div key={i}>{err}</div>)}
      {showSettings && (
        <div role="dialog">
          <label htmlFor="webhook-url">Webhook URL</label>
          <input id="webhook-url" aria-label="Webhook URL" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} />
          <button onClick={() => setShowSettings(false)}>Save Settings</button>
        </div>
      )}
      {showTestResults && (
        <div>
          <h3>Test Results</h3>
          <div>Logs</div>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder; 