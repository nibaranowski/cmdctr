import React from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, BarChart, Code, LifeBuoy, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const personas = [
  {
    icon: <User className="w-8 h-8 text-white" />,
    title: 'Founders',
    description: 'Get a real-time pulse on your entire business, from fundraising to product.',
    cta: 'See the big picture',
  },
  {
    icon: <Briefcase className="w-8 h-8 text-white" />,
    title: 'Operations',
    description: 'Automate workflows and streamline processes across all departments.',
    cta: 'Optimize your ops',
  },
  {
    icon: <BarChart className="w-8 h-8 text-white" />,
    title: 'Sales',
    description: 'Close deals faster with AI-powered lead scoring and automated outreach.',
    cta: 'Supercharge sales',
  },
  {
    icon: <Code className="w-8 h-8 text-white" />,
    title: 'Product',
    description: 'Build what matters with AI-driven insights from user feedback and support tickets.',
    cta: 'Build better products',
  },
  {
    icon: <LifeBuoy className="w-8 h-8 text-white" />,
    title: 'Support',
    description: 'Resolve issues faster and delight your customers with an AI-powered support system.',
    cta: 'Elevate support',
  },
];

const PersonaCards: React.FC = () => {
  return (
    <section className="py-20 bg-primary-500 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            How can cmdctr help your business?
          </h2>
          <p className="text-lg text-primary-200 mt-4 max-w-2xl mx-auto">
            A purpose-built command center for every team.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {personas.map((persona, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="p-8 h-full rounded-lg bg-primary-600/50">
                <div className="mb-4">{persona.icon}</div>
                <h3 className="text-xl font-bold mb-2">
                  {persona.title}
                </h3>
                <p className="text-primary-200 flex-grow">
                  {persona.description}
                </p>
                <div className="mt-6">
                  <Button variant="ghost" className="text-white p-0">
                    {persona.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonaCards;
