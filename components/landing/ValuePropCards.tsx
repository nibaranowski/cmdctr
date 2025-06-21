import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, ShoppingCart, ToyBrick, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const valueProps = [
  {
    icon: <DollarSign className="w-10 h-10 text-primary-500" />,
    title: 'Agent-Powered Fundraising',
    description: 'Automate investor discovery, outreach, and pipeline management with dedicated AI agents.',
    cta: 'Explore fundraising agents',
  },
  {
    icon: <Users className="w-10 h-10 text-primary-500" />,
    title: 'Automated Hiring',
    description: 'Source, screen, and schedule interviews with top talent using our AI-driven hiring workflows.',
    cta: 'See hiring in action',
  },
  {
    icon: <ShoppingCart className="w-10 h-10 text-primary-500" />,
    title: 'Sales Automation',
    description: 'Close deals faster with AI-powered lead scoring, personalized outreach, and automated follow-ups.',
    cta: 'Boost your sales',
  },
  {
    icon: <ToyBrick className="w-10 h-10 text-primary-500" />,
    title: 'AI-Driven Product Management',
    description: 'Turn user feedback into actionable insights and build a product roadmap that your customers will love.',
    cta: 'Build better products',
  },
];

const ValuePropCards: React.FC = () => {
  return (
    <section className="py-24 bg-background-secondary">
      <div className="mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary leading-tight mb-3">
            One platform, endless possibilities
          </h2>
          <p className="text-lg md:text-xl text-text-secondary/80 mt-2 max-w-2xl mx-auto">
            From fundraising to product development, cmdctr provides the tools you need to succeed.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {valueProps.map((prop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className="p-10 h-full flex flex-col rounded-2xl shadow-xl hover:shadow-2xl transition-shadow hover:translate-y-2 bg-surface border border-border"
                variant="elevated"
                padding="none"
                hover
                interactive
              >
                <div className="mb-6">{prop.icon}</div>
                <h3 className="text-2xl font-semibold text-text-primary mb-2">
                  {prop.title}
                </h3>
                <p className="text-lg text-text-secondary/80 flex-grow max-w-prose">
                  {prop.description}
                </p>
                <div className="mt-8">
                  <Button
                    variant="outline"
                    size="md"
                    className="font-bold border-primary-500 text-primary-600 hover:scale-105 hover:shadow-md focus:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    {prop.cta}
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

export default ValuePropCards;
