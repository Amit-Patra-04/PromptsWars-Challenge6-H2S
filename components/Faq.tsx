'use client';

import React, { useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is a thermal inversion and why does it make winter smog dangerous?',
      a: 'A thermal inversion occurs when a layer of warm air aloft traps cooler air close to the ground like a lid. During calm winter nights, ground heat radiates into space while warm air masses slide overhead. Because cooler air is denser, it cannot rise. Particulate matter, vehicular nitrogen oxides, and heating smoke accumulate continuously at breathing height.',
    },
    {
      q: 'How does AeroPulse calculate PM2.5 inhaled dose reduction?',
      a: 'We calculate avoided dose in micrograms using pulmonary minute ventilation rates (0.35 to 1.80 cubic meters per hour depending on age and activity) multiplied by exposure duration and the concentration differential between unmitigated indoor or outdoor air and your filtered clean room.',
    },
    {
      q: 'Can a DIY Corsi Rosenthal box match commercial HEPA purifiers?',
      a: 'Yes. Multiple peer reviewed engineering studies show that a twenty inch box fan equipped with four MERV 13 pleated filters delivers clean air delivery rates exceeding 320 CFM. This rivals high end commercial air purifiers at roughly one fifth of the cost, making large volume clean rooms accessible to all families.',
    },
    {
      q: 'Where does AeroPulse source atmospheric and air quality data?',
      a: 'Outdoor atmospheric data is collected from the Open Meteo Air Quality API, integrating Copernicus Atmosphere Monitoring Service (CAMS) and NOAA GFS aerosol models, combined with planetary boundary layer height forecasts and OpenAQ ground reference station feeds.',
    },
    {
      q: 'How does Google Vertex AI Gemini 3 personalize recommendations?',
      a: 'Gemini 3 analyzes the real time atmospheric snapshot against your family demographic vulnerabilities, dwelling insulation quality, and cooking appliances. It computes optimal hourly windows when the planetary boundary layer expands to allow safe room ventilation, and generates low emission substitutes.',
    },
    {
      q: 'Why should I avoid dry sweeping during high smog periods?',
      a: 'Dry sweeping resuspends fine soot and settled coarse particulates back into the breathing zone, causing indoor spikes of 25 to 40 micrograms per cubic meter for up to three hours. AeroPulse recommends damp microfiber surface cleaning or vacuums with certified HEPA exhaust filters.',
    },
    {
      q: 'Is my household information kept private?',
      a: 'Yes. All household profile configurations are evaluated ephemerally. We do not store, profile, or sell individual household coordinates or demographic selections.',
    },
    {
      q: 'What are the WHO 2021 guidelines for PM2.5 exposure?',
      a: 'The World Health Organization recommends that annual average PM2.5 exposure not exceed 5 micrograms per cubic meter, and that 24 hour average exposure not exceed 15 micrograms per cubic meter. During winter smog episodes, urban levels frequently exceed WHO thresholds by 10 to 30 fold.',
    },
  ];

  return (
    <section id="faq" className="py-700 px-100 max-w-4xl mx-auto border-t border-border-subtle scroll-mt-900">
      <div className="text-center max-w-2xl mx-auto mb-500">
        <h2 className="heading-3 text-white tracking-tight mb-100">
          Frequently Answered Questions
        </h2>
        <p className="body-3 text-neutral-400">
          Practical science, pulmonary protection, and engineering facts for severe winter smog episodes.
        </p>
      </div>

      <div className="flex flex-col gap-100">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-surface-1 border border-border-default rounded-xl transition-all duration-300 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-150 text-left text-white title-3 hover:bg-surface-2 transition-colors duration-200"
              >
                <span>{faq.q}</span>
                <CaretDown
                  size={18}
                  weight="bold"
                  className={`text-neutral-400 shrink-0 ml-100 transition-transform duration-300 ease-base ${
                    isOpen ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-150 pb-150 pt-25 text-neutral-300 body-4 border-t border-border-subtle bg-surface-1">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
