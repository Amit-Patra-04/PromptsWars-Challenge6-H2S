'use client';

import React, { useState } from 'react';
import {
  Fire,
  Car,
  Broom,
  Thermometer,
  ShieldCheck,
  ArrowRight,
  Info,
  CheckCircle,
  Sparkle,
  Sliders,
  TreeEvergreen,
} from '@phosphor-icons/react';
import {
  GREENER_SWAPS_CATALOG,
  EPA_EMISSION_FACTORS,
  GreenerSwap,
  calculateDynamicSwapImpact,
} from '@/lib/greener-swaps';

export default function GreenerAlternatives() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Interactive Live Sizing State for Commuting & Heating Swaps
  const [commuteDistanceMiles, setCommuteDistanceMiles] = useState<number>(15);
  const [heatingHoursPerDay, setHeatingHoursPerDay] = useState<number>(6);
  const [activeInteractiveSwapId, setActiveInteractiveSwapId] = useState<string>('swap-transit-commute');

  const filteredSwaps = selectedCategory === 'all'
    ? GREENER_SWAPS_CATALOG
    : GREENER_SWAPS_CATALOG.filter(s => s.category === selectedCategory);

  // Dynamic impact computation for the interactive simulator widget
  const dynamicCommuteResult = calculateDynamicSwapImpact(activeInteractiveSwapId, {
    distanceMiles: commuteDistanceMiles,
    hoursPerDay: heatingHoursPerDay,
    daysPerWeek: 5,
  });

  const getCategoryIcon = (category: GreenerSwap['category']) => {
    switch (category) {
      case 'heating':
        return <Thermometer size={20} weight="bold" className="text-amber-400" />;
      case 'cooking':
        return <Fire size={20} weight="bold" className="text-orange-400" />;
      case 'commuting':
        return <Car size={20} weight="bold" className="text-emerald-400" />;
      case 'cleaning':
        return <Broom size={20} weight="bold" className="text-sky-400" />;
      case 'home_energy':
        return <TreeEvergreen size={20} weight="bold" className="text-lime-400" />;
      default:
        return <ShieldCheck size={20} weight="bold" className="text-white" />;
    }
  };

  return (
    <section id="greener-swaps" className="py-700 px-100 max-w-6xl mx-auto border-t border-border-subtle scroll-mt-900">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-500">
        <div className="inline-flex items-center gap-50 bg-surface-2 border border-border-subtle rounded-full px-100 py-25 mb-150">
          <Sparkle size={14} weight="bold" className="text-white" />
          <span className="caption-4 text-neutral-300">Quantified Carbon & Pollution Abatement</span>
        </div>
        <h2 className="heading-3 text-white tracking-tight mb-100">
          Sustainable Swaps & Greener Alternatives
        </h2>
        <p className="body-3 text-neutral-400">
          Enumerate high impact lifestyle and energy swaps. Every recommendation is paired with an exact quantitative calculation grounded in United States EPA emission factors.
        </p>
      </div>

      {/* Interactive Personal Impact Simulator Card */}
      <div className="bg-surface-1 border border-border-default rounded-2xl p-250 md:p-300 mb-400 relative overflow-hidden">
        <div className="flex items-center justify-between pb-150 mb-200 border-b border-border-subtle">
          <div className="flex items-center gap-75">
            <Sliders size={20} weight="bold" className="text-white" />
            <span className="title-2 text-white">Personalized Carbon Abatement Simulator</span>
          </div>
          <span className="caption-4 text-emerald-400 font-mono">EPA 404 G/MILE BENCHMARK</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-300 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 flex flex-col gap-200">
            <div>
              <div className="flex justify-between items-center mb-50">
                <label className="caption-3 text-neutral-300">
                  Round Trip Commute Distance
                </label>
                <span className="font-mono text-sm text-white">
                  {commuteDistanceMiles} miles ({Math.round(commuteDistanceMiles * 1.609)} km)
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={45}
                step={1}
                value={commuteDistanceMiles}
                onChange={(e) => {
                  setCommuteDistanceMiles(parseInt(e.target.value));
                  setActiveInteractiveSwapId('swap-transit-commute');
                }}
                aria-label="Commute distance in miles"
                className="w-full accent-white"
              />
              <span className="caption-5 text-neutral-500 mt-25 block">
                EPA Mobile Factor: Solo car emits 404 grams CO2 per mile (0.404 kg CO2e/mile).
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-50">
                <label className="caption-3 text-neutral-300">
                  Daily Kerosene or Space Heating Hours
                </label>
                <span className="font-mono text-sm text-white">
                  {heatingHoursPerDay} hours per winter day
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={14}
                step={1}
                value={heatingHoursPerDay}
                onChange={(e) => {
                  setHeatingHoursPerDay(parseInt(e.target.value));
                  setActiveInteractiveSwapId('swap-heat-pump');
                }}
                aria-label="Heating hours per day"
                className="w-full accent-white"
              />
              <span className="caption-5 text-neutral-500 mt-25 block">
                EPA Combustion Factor: Unvented kerosene heater emits 0.52 kg CO2e per operational hour.
              </span>
            </div>
          </div>

          {/* Real-time Dynamic Results Display */}
          <div className="lg:col-span-5 bg-surface-2 border border-border-subtle rounded-xl p-200 flex flex-col justify-between">
            <span className="caption-5 text-neutral-400 block mb-25">YOUR PROJECTED ABATEMENT</span>
            <div className="flex items-baseline gap-100 mb-100">
              <span className="text-4xl font-mono font-semibold text-emerald-400">
                {dynamicCommuteResult.dailyCo2SavedKg} kg
              </span>
              <span className="caption-3 text-neutral-300">CO2e saved daily</span>
            </div>

            <div className="bg-surface-3 border border-border-subtle rounded-lg p-100 mb-150">
              <span className="caption-5 text-neutral-400 block mb-25">ANNUAL CUMULATIVE IMPACT</span>
              <span className="text-2xl font-mono font-medium text-white">
                {dynamicCommuteResult.annualCo2SavedKg} kg CO2e / year
              </span>
              <span className="caption-5 text-neutral-400 block mt-25">
                equivalent to planting ~{Math.round(dynamicCommuteResult.annualCo2SavedKg / 21)} urban trees
              </span>
            </div>

            {/* User Requested Arrow Annotated Text */}
            <div className="caption-3 text-neutral-200 font-medium">
              <span className="text-emerald-400 mr-25">Summary:</span>
              <span>{dynamicCommuteResult.annotatedText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-50 mb-400">
        {[
          { id: 'all', label: 'All Sustainable Swaps' },
          { id: 'commuting', label: 'Commute & Travel' },
          { id: 'heating', label: 'Home Heating' },
          { id: 'cooking', label: 'Cooking Stoves' },
          { id: 'cleaning', label: 'Plant Cleaners' },
          { id: 'home_energy', label: 'Thermostats & Energy' },
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

      {/* Cards Grid: Nested Radius Formula (outer rounded-2xl 16px, gap 12px, inner rounded-lg 8px) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-300 items-start">
        {filteredSwaps.map((swap) => (
          <article
            key={swap.id}
            className="bg-surface-1 border border-border-default rounded-2xl p-200 transition-all duration-500 ease-base hover:border-border-strong flex flex-col justify-between h-full"
          >
            <div>
              {/* Header: Icon, Category Badge & Carbon Unit */}
              <div className="flex items-start justify-between gap-100 mb-150">
                <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border-subtle flex items-center justify-center shrink-0">
                  {getCategoryIcon(swap.category)}
                </div>
                <div className="bg-surface-2 border border-border-subtle text-emerald-400 font-mono caption-4 py-25 px-75 rounded-md text-right">
                  +{swap.carbonSavedKgPerUnit} {swap.carbonUnitLabel}
                </div>
              </div>

              {/* Title */}
              <h3 className="title-2 text-white mb-100 leading-snug">
                {swap.title}
              </h3>

              {/* User-Requested Format: Arrow Annotated UI Text */}
              <div className="bg-surface-2 border border-emerald-900/60 rounded-xl p-150 mb-150">
                <span className="caption-5 font-mono text-emerald-400 block mb-50 uppercase tracking-wider">
                  Annotated Quantitative Impact
                </span>
                <p className="body-4 text-white font-semibold leading-relaxed">
                  {swap.annotatedText}
                </p>
              </div>

              {/* Before vs After Swap Breakdown */}
              <div className="grid grid-cols-2 gap-100 mb-150 text-xs font-mono">
                <div className="bg-surface-2 p-100 rounded-lg border border-border-subtle">
                  <span className="caption-5 text-neutral-500 block mb-25 uppercase">Current Habit</span>
                  <span className="text-neutral-300 font-sans caption-4">{swap.currentHabit}</span>
                </div>
                <div className="bg-surface-2 p-100 rounded-lg border border-border-subtle">
                  <span className="caption-5 text-emerald-400 block mb-25 uppercase">Sustainable Swap</span>
                  <span className="text-white font-sans caption-4">{swap.greenerSwap}</span>
                </div>
              </div>

              {/* Pollutant Reduction Metric */}
              <div className="flex items-center gap-50 caption-3 text-neutral-300 mb-150">
                <CheckCircle size={16} weight="bold" className="text-emerald-400 shrink-0" />
                <span>Air Pollution Cut: {swap.pollutionReducedMetric}</span>
              </div>

              {/* Assumptions */}
              <div className="mb-150">
                <span className="caption-5 font-mono text-neutral-400 block mb-25">
                  SCIENTIFIC ASSUMPTIONS:
                </span>
                <ul className="space-y-25 caption-5 text-neutral-400 list-disc list-inside">
                  {swap.assumptions.map((asm, aIdx) => (
                    <li key={aIdx}>{asm}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* EPA Citation Footer */}
            <div className="pt-100 border-t border-border-subtle flex items-center gap-50 caption-5 text-neutral-500 font-mono">
              <Info size={14} weight="bold" className="text-neutral-400 shrink-0" />
              <span>Factor: {swap.epaFactorCitation}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
