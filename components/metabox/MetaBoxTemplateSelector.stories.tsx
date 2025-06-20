import type { Meta, StoryObj } from '@storybook/nextjs';
// import { within, userEvent, expect } from '@storybook/test';

import { MetaBoxPhase } from '../../models/MetaBox';

import { MetaBoxTemplateSelector } from './MetaBoxTemplateSelector';

const meta: Meta<typeof MetaBoxTemplateSelector> = {
  title: 'MetaBox/MetaBoxTemplateSelector',
  component: MetaBoxTemplateSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSelect: {
      action: 'templateSelected',
      description: 'Callback when a template is selected',
    },
    onCancel: {
      action: 'cancelled',
      description: 'Callback when selection is cancelled',
    },
    currentPhases: {
      control: 'object',
      description: 'Current phases in the MetaBox',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockCurrentPhases: MetaBoxPhase[] = [
  {
    id: 'phase_1',
    name: 'Research',
    order: 1,
    description: 'Initial research phase',
    metabox_id: 'metabox_1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    update: (changes) => {
      // Mock update method
      console.log('Updating phase:', changes);
    }
  },
  {
    id: 'phase_2',
    name: 'Planning',
    order: 2,
    description: 'Planning phase',
    metabox_id: 'metabox_1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    update: (changes) => {
      // Mock update method
      console.log('Updating phase:', changes);
    }
  },
];

export const Default: Story = {
  args: {
    currentPhases: [],
  },
};

export const WithExistingPhases: Story = {
  args: {
    currentPhases: mockCurrentPhases,
  },
};

export const FundraisingTemplate: Story = {
  args: {
    currentPhases: [],
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     
//     // Click on the fundraising template
//     const fundraisingTemplate = canvas.getByText('Fundraising Campaign');
//     await userEvent.click(fundraisingTemplate);
//     
//     // Verify the template is selected
//     expect(fundraisingTemplate.closest('div')).toHaveClass('border-blue-500', 'bg-blue-50');
//   },
};

export const ProductDevelopmentTemplate: Story = {
  args: {
    currentPhases: [],
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     
//     // Click on the product development template
//     const productTemplate = canvas.getByText('Product Development');
//     await userEvent.click(productTemplate);
//     
//     // Verify the template is selected
//     expect(productTemplate.closest('div')).toHaveClass('border-blue-500', 'bg-blue-50');
//   },
};

export const MarketingCampaignTemplate: Story = {
  args: {
    currentPhases: [],
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     
//     // Click on the marketing campaign template
//     const marketingTemplate = canvas.getByText('Marketing Campaign');
//     await userEvent.click(marketingTemplate);
//     
//     // Verify the template is selected
//     expect(marketingTemplate.closest('div')).toHaveClass('border-blue-500', 'bg-blue-50');
//   },
};

export const HiringPipelineTemplate: Story = {
  args: {
    currentPhases: [],
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     
//     // Click on the hiring pipeline template
//     const hiringTemplate = canvas.getByText('Hiring Pipeline');
//     await userEvent.click(hiringTemplate);
//     
//     // Verify the template is selected
//     expect(hiringTemplate.closest('div')).toHaveClass('border-blue-500', 'bg-blue-50');
//   },
};

export const SalesPipelineTemplate: Story = {
  args: {
    currentPhases: [],
  },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     
//     // Click on the sales pipeline template
//     const salesTemplate = canvas.getByText('Sales Pipeline');
//     await userEvent.click(salesTemplate);
//     
//     // Verify the template is selected
//     expect(salesTemplate.closest('div')).toHaveClass('border-blue-500', 'bg-blue-50');
//   },
}; 