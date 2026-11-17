'use client';

import React from 'react';
import { ShieldCheck, Wind, ChartLineUp, Globe } from '@phosphor-icons/react';

export default function Benefits() {
  const benefits = [
    {
      icon: <ShieldCheck size={24} weight="bold" className="text-white" />,
      title: 'Cut inhaled particulate burden by up to 74%',
      description:
        'Targeted air cleaner placement and timed ventilation windows reduce dangerous fine particulate lung penetration without expensive commercial appliances.',
    },
    {
      icon: <Wind size={24} weight="bold" className="text-white" />,
      title: 'Zero guesswork during atmospheric inversions',
      description:
        'Planetary boundary layer tracking alerts you precisely when toxic air is trapped near street level so you can shift outdoor exercise and commute times.',
    },
    {
      icon: <ChartLineUp size={24} weight="bold" className="text-white" />,
      title: 'Verified carbon and particulate savings',
      description:
        'Every suggested routine modification calculates exact kilograms of greenhouse emissions avoided and micrograms of toxic particulates bypassed.',
    },
    {
      icon: <Globe size={24} weight="bold" className="text-white" />,
      title: 'Accessible across six community languages',
      description:
        'Full localization in English, Hindi, Mandarin, Spanish, French, and Punjabi ensures immediate life safety guidance for multi generational families.',
    },
  ];

  return (
    <section id="benefits" className="py-700 px-100 max-w-6xl mx-auto scroll-mt-900">
      <div className="text-center max-w-2xl mx-auto mb-500">
        <h2 className="heading-3 text-white tracking-tight mb-100">
          Engineered for Community Resilience
        </h2>
        <p className="body-3 text-neutral-400">
          Public health guidance grounded in pulmonary inhalation models, atmospheric physics, and Google Vertex AI Gemini 3.
        </p>
      </div>

      {/* 4 Cards Grid - Nested Radius Formula: outer rounded-2xl (16px), gap 12px, inner icon rounded-lg (8px) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-300">
        {benefits.map((benefit, idx) => (
          <div
            key={idx}
            className="bg-surface-1 border border-border-default rounded-2xl p-200 transition-all duration-500 ease-base hover:border-border-strong flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border-subtle flex items-center justify-center mb-150">
                {benefit.icon}
              </div>
              <h3 className="title-2 text-white mb-75">{benefit.title}</h3>
              <p className="body-4 text-neutral-400">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
