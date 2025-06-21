import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

const Hero: React.FC = () => {
  return (
    <section className="py-24 md:py-36">
      <div className="mx-auto px-4 max-w-[1400px]">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary mb-4 leading-tight tracking-tight font-sans">
              Run your entire company with an AI-native command center.
            </h1>
            <p className="text-lg md:text-2xl text-text-secondary/70 mb-6 font-medium max-w-xl">
              Modular, agent-driven platform to orchestrate fundraising, hiring, selling, product, marketing, reporting, and more—all in one workspace.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Button size="lg" className="font-bold shadow-md hover:shadow-lg focus:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-500">
                See it in action
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="font-bold border-primary-500 text-primary-600 hover:scale-105 hover:shadow-md focus:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-500">
                Book a demo
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="bg-surface border border-border rounded-2xl shadow-xl p-8 transition-transform hover:translate-y-2">
              <div className="aspect-video bg-background-secondary rounded-lg flex items-center justify-center">
                {/* Placeholder SVG illustration for product image/video */}
                <svg width="180" height="100" viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Product preview illustration" role="img">
                  <rect x="1" y="1" width="178" height="98" rx="16" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2" />
                  <rect x="20" y="30" width="140" height="40" rx="8" fill="#E0E7FF" />
                  <rect x="40" y="45" width="100" height="10" rx="5" fill="#6366F1" />
                  <circle cx="40" cy="50" r="6" fill="#6366F1" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
