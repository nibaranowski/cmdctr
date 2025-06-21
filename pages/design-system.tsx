import { motion } from 'framer-motion';
import Head from 'next/head';
import React from 'react';

import Accordion from '../components/ui/Accordion';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Dropdown from '../components/ui/Dropdown';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Tabs from '../components/ui/Tabs';
import ThemeToggle from '../components/ui/ThemeToggle';
import Toast from '../components/ui/Toast';
import Tooltip from '../components/ui/Tooltip';

export default function DesignSystemPage() {
  const [showModal, setShowModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('components');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Head>
        <title>Design System - Command Center</title>
        <meta name="description" content="Linear-inspired design system showcase" />
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Design System</h1>
              <Badge variant="primary">v2.0</Badge>
            </div>
            <ThemeToggle size="md" showLabel />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            items={[
              { value: 'components', label: 'Components' },
              { value: 'tokens', label: 'Design Tokens' },
              { value: 'themes', label: 'Themes' },
            ]}
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'components' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {/* Buttons Section */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card variant="surface" padding="lg">
                  <h3 className="text-lg font-medium mb-4">Variants</h3>
                  <div className="space-y-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="success">Success</Button>
                  </div>
                </Card>

                <Card variant="surface" padding="lg">
                  <h3 className="text-lg font-medium mb-4">Sizes</h3>
                  <div className="space-y-3">
                    <Button size="xs">Extra Small</Button>
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </Card>

                <Card variant="surface" padding="lg">
                  <h3 className="text-lg font-medium mb-4">States</h3>
                  <div className="space-y-3">
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                    <Button leftIcon={<span>🚀</span>}>With Icon</Button>
                  </div>
                </Card>
              </div>
            </motion.section>

            {/* Cards Section */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-6">Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card variant="default" padding="lg" hover>
                  <h3 className="font-medium mb-2">Default Card</h3>
                  <p className="text-text-secondary text-sm">Standard card with hover effects</p>
                </Card>

                <Card variant="elevated" padding="lg" hover>
                  <h3 className="font-medium mb-2">Elevated Card</h3>
                  <p className="text-text-secondary text-sm">Card with enhanced shadow</p>
                </Card>

                <Card variant="outlined" padding="lg" hover>
                  <h3 className="font-medium mb-2">Outlined Card</h3>
                  <p className="text-text-secondary text-sm">Card with prominent border</p>
                </Card>

                <Card variant="surface" padding="lg" hover>
                  <h3 className="font-medium mb-2">Surface Card</h3>
                  <p className="text-text-secondary text-sm">Card with strong elevation</p>
                </Card>
              </div>
            </motion.section>

            {/* Form Elements Section */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-6">Form Elements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="surface" padding="lg">
                  <h3 className="text-lg font-medium mb-4">Input Fields</h3>
                  <div className="space-y-4">
                    <Input label="Default Input" placeholder="Enter text..." />
                    <Input label="With Icon" leftIcon={<span>🔍</span>} placeholder="Search..." />
                    <Input label="Error State" error="This field is required" />
                    <Input label="Loading State" loading placeholder="Loading..." />
                  </div>
                </Card>

                <Card variant="surface" padding="lg">
                  <h3 className="text-lg font-medium mb-4">Dropdown</h3>
                  <Dropdown
                    trigger={<Button variant="outline">Open Dropdown</Button>}
                    items={[
                      { label: 'Profile', onClick: () => console.log('Profile') },
                      { label: 'Settings', onClick: () => console.log('Settings') },
                      { label: 'Logout', onClick: () => console.log('Logout') },
                    ]}
                  />
                </Card>
              </div>
            </motion.section>

            {/* Feedback Section */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-6">Feedback</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card variant="surface" padding="lg">
                  <h3 className="text-lg font-medium mb-4">Badges</h3>
                  <div className="space-y-3">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="danger">Danger</Badge>
                    <Badge variant="info">Info</Badge>
                  </div>
                </Card>

                <Card variant="surface" padding="lg">
                  <h3 className="text-lg font-medium mb-4">Tooltips</h3>
                  <div className="space-y-3">
                    <Tooltip content="This is a tooltip">
                      <Button variant="outline">Hover me</Button>
                    </Tooltip>
                  </div>
                </Card>

                <Card variant="surface" padding="lg">
                  <h3 className="text-lg font-medium mb-4">Modal</h3>
                  <Button onClick={() => setShowModal(true)}>Open Modal</Button>
                </Card>
              </div>
            </motion.section>

            {/* Navigation Section */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-6">Navigation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="surface" padding="lg">
                  <h3 className="text-lg font-medium mb-4">Tabs</h3>
                  <Tabs
                    value="tab1"
                    items={[
                      { value: 'tab1', label: 'Tab 1' },
                      { value: 'tab2', label: 'Tab 2' },
                      { value: 'tab3', label: 'Tab 3' },
                    ]}
                  />
                </Card>

                <Card variant="surface" padding="lg">
                  <h3 className="text-lg font-medium mb-4">Accordion</h3>
                  <Accordion
                    items={[
                      {
                        value: 'item1',
                        trigger: 'Accordion Item 1',
                        content: 'This is the content for accordion item 1.',
                      },
                      {
                        value: 'item2',
                        trigger: 'Accordion Item 2',
                        content: 'This is the content for accordion item 2.',
                      },
                    ]}
                  />
                </Card>
              </div>
            </motion.section>
          </motion.div>
        )}

        {activeTab === 'tokens' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {/* Color Tokens */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-6">Color Tokens</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card variant="surface" padding="lg">
                  <h3 className="text-lg font-medium mb-4">Primary Colors</h3>
                  <div className="space-y-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <div key={shade} className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded border border-border`}
                          style={{ backgroundColor: `var(--color-primary-${shade})` }}
                        />
                        <span className="text-sm font-mono">primary-{shade}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card variant="surface" padding="lg">
                  <h3 className="text-lg font-medium mb-4">Semantic Colors</h3>
                  <div className="space-y-2">
                    {['success', 'warning', 'error', 'info'].map((color) => (
                      <div key={color} className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded border border-border`}
                          style={{ backgroundColor: `var(--color-${color}-500)` }}
                        />
                        <span className="text-sm font-mono">{color}-500</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card variant="surface" padding="lg">
                  <h3 className="text-lg font-medium mb-4">Surface Colors</h3>
                  <div className="space-y-2">
                    {['surface', 'surface-hover', 'surface-active'].map((color) => (
                      <div key={color} className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded border border-border`}
                          style={{ backgroundColor: `var(--color-${color})` }}
                        />
                        <span className="text-sm font-mono">{color}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.section>

            {/* Typography */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-6">Typography</h2>
              <Card variant="surface" padding="lg">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-4xl font-bold">Heading 1 (4xl)</h1>
                    <p className="text-text-secondary">Font: Inter, Weight: 700</p>
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold">Heading 2 (3xl)</h2>
                    <p className="text-text-secondary">Font: Inter, Weight: 600</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">Heading 3 (2xl)</h3>
                    <p className="text-text-secondary">Font: Inter, Weight: 600</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-medium">Heading 4 (xl)</h4>
                    <p className="text-text-secondary">Font: Inter, Weight: 500</p>
                  </div>
                  <div>
                    <p className="text-lg">Body Large (lg)</p>
                    <p className="text-text-secondary">Font: Inter, Weight: 400</p>
                  </div>
                  <div>
                    <p className="text-base">Body (base)</p>
                    <p className="text-text-secondary">Font: Inter, Weight: 400</p>
                  </div>
                  <div>
                    <p className="text-sm">Body Small (sm)</p>
                    <p className="text-text-secondary">Font: Inter, Weight: 400</p>
                  </div>
                </div>
              </Card>
            </motion.section>

            {/* Spacing */}
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-6">Spacing (8px Grid)</h2>
              <Card variant="surface" padding="lg">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map((space) => (
                    <div key={space} className="flex items-center space-x-4">
                      <div
                        className="bg-primary-500 rounded"
                        style={{ width: `${space * 4}px`, height: '16px' }}
                      />
                      <span className="text-sm font-mono">space-{space} ({space * 4}px)</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.section>
          </motion.div>
        )}

        {activeTab === 'themes' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-6">Theme Switching</h2>
              <Card variant="surface" padding="lg">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Theme Toggle</h3>
                    <p className="text-text-secondary mb-4">
                      Click the theme toggle in the header to switch between light, dark, and system themes.
                    </p>
                    <ThemeToggle size="lg" showLabel />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Current Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card variant="default" padding="md">
                        <h4 className="font-medium mb-2">Light Mode</h4>
                        <p className="text-text-secondary text-sm">
                          Clean, bright interface with high contrast
                        </p>
                      </Card>
                      <Card variant="default" padding="md">
                        <h4 className="font-medium mb-2">Dark Mode</h4>
                        <p className="text-text-secondary text-sm">
                          Easy on the eyes with reduced blue light
                        </p>
                      </Card>
                      <Card variant="default" padding="md">
                        <h4 className="font-medium mb-2">System</h4>
                        <p className="text-text-secondary text-sm">
                          Automatically follows your system preference
                        </p>
                      </Card>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.section>
          </motion.div>
        )}
      </main>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Design System Modal"
        description="This is an example modal showcasing the design system components."
      >
        <div className="space-y-4">
          <p>This modal demonstrates the design system's modal component with proper theming and accessibility.</p>
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowModal(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 