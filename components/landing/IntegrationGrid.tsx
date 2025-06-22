import { motion } from 'framer-motion';
import React from 'react';

const integrations = [
  { name: 'Slack', logo: '💬' },
  { name: 'GitHub', logo: '🐙' },
  { name: 'Notion', logo: '📝' },
  { name: 'Stripe', logo: '💳' },
  { name: 'HubSpot', logo: '🎯' },
  { name: 'Salesforce', logo: '☁️' },
  { name: 'Zapier', logo: '🔗' },
  { name: 'Figma', logo: '🎨' },
  { name: 'Firebase', logo: '🔥' },
  { name: 'PostHog', logo: '📊' },
  { name: 'Sentry', logo: '🚨' },
  { name: 'Mercury', logo: '💧' },
];

const IntegrationGrid: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto px-4 max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary leading-tight mb-3">
            Works with your favorite tools
          </h2>
          <p className="text-lg md:text-xl text-text-secondary/80 mt-2 max-w-2xl mx-auto">
            Seamlessly integrate with your existing workflow and tools
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-3 text-text-tertiary/60 hover:text-text-tertiary transition-colors group"
            >
              <div className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">
                {integration.logo}
              </div>
              <span className="text-sm font-medium text-center text-text-secondary/70 group-hover:text-text-secondary transition-colors">
                {integration.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationGrid;
