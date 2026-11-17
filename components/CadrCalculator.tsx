'use client';

import React, { useState } from 'react';
import { Fan, CheckCircle, Warning, Info } from '@phosphor-icons/react';
import { calculateCADR } from '@/lib/indoor-guidelines';

export default function CadrCalculator() {
  const [areaSqM, setAreaSqM] = useState(25);
  const [ceilingHeightM, setCeilingHeightM] = useState(2.5);
  const [targetACH, setTargetACH] = useState(5);

  const cadrResult = calculateCADR(areaSqM, ceilingHeightM, targetACH);

  return (
    <section id="calculator" className="py-700 px-100 max-w-6xl mx-auto border-t border-border-subtle scroll-mt-900">
      <div className="text-center max-w-2xl mx-auto mb-500">
        <h2 className="heading-3 text-white tracking-tight mb-100">
          DIY Clean Air Delivery Rate Calculator
        </h2>
        <p className="body-3 text-neutral-400">
          Size Corsi Rosenthal box fan arrays and commercial HEPA purifiers to achieve hospital grade air exchanges in your family clean room.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-300 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 bg-surface-1 border border-border-default rounded-2xl p-200">
          <div className="flex items-center gap-75 pb-100 mb-200 border-b border-border-subtle">
            <Fan size={20} weight="bold" className="text-white" />
            <span className="title-3 text-white">Room Geometry & Ventilation Goal</span>
          </div>

          <div className="flex flex-col gap-200">
            {/* Area */}
            <div>
              <div className="flex justify-between items-center mb-50">
                <label className="caption-3 text-neutral-300">Room Floor Area</label>
                <span className="font-mono text-sm text-white">{areaSqM} m² ({Math.round(areaSqM * 10.764)} sq ft)</span>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                step={2}
                value={areaSqM}
                onChange={(e) => setAreaSqM(parseInt(e.target.value))}
                aria-label="Room Floor Area in square meters"
                className="w-full accent-white"
              />
            </div>

            {/* Ceiling Height */}
            <div>
              <div className="flex justify-between items-center mb-50">
                <label className="caption-3 text-neutral-300">Ceiling Height</label>
                <span className="font-mono text-sm text-white">{ceilingHeightM} meters</span>
              </div>
              <input
                type="range"
                min={2.0}
                max={4.0}
                step={0.1}
                value={ceilingHeightM}
                onChange={(e) => setCeilingHeightM(parseFloat(e.target.value))}
                aria-label="Ceiling Height in meters"
                className="w-full accent-white"
              />
            </div>

            {/* Target ACH */}
            <div>
              <label className="caption-3 text-neutral-300 block mb-75">
                Target Clean Air Changes Per Hour (ACH)
              </label>
              <div className="grid grid-cols-3 gap-50">
                {[
                  { value: 3, label: '3 ACH', desc: 'Standard' },
                  { value: 5, label: '5 ACH', desc: 'Recommended' },
                  { value: 6, label: '6 ACH', desc: 'High Smog' },
                ].map((tier) => (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => setTargetACH(tier.value)}
                    className={`p-75 rounded-lg border text-center transition-all duration-300 ${
                      targetACH === tier.value
                        ? 'bg-surface-3 border-white text-white font-medium'
                        : 'bg-surface-2 border-border-subtle text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="caption-2 font-mono text-white">{tier.label}</div>
                    <div className="caption-5 text-neutral-400 mt-25">{tier.desc}</div>
                  </button>
                ))}
              </div>
              <span className="caption-5 text-neutral-500 mt-50 block">
                EPA and ASHRAE recommend 5 or more air changes per hour in clean rooms during severe wildfire and winter smog events.
              </span>
            </div>
          </div>
        </div>

        {/* Results Visualizer */}
        <div className="lg:col-span-7 bg-surface-1 border border-border-default rounded-2xl p-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-100 mb-200 border-b border-border-subtle">
              <span className="title-3 text-white">Sizing & Performance Output</span>
              <span className="caption-4 font-mono text-neutral-400">
                VOLUME: {cadrResult.roomVolumeM3} m³ ({cadrResult.roomVolumeCuFt} ft³)
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-150 mb-200">
              <div className="bg-surface-2 p-150 rounded-xl border border-border-subtle">
                <span className="caption-5 text-neutral-400 block mb-25">REQUIRED CLEAN AIR DELIVERY RATE</span>
                <span className="text-3xl font-mono font-semibold text-white">
                  {cadrResult.requiredCADRCfm} CFM
                </span>
                <span className="caption-5 text-neutral-400 block mt-25">
                  ({Math.round(cadrResult.requiredCADRCfm * 1.699)} m³/hour clean air)
                </span>
              </div>

              <div className="bg-surface-2 p-150 rounded-xl border border-border-subtle">
                <span className="caption-5 text-neutral-400 block mb-25">90% SMOG CLEARANCE TIME</span>
                <span className="text-3xl font-mono font-semibold text-emerald-400">
                  {cadrResult.estimatedPm25DecayMinutes} min
                </span>
                <span className="caption-5 text-neutral-400 block mt-25">
                  to reduce room particulate load by 90%
                </span>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="bg-surface-2 border border-border-subtle rounded-xl p-150 mb-200">
              <div className="flex items-start gap-75">
                {cadrResult.crBoxAdequate ? (
                  <CheckCircle size={20} weight="bold" className="text-emerald-400 shrink-0 mt-25" />
                ) : (
                  <Warning size={20} weight="bold" className="text-amber-400 shrink-0 mt-25" />
                )}
                <div>
                  <h4 className="title-3 text-white mb-25">
                    {cadrResult.crBoxAdequate
                      ? 'One Corsi Rosenthal Box Fan Is Fully Sufficient'
                      : 'Dual Filtration Units Required for This Volume'}
                  </h4>
                  <p className="body-5 text-neutral-300">
                    {cadrResult.filterRecommendation}. A standard 20 inch box fan fitted with four MERV 13 pleated filters delivers approximately 320 CFM of clean air delivery rate.
                  </p>
                </div>
              </div>
            </div>

            {/* Construction Checklist */}
            <div className="caption-3 text-neutral-400 pt-100 border-t border-border-subtle">
              <span className="text-neutral-300 font-medium block mb-50">
                DIY Corsi Rosenthal Construction Protocol:
              </span>
              <ol className="list-decimal list-inside space-y-25 text-neutral-400 caption-4">
                <li>Assemble four 20x20x2 inch MERV 13 filters in a cube with arrows pointing inward.</li>
                <li>Tape a cardboard bottom base and seal all filter edges airtight with duct tape.</li>
                <li>Mount the 20 inch box fan on top blowing upward, adding a 14 inch cardboard shroud to maximize flow efficiency.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
