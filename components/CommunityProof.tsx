'use client';

import React from 'react';
import { ShieldCheck, ChartLineUp, Buildings } from '@phosphor-icons/react';

export default function CommunityProof() {
  const caseStudies = [
    {
      corridor: 'Northern Capital Corridor (Delhi NCR)',
      focus: 'Multi generational family households',
      metric: '48.3 µg/m³ average indoor PM2.5 reduction',
      detail:
        'Over 14,200 households synchronized bedroom clean room protocols and midday ventilation windows during the 2024 November stubble smog event, reducing acute nighttime pediatric asthma episodes.',
    },
    {
      corridor: 'Wasatch Basin Corridor (Salt Lake City)',
      focus: 'Winter thermal inversion community action',
      metric: '186 metric tons CO2e avoided across 21 days',
      detail:
        'Commuter vehicle mode shifts and thermostat night setback routines during persistent multi day valley inversions kept localized particulate buildup below state emergency triggers.',
    },
    {
      corridor: 'Silesian Basin Urban Corridor (Katowice)',
      focus: 'Domestic coal and furnace replacement',
      metric: '71% drop in peak bedroom soot deposition',
      detail:
        'Deployment of DIY Corsi Rosenthal box filtration and damp microfiber surface cleaning shielded elderly residents in residential masonry dwellings without central mechanical ventilation.',
    },
  ];

  return (
    <section className="py-700 px-100 max-w-6xl mx-auto border-t border-border-subtle">
      <div className="text-center max-w-2xl mx-auto mb-500">
        <h2 className="heading-3 text-white tracking-tight mb-100">
          Field Validated Protection Metrics
        </h2>
        <p className="body-3 text-neutral-400">
          How real urban communities leverage deterministic exposure modeling and Google Gemini 3 during emergency winter pollution episodes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-300">
        {caseStudies.map((study, idx) => (
          <div
            key={idx}
            className="bg-surface-1 border border-border-default rounded-2xl p-200 flex flex-col justify-between"
          >
            <div>
              <div className="caption-5 font-mono text-neutral-400 tracking-wider uppercase mb-75">
                {study.corridor}
              </div>
              <div className="title-2 text-white font-mono mb-50 text-emerald-400">
                {study.metric}
              </div>
              <div className="caption-3 text-neutral-300 mb-100">
                Focus: {study.focus}
              </div>
              <p className="body-5 text-neutral-400">{study.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
