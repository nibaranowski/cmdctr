'use client';

import { motion } from 'framer-motion';
import { 
  Palette, 
  Grid, 
  Layers, 
  Zap,
  ChevronRight,
  Star,
  Heart,
  Settings,
  User,
  Mail
} from 'lucide-react';
import React, { useState } from 'react';

import Accordion from '../components/ui/Accordion';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Dropdown from '../components/ui/Dropdown';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Progress from '../components/ui/Progress';
import Tabs from '../components/ui/Tabs';
import { useTheme } from '../components/ui/ThemeProvider';
import ThemeToggle from '../components/ui/ThemeToggle';
import Toast from '../components/ui/Toast';
import Tooltip from '../components/ui/Tooltip';

const DesignSystemPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const colorTokens = [
    { name: 'Primary', colors: ['primary-50', 'primary-100', 'primary-200', 'primary-300', 'primary-400', 'primary-500', 'primary-600', 'primary-700', 'primary-800', 'primary-900'] },
    { name: 'Gray', colors: ['gray-50', 'gray-100', 'gray-200', 'gray-300', 'gray-400', 'gray-500', 'gray-600', 'gray-700', 'gray-800', 'gray-900'] },
    { name: 'Success', colors: ['success-50', 'success-100', 'success-500', 'success-600', 'success-700'] },
    { name: 'Warning', colors: ['warning-50', 'warning-100', 'warning-500', 'warning-600', 'warning-700'] },
    { name: 'Error', colors: ['error-50', 'error-100', 'error-500', 'error-600', 'error-700'] },
    { name: 'Info', colors: ['info-50', 'info-100', 'info-500', 'info-600', 'info-700'] },
  ];

  const spacingTokens = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48];

  const typographyTokens = [
    { name: 'xs', size: 'text-xs', weight: 'font-normal' },
    { name: 'sm', size: 'text-sm', weight: 'font-normal' },
    { name: 'base', size: 'text-base', weight: 'font-normal' },
    { name: 'lg', size: 'text-lg', weight: 'font-normal' },
    { name: 'xl', size: 'text-xl', weight: 'font-normal' },
    { name: '2xl', size: 'text-2xl', weight: 'font-semibold' },
    { name: '3xl', size: 'text-3xl', weight: 'font-bold' },
    { name: '4xl', size: 'text-4xl', weight: 'font-bold' },
  ];

  const shadowTokens = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

  const radiusTokens = ['sm', 'md', 'lg', 'xl', '2xl', 'full'];

  const dropdownOptions = [
    { value: 'option1', label: 'Option 1', icon: <User className="w-4 h-4" /> },
    { value: 'option2', label: 'Option 2', icon: <Settings className="w-4 h-4" /> },
    { value: 'option3', label: 'Option 3', icon: <Mail className="w-4 h-4" /> },
  ];

  const tabContent = [
    { id: 'overview', label: 'Overview', content: 'Design system overview and principles' },
    { id: 'tokens', label: 'Design Tokens', content: 'Colors, typography, spacing, and other design tokens' },
    { id: 'components', label: 'Components', content: 'Reusable UI components and patterns' },
  ];

  const accordionItems = [
    { id: 'principles', title: 'Design Principles', content: 'Our core design principles guide every decision we make.' },
    { id: 'accessibility', title: 'Accessibility', content: 'We ensure our components meet WCAG 2.1 AA standards.' },
    { id: 'performance', title: 'Performance', content: 'Optimized for speed and smooth interactions.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-text-primary">cmdctr Design System</h1>
              </div>
              <Badge variant="primary">v1.0.0</Badge>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast('Design system copied to clipboard!')}
              >
                <Palette className="w-4 h-4" />
                Copy Tokens
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-text-primary mb-4">
            Linear-Inspired Design System
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
            A comprehensive design system built for modern web applications with 
            world-class accessibility, performance, and developer experience.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => showToast('Documentation opened!')}
            >
              <Grid className="w-5 h-5" />
              View Documentation
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowModal(true)}
            >
              <Layers className="w-5 h-5" />
              Component Library
            </Button>
          </div>
        </motion.section>

        {/* Principles & Usage */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Principles & Usage</h2>
          <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-6">
            <li><strong>Atomicity:</strong> Components are atomic, composable, and follow a strict 8px grid.</li>
            <li><strong>Accessibility:</strong> All components are accessible by default (keyboard, ARIA, focus ring, color contrast).</li>
            <li><strong>Theming:</strong> Supports world-class light/dark mode and system preference, with instant toggle.</li>
            <li><strong>Responsiveness:</strong> Layouts and components adapt to all screen sizes.</li>
            <li><strong>Animation:</strong> Uses Framer Motion and CSS transitions for delightful, performant motion.</li>
          </ul>
          <div className="bg-surface border border-border rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-2">Usage</h3>
            <pre className="bg-background-secondary rounded p-3 overflow-x-auto text-sm mb-2"><code>{`import { Button, Card, Badge, Tooltip, Toast, Tabs, Accordion, Dropdown, Input, Modal, ThemeToggle, Avatar, Progress } from 'components/ui';

<Button variant="primary">Click me</Button>`}</code></pre>
            <button className="px-3 py-1 rounded bg-primary-600 text-white text-xs hover:bg-primary-700 transition" aria-label="Copy usage code">Copy</button>
          </div>
          <div className="text-sm text-text-tertiary">
            <span>For more, see each component section below.</span>
          </div>
        </section>

        {/* Design Tokens */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-text-primary mb-8">Design Tokens</h3>
          
          {/* Colors */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-text-primary mb-6">Colors</h4>
            <div className="grid gap-6">
              {colorTokens.map((tokenGroup) => (
                <div key={tokenGroup.name} className="space-y-3">
                  <h5 className="text-lg font-medium text-text-secondary">{tokenGroup.name}</h5>
                  <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
                    {tokenGroup.colors.map((color) => (
                      <Tooltip key={color} content={`--color-${color}`}>
                        <div className="space-y-2">
                          <div 
                            className={`w-full h-16 rounded-lg border border-border bg-${color}`}
                          />
                          <p className="text-xs text-text-tertiary text-center">{color}</p>
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-text-primary mb-6">Typography</h4>
            <div className="space-y-4">
              {typographyTokens.map((token) => (
                <div key={token.name} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-text-tertiary">{token.name}</div>
                  <div className={`${token.size} ${token.weight} text-text-primary`}>
                    The quick brown fox jumps over the lazy dog
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-text-primary mb-6">Spacing</h4>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {spacingTokens.map((space) => (
                <div key={space} className="space-y-2">
                  <div 
                    className="bg-primary-500 rounded"
                    style={{ width: `${space * 4}px`, height: '16px' }}
                  />
                  <p className="text-xs text-text-tertiary text-center">{space}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shadows */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-text-primary mb-6">Shadows</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {shadowTokens.map((shadow) => (
                <div key={shadow} className="space-y-2">
                  <div 
                    className={`w-20 h-20 bg-surface border border-border rounded-lg shadow-${shadow}`}
                  />
                  <p className="text-xs text-text-tertiary text-center">{shadow}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-text-primary mb-6">Border Radius</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {radiusTokens.map((radius) => (
                <div key={radius} className="space-y-2">
                  <div 
                    className={`w-20 h-20 bg-primary-500 rounded-${radius}`}
                  />
                  <p className="text-xs text-text-tertiary text-center">{radius}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Components */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-text-primary mb-8">Components</h3>
          
          {/* Buttons */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-text-primary mb-6">Buttons</h4>
            <pre className="bg-background-secondary rounded p-3 overflow-x-auto text-sm mb-2"><code>{`<Button variant="primary">Primary</Button>`}</code></pre>
            <button className="px-3 py-1 rounded bg-primary-600 text-white text-xs hover:bg-primary-700 transition mb-4" aria-label="Copy button code">Copy</button>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button leftIcon={<Star className="w-4 h-4" />}>With Icon</Button>
                <Button rightIcon={<ChevronRight className="w-4 h-4" />}>With Icon</Button>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-text-primary mb-6">Cards</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="default" hover>
                <h5 className="font-semibold mb-2">Default Card</h5>
                <p className="text-text-secondary">A simple card with hover effects.</p>
              </Card>
              <Card variant="elevated" hover>
                <h5 className="font-semibold mb-2">Elevated Card</h5>
                <p className="text-text-secondary">A card with enhanced shadows.</p>
              </Card>
              <Card variant="outlined" hover>
                <h5 className="font-semibold mb-2">Outlined Card</h5>
                <p className="text-text-secondary">A card with prominent borders.</p>
              </Card>
              <Card variant="ghost" hover>
                <h5 className="font-semibold mb-2">Ghost Card</h5>
                <p className="text-text-secondary">A subtle card with minimal styling.</p>
              </Card>
              <Card variant="surface" hover>
                <h5 className="font-semibold mb-2">Surface Card</h5>
                <p className="text-text-secondary">A card with maximum elevation.</p>
              </Card>
              <Card interactive>
                <h5 className="font-semibold mb-2">Interactive Card</h5>
                <p className="text-text-secondary">Click me for animations!</p>
              </Card>
            </div>
          </div>

          {/* Badges */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-text-primary mb-6">Badges</h4>
            <div className="flex flex-wrap gap-4">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </div>

          {/* Avatars */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-text-primary mb-6">Avatars</h4>
            <div className="space-y-6">
              <div>
                <h5 className="text-lg font-medium text-text-primary mb-4">Sizes</h5>
                <div className="flex items-center gap-4">
                  <Avatar size="xs" fallback="XS" />
                  <Avatar size="sm" fallback="SM" />
                  <Avatar size="md" fallback="MD" />
                  <Avatar size="lg" fallback="LG" />
                  <Avatar size="xl" fallback="XL" />
                  <Avatar size="2xl" fallback="2XL" />
                </div>
              </div>
              <div>
                <h5 className="text-lg font-medium text-text-primary mb-4">Variants</h5>
                <div className="flex items-center gap-4">
                  <Avatar variant="default" fallback="A" />
                  <Avatar variant="rounded" fallback="B" />
                  <Avatar variant="square" fallback="C" />
                </div>
              </div>
              <div>
                <h5 className="text-lg font-medium text-text-primary mb-4">Status Indicators</h5>
                <div className="flex items-center gap-4">
                  <Avatar status="online" fallback="O" />
                  <Avatar status="offline" fallback="O" />
                  <Avatar status="away" fallback="A" />
                  <Avatar status="busy" fallback="B" />
                </div>
              </div>
              <div>
                <h5 className="text-lg font-medium text-text-primary mb-4">With Images</h5>
                <div className="flex items-center gap-4">
                  <Avatar 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                    alt="User 1"
                    status="online"
                  />
                  <Avatar 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" 
                    alt="User 2"
                    status="away"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-text-primary mb-6">Progress Bars</h4>
            <div className="space-y-6">
              <div>
                <h5 className="text-lg font-medium text-text-primary mb-4">Sizes</h5>
                <div className="space-y-4 w-64">
                  <Progress value={30} size="sm" label="Small" showValue />
                  <Progress value={50} size="md" label="Medium" showValue />
                  <Progress value={70} size="lg" label="Large" showValue />
                </div>
              </div>
              <div>
                <h5 className="text-lg font-medium text-text-primary mb-4">Variants</h5>
                <div className="space-y-4 w-64">
                  <Progress value={25} variant="default" label="Default" showValue />
                  <Progress value={50} variant="success" label="Success" showValue />
                  <Progress value={75} variant="warning" label="Warning" showValue />
                  <Progress value={90} variant="error" label="Error" showValue />
                  <Progress value={60} variant="info" label="Info" showValue />
                </div>
              </div>
              <div>
                <h5 className="text-lg font-medium text-text-primary mb-4">Special Effects</h5>
                <div className="space-y-4 w-64">
                  <Progress value={80} striped label="Striped" showValue />
                  <Progress value={45} animated label="Animated" showValue />
                  <Progress value={100} variant="success" label="Complete" showValue />
                </div>
              </div>
            </div>
          </div>

          {/* Form Elements */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-text-primary mb-6">Form Elements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input placeholder="Enter your email" />
                <Input placeholder="Password" type="password" />
                <Input placeholder="Disabled input" disabled />
              </div>
              <div className="space-y-4">
                <Dropdown
                  options={dropdownOptions}
                  placeholder="Select an option"
                  onChange={(value: string) => showToast(`Selected: ${value}`)}
                />
                <Button variant="outline" onClick={() => showToast('Form submitted!')}>
                  Submit Form
                </Button>
              </div>
            </div>
          </div>

          {/* Interactive Components */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-text-primary mb-6">Interactive Components</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h5 className="text-lg font-medium text-text-primary mb-4">Tabs</h5>
                <Tabs
                  items={tabContent}
                  defaultActiveTab="overview"
                />
              </div>
              <div>
                <h5 className="text-lg font-medium text-text-primary mb-4">Accordion</h5>
                <Accordion items={accordionItems} />
              </div>
            </div>
          </div>

          {/* Feedback Components */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-text-primary mb-6">Feedback Components</h4>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <Tooltip content="This is a helpful tooltip">
                  <Button variant="outline">Hover for tooltip</Button>
                </Tooltip>
                <Button variant="outline" onClick={() => showToast('Success message!')}>
                  Show Toast
                </Button>
                <Button variant="outline" onClick={() => setShowModal(true)}>
                  Open Modal
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Animations */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-text-primary mb-8">Animations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              className="p-6 bg-surface border border-border rounded-lg text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-8 h-8 mx-auto mb-2 text-primary-500" />
              <p className="text-sm font-medium">Hover & Tap</p>
            </motion.div>
            <motion.div
              className="p-6 bg-surface border border-border rounded-lg text-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Settings className="w-8 h-8 mx-auto mb-2 text-primary-500" />
              <p className="text-sm font-medium">Continuous</p>
            </motion.div>
            <motion.div
              className="p-6 bg-surface border border-border rounded-lg text-center"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Heart className="w-8 h-8 mx-auto mb-2 text-primary-500" />
              <p className="text-sm font-medium">Spring</p>
            </motion.div>
            <motion.div
              className="p-6 bg-surface border border-border rounded-lg text-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-8 h-8 mx-auto mb-2 text-primary-500" />
              <p className="text-sm font-medium">Pulse</p>
            </motion.div>
          </div>
        </section>

        {/* Responsive Design */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-text-primary mb-8">Responsive Design</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">Mobile</div>
                <p className="text-sm text-text-secondary">320px - 640px</p>
              </Card>
              <Card className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">Tablet</div>
                <p className="text-sm text-text-secondary">640px - 1024px</p>
              </Card>
              <Card className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">Desktop</div>
                <p className="text-sm text-text-secondary">1024px - 1280px</p>
              </Card>
              <Card className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">Large</div>
                <p className="text-sm text-text-secondary">1280px+</p>
              </Card>
            </div>
          </div>
        </section>

        {/* References */}
        <section className="mt-24 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">References</h2>
          <ul className="list-disc pl-6 text-text-secondary space-y-2">
            <li><a href="https://linear.app" className="underline hover:text-primary-600" target="_blank" rel="noopener noreferrer">Linear Design System</a></li>
            <li><a href="https://ui.shadcn.com/" className="underline hover:text-primary-600" target="_blank" rel="noopener noreferrer">shadcn/ui</a></li>
            <li><a href="https://www.radix-ui.com/docs/primitives/overview/introduction" className="underline hover:text-primary-600" target="_blank" rel="noopener noreferrer">Radix Primitives</a></li>
            <li><a href="https://vercel.com/design" className="underline hover:text-primary-600" target="_blank" rel="noopener noreferrer">Vercel Design</a></li>
            <li><a href="https://tailwindcss.com/docs/theme" className="underline hover:text-primary-600" target="_blank" rel="noopener noreferrer">Tailwind Theme</a></li>
          </ul>
        </section>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Component Library"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            This modal demonstrates the modal component with a backdrop and focus management.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="outline" onClick={() => showToast('Action completed!')}>
              Take Action
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toastMessage && (
        <Toast
          id="design-system-toast"
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
  );
};

export default DesignSystemPage; 