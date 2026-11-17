'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Thermometer, Wind, Sparkle } from '@phosphor-icons/react';
import { SupportedLanguage, getTranslation } from '@/lib/i18n';

interface HeroProps {
  currentLang: SupportedLanguage;
  onExploreClick: () => void;
  onCalculatorClick: () => void;
}

export default function Hero({ currentLang, onExploreClick, onCalculatorClick }: HeroProps) {
  return (
    <section className="relative pt-900 mt-500 pb-500 px-100 flex flex-col items-center text-center">
      {/* Live Atmospheric Status Pill (Positioned with clear vertical buffer below fixed navbar) */}
      <div className="inline-flex items-center gap-75 bg-surface-2 border border-border-default rounded-full px-100 py-25 mb-300 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="caption-4 text-neutral-300">
          Live atmospheric telemetry active across winter inversion zones
        </span>
      </div>

      {/* Hero Heading: Max width 680px, Text Gradient #FFFFFF -> #9B9B9B, No hyphens */}
      <h1 className="heading-1 hero-gradient-text max-w-[680px] tracking-tight mb-200">
        Safeguard your family from severe winter smog
      </h1>

      {/* Subheading: Max width 680px */}
      <p className="body-2 text-neutral-400 max-w-[680px] mb-400">
        {getTranslation(currentLang, 'heroSubhead')}
      </p>

      {/* Action Buttons: Main Button padding 8px py, 12px px */}
      <div className="flex flex-wrap items-center justify-center gap-100 mb-400">
        <button
          type="button"
          onClick={onExploreClick}
          className="inline-flex items-center gap-75 bg-white hover:bg-neutral-200 text-black py-75 px-100 rounded-lg button-md transition-all duration-300 ease-base active:scale-95 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <span>{getTranslation(currentLang, 'primaryCta')}</span>
          <ArrowRight size={16} weight="bold" />
        </button>

        <button
          type="button"
          onClick={onCalculatorClick}
          className="inline-flex items-center gap-75 bg-surface-2 hover:bg-surface-3 text-white border border-border-default py-75 px-100 rounded-lg button-md transition-all duration-300 ease-base active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <Wind size={16} weight="bold" className="text-neutral-300" />
          <span>{getTranslation(currentLang, 'secondaryCta')}</span>
        </button>
      </div>

      {/* One Proof Signal */}
      <div className="flex items-center justify-center gap-100 max-w-xl text-neutral-400 caption-2 pt-200 border-t border-border-subtle">
        <Sparkle size={16} weight="bold" className="text-neutral-300 shrink-0" />
        <span>{getTranslation(currentLang, 'proofLine')}</span>
      </div>
    </section>
  );
}
