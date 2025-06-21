import type { Meta, StoryObj } from '@storybook/nextjs-vite';
// import { within, userEvent, expect } from '@storybook/test';

import LoginForm from './LoginForm';

const meta = {
  title: 'Authentication/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: { control: 'boolean' },
    error: { control: 'text' },
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    error: 'Invalid email or password. Please try again.',
  },
};

export const FormInteraction: Story = {
  args: {},
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const emailInput = canvas.getByLabelText('Email');
//     const submitButton = canvas.getByRole('button', { name: 'Send Magic Link' });
//     
//     await expect(emailInput).toBeInTheDocument();
//     await expect(submitButton).toBeInTheDocument();
//     
//     await userEvent.type(emailInput, 'test@example.com');
//     await expect(emailInput).toHaveValue('test@example.com');
//   },
}; 