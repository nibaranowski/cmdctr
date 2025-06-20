import type { Meta, StoryObj } from '@storybook/nextjs';
// import { within, userEvent, expect } from '@storybook/test';

import Sidebar from './Sidebar';

const meta = {
  title: 'Components/Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const HoverStates: Story = {
  args: {},
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const activitiesLink = canvas.getByText('Activities');
//     const agentsLink = canvas.getByText('Agents');
//     
//     await expect(activitiesLink).toBeInTheDocument();
//     await expect(agentsLink).toBeInTheDocument();
//     
//     // Test hover states
//     await userEvent.hover(activitiesLink);
//     await userEvent.hover(agentsLink);
//   },
};

export const NavigationInteraction: Story = {
  args: {},
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const activitiesLink = canvas.getByText('Activities');
//     const agentsLink = canvas.getByText('Agents');
//     
//     await userEvent.click(activitiesLink);
//     await userEvent.click(agentsLink);
//   },
};

export const UserProfileSection: Story = {
  args: {},
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const userName = canvas.getByText('John Doe');
//     const userEmail = canvas.getByText('john@company.com');
//     
//     await expect(userName).toBeInTheDocument();
//     await expect(userEmail).toBeInTheDocument();
//   },
}; 