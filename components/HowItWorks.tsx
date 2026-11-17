'use client';

import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Detect atmospheric inversion risk',
      description:
        'We stream hourly fine particulates, nitrogen dioxide, and planetary boundary layer height from open satellite and reference monitoring networks.',
    },
    {
      step: '02',
      title: 'Configure household vulnerability',
      description:
        'Specify your family demographics, respiratory sensitivities, home insulation quality, and primary heating system in less than thirty seconds.',
    },
    {
      step: '03',
      title: 'Receive verified action routines',
      description:
        'Google Gemini 3 and our deterministic engine deliver hourly ventilation windows, low cost filtration plans, and auditable emission abatement metrics.',
    },
  ];

  return (
    <section className="py-700 px-100 max-w-6xl mx-auto border-t border-border-subtle">
      <div className="text-center max-w-2xl mx-auto mb-500">
        <h2 className="heading-3 text-white tracking-tight mb-100">
          How AeroPulse Works
        </h2>
        <p className="body-3 text-neutral-400">
          A three phase agentic workflow connecting atmospheric telemetry to personalized family actions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-300">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="bg-surface-1 border border-border-default rounded-2xl p-200 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-3xl font-semibold text-neutral-500 block mb-150">
                {item.step}
              </span>
              <h3 className="title-2 text-white mb-75">{item.title}</h3>
              <p className="body-5 text-neutral-400">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
