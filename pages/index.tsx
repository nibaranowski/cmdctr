import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import ValuePropCards from '../components/landing/ValuePropCards';
import Testimonials from '../components/landing/Testimonials';
import WhatSetsCmdctrApart from '../components/landing/WhatSetsCmdctrApart';
import IntegrationGrid from '../components/landing/IntegrationGrid';
import PersonaCards from '../components/landing/PersonaCards';
import DemoCTA from '../components/landing/DemoCTA';
import Footer from '../components/landing/Footer';
import Head from 'next/head';

const HomePage: React.FC = () => {
  return (
    <div className="bg-background text-text-primary">
      <Head>
        <title>cmdctr - The AI-Native Company Operating System</title>
        <meta
          name="description"
          content="Run your entire company with an AI-native command center. Modular, agent-driven platform to orchestrate fundraising, hiring, selling, product, marketing, reporting, and more—all in one workspace."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <Hero />
        <ValuePropCards />
        <Testimonials />
        <WhatSetsCmdctrApart />
        <IntegrationGrid />
        <PersonaCards />
        <DemoCTA />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage; 