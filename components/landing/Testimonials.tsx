import React from 'react';
import { motion } from 'framer-motion';

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
  },
  {
    quote: 'The ability to manage everything from fundraising to product development in one place is incredibly powerful.',
    author: 'John Smith',
    title: 'CTO, Innovate Corp.',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-center text-text-secondary font-medium mb-8">
            Trusted by the world's most innovative companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 mb-16">
            {logos.map((company, index) => (
              <div key={index} className="flex items-center gap-2 text-text-tertiary text-lg font-semibold">
                <span>{company.logo}</span>
                <span>{company.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <blockquote className="text-xl md:text-2xl font-medium text-text-primary">
                "{testimonial.quote}"
              </blockquote>
              <footer className="mt-4">
                <p className="font-bold text-text-primary">{testimonial.author}</p>
                <p className="text-text-secondary">{testimonial.title}</p>
              </footer>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
