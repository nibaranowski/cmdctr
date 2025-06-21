import React from 'react';
import { motion } from 'framer-motion';
import { Grid, Zap, Shield, Share2, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const features = [
  {
    icon: <Grid className="w-8 h-8 text-primary-500" />,
    title: 'Unified Meta Box Architecture',
    description: 'Every business function is a modular meta box, orchestrated by AI agents for seamless integration.',
    visual: (
      <div className="aspect-square bg-background-tertiary rounded-lg flex items-center justify-center p-4">
        <p className="text-text-tertiary text-sm text-center">Visual diagram of meta boxes/agents</p>
      </div>
    ),
  },
  {
    icon: <Zap className="w-8 h-8 text-primary-500" />,
    title: 'Real-Time Automation & Sync',
    description: 'Changes in one meta box are instantly reflected everywhere, keeping your entire company in sync.',
  },
  {
    icon: <Share2 className="w-8 h-8 text-primary-500" />,
    title: 'Extensible Integrations',
    description: 'Connect your favorite tools to cmdctr and create a truly unified command center for your business.',
  },
  {
    icon: <Shield className="w-8 h-8 text-primary-500" />,
    title: 'Enterprise-Grade Security & Audit',
    description: 'Your data is safe with us. We offer robust security features and a complete audit trail of all actions.',
  },
];

const WhatSetsCmdctrApart: React.FC = () => {
  return (
    <section className="py-20 bg-background-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            What sets cmdctr apart
          </h2>
          <p className="text-lg text-text-secondary mt-4 max-w-2xl mx-auto">
            A new operating model for the AI-native company.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full">
                {feature.visual && <div className="mb-4">{feature.visual}</div>}
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatSetsCmdctrApart;
