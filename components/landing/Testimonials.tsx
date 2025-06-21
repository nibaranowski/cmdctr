import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Card from '../ui/Card';

const logos = [
  { name: 'Placeholder Inc.', logo: '🏢' },
  { name: 'Innovate Corp.', logo: '💡' },
  { name: 'Quantum Solutions', logo: '⚛️' },
  { name: 'Synergy Systems', logo: '🤝' },
  { name: 'Apex Enterprises', logo: '🔼' },
  { name: 'Stellar Ventures', logo: '🌟' },
];

const testimonials = [
  {
    quote: 'cmdctr has revolutionized our workflow. The agent-driven approach is a game-changer for our productivity.',
    author: 'Jane Doe',
    title: 'CEO, Placeholder Inc.',
    avatar: 'JD',
  },
  {
    quote: 'The ability to manage everything from fundraising to product development in one place is incredibly powerful.',
    author: 'John Smith',
    title: 'CTO, Innovate Corp.',
    avatar: 'JS',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-24">
      <div className="mx-auto px-4 max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-center text-text-secondary/80 font-medium mb-10 text-lg">
            Trusted by the world's most innovative companies
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 mb-20">
            {logos.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-3 text-text-tertiary/60 hover:text-text-tertiary transition-colors"
              >
                <div className="text-2xl md:text-3xl">{company.logo}</div>
                <span className="text-sm font-medium text-center">{company.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className="p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:translate-y-2 bg-surface border border-border"
                variant="elevated"
                padding="none"
                hover
                interactive
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <Quote className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
                </div>
                <blockquote className="text-lg md:text-xl font-medium text-text-primary mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <footer className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-text-primary">{testimonial.author}</p>
                    <p className="text-text-secondary/80 text-sm">{testimonial.title}</p>
                  </div>
                </footer>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
