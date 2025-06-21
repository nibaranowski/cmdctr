import type { Meta, StoryObj } from '@storybook/react';
import PhasePanel from './PhasePanel';
import { fundraisingManifest } from '../../types/metaBoxManifest';

const meta: Meta<typeof PhasePanel> = {
  title: 'MetaBox/PhasePanel',
  component: PhasePanel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Left panel showing phases with agents, status, expand/collapse, inline messaging, and actions.',
      },
    },
  },
  decorators: [
    (Story: any) => (
      <div className="w-80 h-screen">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof PhasePanel>;

export const Default: Story = {
  args: {
    manifest: fundraisingManifest,
  },
};

export const WithPhaseActions: Story = {
  args: {
    manifest: fundraisingManifest,
    onPhaseAction: (phaseId: string, action: 'complete' | 'revert' | 'trigger') => {
      console.log(`Phase action: ${action} for phase ${phaseId}`);
    },
  },
};

export const WithAgentMessaging: Story = {
  args: {
    manifest: fundraisingManifest,
    onAgentMessage: (phaseId: string, message: string) => {
      console.log(`Agent message for phase ${phaseId}: ${message}`);
    },
  },
};

export const EmptyState: Story = {
  args: {
    manifest: { ...fundraisingManifest, phases: [], agents: [] },
  },
};

export const SinglePhase: Story = {
  args: {
    manifest: {
      ...fundraisingManifest,
      phases: [fundraisingManifest.phases[0]],
      agents: [fundraisingManifest.agents[0]],
    },
  },
};

export const AllPhasesComplete: Story = {
  args: {
    manifest: {
      ...fundraisingManifest,
      phases: fundraisingManifest.phases.map(phase => ({ ...phase, status: 'complete' as const })),
    },
  },
};

export const AllAgentsOffline: Story = {
  args: {
    manifest: {
      ...fundraisingManifest,
      agents: fundraisingManifest.agents.map(agent => ({ ...agent, status: 'offline' as const })),
    },
  },
}; 