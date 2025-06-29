import type { Meta, StoryObj } from '@storybook/react';
// import { within, userEvent, expect } from '@storybook/test';

import Sidebar from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  // We can add decorators here to provide a mock router if needed for active states
  // decorators: [
  //   (Story) => <MemoryRouter initialEntries={['/dashboard']}><Story /></MemoryRouter>,
  // ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const HoverStates: Story = {
  args: {},
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   const dashboardLink = canvas.getByText('Dashboard');
  //   const agentsLink = canvas.getByText('Agents');
  //   
  //   await expect(dashboardLink).toBeInTheDocument();
  //   await expect(agentsLink).toBeInTheDocument();
  //   
  //   // Test hover states
  //   await userEvent.hover(dashboardLink);
  //   await userEvent.hover(agentsLink);
  // },
};

export const NavigationInteraction: Story = {
  args: {},
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   const dashboardLink = canvas.getByText('Dashboard');
  //   const agentsLink = canvas.getByText('Agents');
  //   
  //   await userEvent.click(dashboardLink);
  //   await userEvent.click(agentsLink);
  // },
};

export const UserProfileSection: Story = {
  args: {},
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   const userName = canvas.getByText('Nicolas Baranowski');
  //   const userEmail = canvas.getByText('nicolas@company.com');
  //   
  //   await expect(userName).toBeInTheDocument();
  //   await expect(userEmail).toBeInTheDocument();
  // },
}; 