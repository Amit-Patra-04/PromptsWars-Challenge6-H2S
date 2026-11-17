'use client';

import React from 'react';
import { Wind, ShieldCheck } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="border-t border-border-default bg-surface-base py-600 px-100 text-neutral-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-400 mb-500">
        {/* Brand Column */}
        <div className="max-w-sm">
          <div className="flex items-center gap-75 mb-100">
            <div className="w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center border border-border-subtle">
              <Wind size={16} weight="bold" className="text-white" />
            </div>
            <span className="title-3 text-white">AeroPulse</span>
          </div>
          <p className="caption-2 text-neutral-400 mb-150">
            GenAI urban air quality advisor safeguarding families and communities during severe winter smog and atmospheric inversions.
          </p>
          <div className="caption-5 text-neutral-500 font-mono">
            ENGINE: Google Cloud Vertex AI (Gemini 3) · Open Meteo CAMS · EPA & WHO 2021
          </div>
        </div>

        {/* Links Column 1: Scientific Standards */}
        <div>
          <span className="caption-3 text-white block mb-100 font-medium">Standards & Science</span>
          <ul className="space-y-50 caption-4">
            <li>
              <a
                href="https://www.who.int/publications/i/item/9789240034228"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                WHO 2021 Air Quality Guidelines
              </a>
            </li>
            <li>
              <a
                href="https://www.epa.gov/indoor-air-quality-iaq"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                EPA Indoor Air Quality Standards
              </a>
            </li>
            <li>
              <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                Open Meteo Atmospheric Models
              </a>
            </li>
            <li>
              <a
                href="https://openaq.org"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                OpenAQ Sensor Network
              </a>
            </li>
          </ul>
        </div>

        {/* Links Column 2: Legal & Privacy */}
        <div>
          <span className="caption-3 text-white block mb-100 font-medium">Privacy & Legal</span>
          <ul className="space-y-50 caption-4">
            <li>
              <a href="#privacy" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#terms" className="hover:text-white transition-colors duration-200">
                Terms of Public Use
              </a>
            </li>
            <li>
              <a href="#disclaimer" className="hover:text-white transition-colors duration-200">
                Health Disclaimer
              </a>
            </li>
            <li>
              <a href="#accessibility" className="hover:text-white transition-colors duration-200">
                Accessibility Statement
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto pt-300 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-100 caption-5 text-neutral-500">
        <p>© 2026 AeroPulse AI. Built with Google Vertex AI Gemini 3.</p>
        <p className="text-center sm:text-right">
          Advisory estimates are calculated for exposure reduction and do not substitute for individual clinical advice.
        </p>
      </div>
    </footer>
  );
}
