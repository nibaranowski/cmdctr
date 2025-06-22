import { motion } from 'framer-motion';
import { User, Briefcase, BarChart, Code, LifeBuoy, ArrowRight } from 'lucide-react';
import React from 'react';

import Button from '../ui/Button';
import Card from '../ui/Card';

const personas = [
  {
    icon: <User className="w-10 h-10 text-white" />,
    title: 'Founders',
    description: 'Get a real-time pulse on your entire business, from fundraising to product.',
    cta: 'See the big picture',
  },
  {
    icon: <Briefcase className="w-10 h-10 text-white" />,
    title: 'Operations',
    description: 'Automate workflows and streamline processes across all departments.',
    cta: 'Optimize your ops',
  },
  {
    icon: <BarChart className="w-10 h-10 text-white" />,
    title: 'Sales',
    description: 'Close deals faster with AI-powered lead scoring and automated outreach.',
    cta: 'Supercharge sales',
  },
  {
    icon: <Code className="w-10 h-10 text-white" />,
    title: 'Product',
    description: 'Build what matters with AI-driven insights from user feedback and support tickets.',
    cta: 'Build better products',
  },
  {
    icon: <LifeBuoy className="w-10 h-10 text-white" />,
    title: 'Support',
    description: 'Resolve issues faster and delight your customers with an AI-powered support system.',
    cta: 'Elevate support',
  },
];

const PersonaCards: React.FC = () => {
  return (
    <section className="py-24 bg-primary-500 text-white">
      <div className="mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3">
            How can cmdctr help your business?
          </h2>
          <p className="text-lg md:text-xl text-primary-200/90 mt-2 max-w-2xl mx-auto">
            A purpose-built command center for every team.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {personas.map((persona, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className="p-10 h-full rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:translate-y-2 bg-primary-600/50 border border-primary-400/20"
                variant="elevated"
                padding="none"
                hover
                interactive
              >
                <div className="mb-6">{persona.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">
                  {persona.title}
                </h3>
                <p className="text-lg text-primary-200/90 flex-grow leading-relaxed">
                  {persona.description}
                </p>
                <div className="mt-8">
                  <Button
                    variant="outline"
                    size="md"
                    className="font-bold border-white text-white hover:scale-105 hover:shadow-md focus:shadow-lg focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {persona.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonaCards;
