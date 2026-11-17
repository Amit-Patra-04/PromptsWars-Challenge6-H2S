'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AirAdvisorStudio from '@/components/AirAdvisorStudio';
import IndoorAirAdvice from '@/components/IndoorAirAdvice';
import GreenerAlternatives from '@/components/GreenerAlternatives';
import TaglineReveal from '@/components/TaglineReveal';
import Benefits from '@/components/Benefits';
import HowItWorks from '@/components/HowItWorks';
import CadrCalculator from '@/components/CadrCalculator';
import CommunityProof from '@/components/CommunityProof';
import Faq from '@/components/Faq';
import FinalCta from '@/components/FinalCta';
import Footer from '@/components/Footer';
import { SupportedLanguage } from '@/lib/i18n';

export default function Home() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');

  const scrollToAdvisor = () => {
    const el = document.getElementById('advisor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onLaunchAdvisor={scrollToAdvisor}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <Hero
          currentLang={currentLang}
          onExploreClick={scrollToAdvisor}
          onCalculatorClick={scrollToCalculator}
        />

        {/* Core Interactive Air Advisor Studio */}
        <AirAdvisorStudio currentLang={currentLang} />

        {/* Dedicated Winter Indoor Air Quality Advice & EPA Science Section */}
        <IndoorAirAdvice />

        {/* Greener Alternatives & Quantified Emission Reductions Section */}
        <GreenerAlternatives />

        {/* Mandatory Tagline Reveal Section (B11) */}
        <TaglineReveal />

        {/* Benefits Section */}
        <Benefits />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Interactive DIY CADR & Clean Room Calculator */}
        <CadrCalculator />

        {/* Community Proof & Municipal Metrics */}
        <CommunityProof />

        {/* Frequently Answered Questions */}
        <Faq />

        {/* Final Call to Action */}
        <FinalCta onLaunchAdvisor={scrollToAdvisor} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
