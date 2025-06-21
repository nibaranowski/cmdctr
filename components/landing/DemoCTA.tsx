import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const DemoCTA: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="bg-surface border border-border rounded-xl p-8 md:p-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              Get started for free
            </h2>
            <p className="text-lg text-text-secondary mt-4 mb-8">
              No credit card required.
            </p>
            <Button size="lg">Start your free trial</Button>
            <div className="mt-8">
              <div className="aspect-video bg-background-secondary rounded-lg flex items-center justify-center max-w-3xl mx-auto">
                <p className="text-text-tertiary">Product animation/GIF placeholder</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DemoCTA;
