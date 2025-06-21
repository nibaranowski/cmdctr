import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

const Hero: React.FC = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary mb-6 leading-tight">
              Run your entire company with an AI-native command center.
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8">
              Modular, agent-driven platform to orchestrate fundraising, hiring,
              selling, product, marketing, reporting, and more—all in one
              workspace.
            </p>
            <div className="flex items-center gap-4">
              <Button size="lg">
                See it in action
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                Book a demo
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="bg-surface border border-border rounded-xl shadow-lg p-4">
              <div className="aspect-video bg-background-secondary rounded-lg flex items-center justify-center">
                <p className="text-text-tertiary">Product image/video placeholder</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
