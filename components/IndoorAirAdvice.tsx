'use client';

import React, { useState } from 'react';
import {
  Fan,
  Fire,
  Broom,
  Drop,
  ShieldCheck,
  Warning,
  Info,
  CheckCircle,
  Sparkle,
  Sliders,
} from '@phosphor-icons/react';
import {
  WINTER_INDOOR_HACKS,
  EPA_AUTHORITATIVE_FINDINGS,
  IndoorHack,
  getTailoredIndoorAdvice,
} from '@/lib/indoor-advice';

export default function IndoorAirAdvice() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hasGasCooking, setHasGasCooking] = useState<boolean>(true);
  const [hasVulnerableFamily, setHasVulnerableFamily] = useState<boolean>(true);
  const [hasFuelHeating, setHasFuelHeating] = useState<boolean>(false);

  // Compute customized advice based on household profile
  const tailoredResult = getTailoredIndoorAdvice({
    hasGasCooking,
    hasChildrenOrElderly: hasVulnerableFamily,
    heatingSource: hasFuelHeating ? 'natural_gas' : 'heat_pump',
  });

  const allHacks = [...tailoredResult.highPriorityHacks, ...tailoredResult.standardHacks];

  const filteredHacks = selectedCategory === 'all'
    ? allHacks
    : allHacks.filter(h => h.category === selectedCategory);

  const getCategoryIcon = (category: IndoorHack['category']) => {
    switch (category) {
      case 'filtration':
        return <Fan size={20} weight="bold" className="text-white" />;
      case 'ventilation':
        return <Fan size={20} weight="bold" className="text-emerald-400" />;
      case 'combustion_safety':
        return <Fire size={20} weight="bold" className="text-amber-400" />;
      case 'cleaning':
        return <Broom size={20} weight="bold" className="text-sky-400" />;
      case 'humidity_control':
        return <Drop size={20} weight="bold" className="text-cyan-400" />;
      default:
        return <ShieldCheck size={20} weight="bold" className="text-white" />;
    }
  };

  return (
    <section id="indoor-advice" className="py-700 px-100 max-w-6xl mx-auto border-t border-border-subtle scroll-mt-900">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-500">
        <div className="inline-flex items-center gap-50 bg-surface-2 border border-border-subtle rounded-full px-100 py-25 mb-150">
          <ShieldCheck size={14} weight="bold" className="text-white" />
          <span className="caption-4 text-neutral-300">EPA & WHO Clean Air Science</span>
        </div>
        <h2 className="heading-3 text-white tracking-tight mb-100">
          Winter Indoor Air Quality Hacks
        </h2>
        <p className="body-3 text-neutral-400">
          Authoritative indoor protection protocols cross referencing United States Environmental Protection Agency guidance and peer reviewed building physics.
        </p>
      </div>

      {/* Prominent EPA Cross-Reference Callout Banner */}
      <div className="bg-surface-1 border border-border-default rounded-2xl p-250 md:p-300 mb-400 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-200">
          <div className="max-w-2xl">
            <div className="flex items-center gap-75 mb-75">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="caption-4 font-mono text-amber-300 uppercase tracking-wider">
                Authoritative EPA Science Finding
              </span>
            </div>
            <h3 className="heading-5 text-white mb-75">
              {EPA_AUTHORITATIVE_FINDINGS.indoorOutdoorRatio}
            </h3>
            <p className="body-4 text-neutral-300 mb-100">
              During winter months, families tightly seal windows and doors to preserve indoor heat. Without deliberate mechanical exhaust and active filtration, indoor generated emissions from cooking, gas heaters, and dry cleaning accumulate into dangerous concentrations.
            </p>
            <div className="caption-5 text-neutral-400 font-mono">
              Citation: {EPA_AUTHORITATIVE_FINDINGS.citationPublication}
            </div>
          </div>

          <div className="bg-surface-2 border border-border-subtle rounded-xl p-150 shrink-0 w-full md:w-auto text-center md:text-left">
            <span className="caption-5 text-neutral-400 block mb-25">EXTREME WINTER SPIKE</span>
            <span className="text-3xl font-mono font-semibold text-amber-400">
              10x to 100x
            </span>
            <span className="caption-5 text-neutral-300 block mt-25 max-w-[200px]">
              indoor pollutant levels recorded during unvented cooking or kerosene heating
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Household Constraint Toggles */}
      <div className="bg-surface-1 border border-border-subtle rounded-xl p-150 mb-300 flex flex-wrap items-center justify-between gap-100">
        <div className="flex items-center gap-75">
          <Sliders size={18} weight="bold" className="text-white shrink-0" />
          <span className="caption-2 text-white font-medium">Tailor Hacks to Household Risks:</span>
        </div>

        <div className="flex flex-wrap items-center gap-75">
          <button
            type="button"
            onClick={() => setHasGasCooking(!hasGasCooking)}
            className={`py-50 px-75 rounded-lg border caption-3 transition-all duration-300 ${
              hasGasCooking
                ? 'bg-surface-3 border-white text-white font-medium'
                : 'bg-surface-2 border-border-subtle text-neutral-400 hover:text-white'
            }`}
          >
            Gas Cooktop Present
          </button>

          <button
            type="button"
            onClick={() => setHasFuelHeating(!hasFuelHeating)}
            className={`py-50 px-75 rounded-lg border caption-3 transition-all duration-300 ${
              hasFuelHeating
                ? 'bg-surface-3 border-white text-white font-medium'
                : 'bg-surface-2 border-border-subtle text-neutral-400 hover:text-white'
            }`}
          >
            Gas or Fuel Heating
          </button>

          <button
            type="button"
            onClick={() => setHasVulnerableFamily(!hasVulnerableFamily)}
            className={`py-50 px-75 rounded-lg border caption-3 transition-all duration-300 ${
              hasVulnerableFamily
                ? 'bg-surface-3 border-white text-white font-medium'
                : 'bg-surface-2 border-border-subtle text-neutral-400 hover:text-white'
            }`}
          >
            Infants or Elderly at Home
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-50 mb-400">
        {[
          { id: 'all', label: 'All Winter Hacks' },
          { id: 'filtration', label: 'HEPA & Clean Rooms' },
          { id: 'ventilation', label: 'Cooking & Exhaust' },
          { id: 'combustion_safety', label: 'Heaters & Combustion' },
          { id: 'cleaning', label: 'Damp Cleaning' },
          { id: 'humidity_control', label: 'Humidity Balance' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={`py-50 px-100 rounded-full border caption-3 transition-all duration-300 ${
              selectedCategory === tab.id
                ? 'bg-white text-black border-white font-semibold'
                : 'bg-surface-1 text-neutral-400 border-border-subtle hover:text-white hover:bg-surface-2'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Hacks: Nested Radius Formula (outer rounded-2xl 16px, gap 12px, inner rounded-lg 8px) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-300 items-start">
        {filteredHacks.map((hack) => (
          <article
            key={hack.id}
            className="bg-surface-1 border border-border-default rounded-2xl p-200 transition-all duration-500 ease-base hover:border-border-strong flex flex-col justify-between h-full"
          >
            <div>
              {/* Header: Icon, Category & Quantified Metric Badge */}
              <div className="flex items-start justify-between gap-100 mb-150">
                <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border-subtle flex items-center justify-center shrink-0">
                  {getCategoryIcon(hack.category)}
                </div>
                <div className="bg-surface-2 border border-border-subtle text-emerald-400 font-mono caption-4 py-25 px-75 rounded-md text-right">
                  {hack.highlightStat}
                </div>
              </div>

              {/* Title */}
              <h3 className="title-2 text-white mb-100 leading-snug">
                {hack.title}
              </h3>

              {/* Brief Impact Explanation (Explicitly Required by User) */}
              <div className="bg-surface-2 border border-border-subtle rounded-xl p-100 mb-150">
                <span className="caption-5 font-mono text-neutral-400 block mb-25">
                  VERIFIED DIRECT IMPACT
                </span>
                <p className="body-4 text-white font-medium">
                  {hack.impactExplanation}
                </p>
              </div>

              {/* Actionable Steps */}
              <div className="mb-200">
                <span className="caption-4 text-neutral-300 font-medium block mb-50">
                  Execution Protocol:
                </span>
                <ul className="space-y-50 caption-4 text-neutral-300">
                  {hack.actionSteps.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-50">
                      <CheckCircle size={14} weight="bold" className="text-neutral-400 shrink-0 mt-25" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Attribution & Winter Context */}
            <div className="pt-150 border-t border-border-subtle flex flex-col gap-50 caption-5 text-neutral-400">
              <div className="flex items-center gap-50">
                <Info size={14} weight="bold" className="text-neutral-400 shrink-0" />
                <span>Source: {hack.authoritativeSource}</span>
              </div>
              <p className="text-neutral-500">
                Winter Context: {hack.winterRelevance}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
