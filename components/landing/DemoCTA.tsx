import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

const DemoCTA: React.FC = () => {
  return (
    <section className="py-24">
      <div className="mx-auto px-4 max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-surface border border-border rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:translate-y-2 p-10 md:p-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary leading-tight mb-3">
            Get started for free
          </h2>
          <p className="text-lg md:text-xl text-text-secondary/80 mt-2 mb-10 max-w-2xl mx-auto">
            No credit card required. Start transforming your business today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="font-bold shadow-md hover:shadow-lg focus:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              Start your free trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="font-bold border-primary-500 text-primary-600 hover:scale-105 hover:shadow-md focus:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch demo
            </Button>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-background-secondary rounded-xl flex items-center justify-center border border-border">
              <div className="text-center">
                <Play className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-tertiary text-lg">Product demo video</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoCTA;
