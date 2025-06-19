import React from 'react';
import Head from 'next/head';
import { HeroSection } from '../components/HeroSection';
import { FeatureCard } from '../components/FeatureCard';
import { AgentShowcase } from '../components/AgentShowcase';
import { Testimonials } from '../components/Testimonials';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-900">Welcome to cmdctr 🚀</h1>
    </div>
  );
} 