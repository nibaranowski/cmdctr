import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, ShoppingCart, ToyBrick, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const valueProps = [
  {
    icon: <DollarSign className="w-8 h-8 text-primary-500" />,
    title: 'Agent-Powered Fundraising',
    description: 'Automate investor discovery, outreach, and pipeline management with dedicated AI agents.',
    cta: 'Explore fundraising agents',
  },
  {
    icon: <Users className="w-8 h-8 text-primary-500" />,
    title: 'Automated Hiring',
    description: 'Source, screen, and schedule interviews with top talent using our AI-driven hiring workflows.',
    cta: 'See hiring in action',
  },
  {
    icon: <ShoppingCart className="w-8 h-8 text-primary-500" />,
    title: 'Sales Automation',
    description: 'Close deals faster with AI-powered lead scoring, personalized outreach, and automated follow-ups.',
    cta: 'Boost your sales',
  },
  {
    icon: <ToyBrick className="w-8 h-8 text-primary-500" />,
    title: 'AI-Driven Product Management',
    description: 'Turn user feedback into actionable insights and build a product roadmap that your customers will love.',
    cta: 'Build better products',
  },
];

const ValuePropCards: React.FC = () => {
  return (
    <section className="py-20 bg-background-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            One platform, endless possibilities
          </h2>
          <p className="text-lg text-text-secondary mt-4 max-w-2xl mx-auto">
            From fundraising to product development, cmdctr provides the tools you need to succeed.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {valueProps.map((prop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full flex flex-col">
                <div className="mb-4">{prop.icon}</div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {prop.title}
                </h3>
                <p className="text-text-secondary flex-grow">
                  {prop.description}
                </p>
                <div className="mt-6">
                  <Button variant="ghost" className="p-0">
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
