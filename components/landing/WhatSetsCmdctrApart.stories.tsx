import type { Meta, StoryObj } from '@storybook/react';
import WhatSetsCmdctrApart from './WhatSetsCmdctrApart';

const meta: Meta<typeof WhatSetsCmdctrApart> = {
  title: 'Landing/WhatSetsCmdctrApart',
  component: WhatSetsCmdctrApart,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A section highlighting what sets the product apart.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
