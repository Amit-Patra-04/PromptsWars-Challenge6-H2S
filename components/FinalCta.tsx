'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Sparkle } from '@phosphor-icons/react';

interface FinalCtaProps {
  onLaunchAdvisor: () => void;
}

export default function FinalCta({ onLaunchAdvisor }: FinalCtaProps) {
  return (
    <section className="py-800 px-100 max-w-4xl mx-auto text-center border-t border-border-subtle">
      <div className="bg-surface-1 border border-border-default rounded-3xl p-400 md:p-600 relative overflow-hidden">
        <div className="inline-flex items-center gap-50 bg-surface-2 border border-border-subtle rounded-full px-100 py-25 mb-200">
          <Sparkle size={14} weight="bold" className="text-white" />
          <span className="caption-4 text-neutral-300">Public Health Initiative</span>
        </div>

        <h2 className="heading-2 hero-gradient-text max-w-xl mx-auto mb-150">
          Breathe cleaner air in your home today
        </h2>

        <p className="body-2 text-neutral-400 max-w-lg mx-auto mb-300">
          Protect vulnerable lungs from severe winter inversion episodes with verified deterministic routines and Gemini 3 guidance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-100 mb-200">
          <button
            type="button"
            onClick={onLaunchAdvisor}
            className="inline-flex items-center gap-75 bg-white hover:bg-neutral-200 text-black py-75 px-100 rounded-lg button-md transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span>Launch air advisor</span>
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-150 caption-4 text-neutral-500">
          <span>Zero signup required</span>
          <span>·</span>
          <span>Open public health tool</span>
          <span>·</span>
          <span>Ephemerally processed</span>
        </div>
      </div>
    </section>
  );
}
