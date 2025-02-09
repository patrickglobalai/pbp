import React from 'react';
import { Navbar } from '../components/home/Navbar';
import { HeroSection } from '../components/home/HeroSection';
import { FoundationsSection } from '../components/home/FoundationsSection';
import { BenefitsSection } from '../components/home/BenefitsSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { AudienceSection } from '../components/home/AudienceSection';
import { BarriersSection } from '../components/home/BarriersSection';
import { GainsSection } from '../components/home/GainsSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';

export function HomePage() {
  return (
    <div className="min-h-screen ai-gradient-bg">
      <Navbar />
      <HeroSection />
      <FoundationsSection />
      <BenefitsSection />
      <HowItWorksSection />
      <AudienceSection />
      <BarriersSection />
      <GainsSection />
      <TestimonialsSection />
    </div>
  );
}