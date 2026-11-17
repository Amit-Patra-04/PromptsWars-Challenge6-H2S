'use client';

import React from 'react';
import { House, Sparkle, Sliders, Users, CheckSquare, Square } from '@phosphor-icons/react';
import {
  UserProfile,
  VulnerabilityCohort,
  DwellingType,
  HeatingSource,
  CommuteMode,
} from '@/lib/types';

/**
 * ACCESSIBILITY FEATURES (WCAG 2.1 AA/AAA Compliant):
 * -----------------------------------------------------------------------------------------
 * 1. Form Landmarks: Uses semantic <fieldset>, <legend>, and explicit <label htmlFor="..."> tags.
 * 2. Range Slider: Uses native range input augmented with role="slider", aria-valuenow,
 *    aria-valuemin, aria-valuemax, and aria-valuetext.
 * 3. Cohort Toggles: Interactive buttons carry aria-pressed="true|false" and explicit names.
 * 4. High Contrast & Focus States: All inputs have high-contrast borders and 2px visible focus rings.
 * 5. Screen Reader Announcements: Loading state announced via role="status" and aria-live="polite".
 * -----------------------------------------------------------------------------------------
 */

interface ProfileBuilderProps {
  cohorts: VulnerabilityCohort[];
  onToggleCohort: (cohort: VulnerabilityCohort) => void;
  dwelling: DwellingType;
  onDwellingChange: (dwelling: DwellingType) => void;
  heating: HeatingSource;
  onHeatingChange: (heating: HeatingSource) => void;
  commute: CommuteMode;
  onCommuteChange: (commute: CommuteMode) => void;
  roomAreaSqM: number;
  onRoomAreaChange: (area: number) => void;
  hasAirPurifier: boolean;
  onHasAirPurifierChange: (hasPurifier: boolean) => void;
  onGenerateAdvice: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
}

export default function ProfileBuilder({
  cohorts,
  onToggleCohort,
  dwelling,
  onDwellingChange,
  heating,
  onHeatingChange,
  commute,
  onCommuteChange,
  roomAreaSqM,
  onRoomAreaChange,
  hasAirPurifier,
  onHasAirPurifierChange,
  onGenerateAdvice,
  isGenerating,
  canGenerate,
}: ProfileBuilderProps) {
  const cohortOptions: { id: VulnerabilityCohort; label: string; desc: string }[] = [
    { id: 'infants', label: 'Infants & Toddlers', desc: '0-2 years, heightened respiratory ventilation' },
    { id: 'elderly', label: 'Elderly Seniors', desc: '65+ years, cardiopulmonary vulnerability' },
    { id: 'pregnant', label: 'Pregnant Women', desc: 'Elevated baseline tidal volume' },
    { id: 'asthma_respiratory', label: 'Asthma or COPD', desc: 'Sensitive airway hyper responsiveness' },
    { id: 'healthy_adult', label: 'Healthy Adults', desc: 'Standard baseline resting rate' },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onGenerateAdvice();
      }}
      className="bg-surface-1 border border-border-default rounded-2xl p-200"
      aria-label="Household Air Quality Profile Configuration"
    >
      {/* Header Landmark */}
      <header className="flex items-center gap-75 pb-100 mb-200 border-b border-border-subtle">
        <House size={20} weight="bold" className="text-white" aria-hidden="true" />
        <h3 className="title-3 text-white">Household Vulnerabilities & Dwelling</h3>
      </header>

      {/* Cohort Multi-select Fieldset */}
      <fieldset className="mb-200 border-0 p-0 m-0">
        <legend className="caption-3 text-neutral-300 block mb-75 font-medium">
          Select Vulnerable Cohorts at Home (Multi-select)
        </legend>
        <div className="flex flex-wrap gap-50" role="group" aria-label="Demographic Cohorts">
          {cohortOptions.map((item) => {
            const isChecked = cohorts.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isChecked}
                onClick={() => onToggleCohort(item.id)}
                className={`py-50 px-75 rounded-lg border caption-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isChecked
                    ? 'bg-white text-black border-white font-medium shadow-sm'
                    : 'bg-surface-2 text-neutral-400 border-border-subtle hover:text-white hover:bg-surface-3'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Dwelling Structure and Space Heating Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-100 mb-200">
        <div>
          <label
            htmlFor="select-dwelling-type"
            className="caption-4 text-neutral-300 block mb-25 font-medium"
          >
            Dwelling Structure
          </label>
          <select
            id="select-dwelling-type"
            value={dwelling}
            onChange={(e) => onDwellingChange(e.target.value as DwellingType)}
            className="w-full bg-surface-2 border border-border-subtle text-neutral-200 rounded-lg p-50 caption-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <option value="apartment_highrise">Apartment Highrise (Air Sealing Standard)</option>
            <option value="apartment_lowrise">Apartment Lowrise (Moderate Infiltration)</option>
            <option value="detached_house">Detached House (Higher Thermal Losses)</option>
            <option value="traditional_masonry">Traditional Masonry (High Draft Envelope)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="select-space-heating"
            className="caption-4 text-neutral-300 block mb-25 font-medium"
          >
            Primary Heating Source
          </label>
          <select
            id="select-space-heating"
            value={heating}
            onChange={(e) => onHeatingChange(e.target.value as HeatingSource)}
            className="w-full bg-surface-2 border border-border-subtle text-neutral-200 rounded-lg p-50 caption-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <option value="natural_gas">Natural Gas Boiler / Furnace</option>
            <option value="wood_biomass">Wood or Biomass Stove</option>
            <option value="electric_resistance">Electric Resistance Baseboard</option>
            <option value="heat_pump">Electric Heat Pump (COP &gt; 3.0)</option>
            <option value="district_steam">Municipal District Heating</option>
          </select>
        </div>
      </div>

      {/* Commute and Room Floor Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-100 mb-200">
        <div>
          <label
            htmlFor="select-commute-mode"
            className="caption-4 text-neutral-300 block mb-25 font-medium"
          >
            Daily Commute Method
          </label>
          <select
            id="select-commute-mode"
            value={commute}
            onChange={(e) => onCommuteChange(e.target.value as CommuteMode)}
            className="w-full bg-surface-2 border border-border-subtle text-neutral-200 rounded-lg p-50 caption-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <option value="solo_car_gas">Solo Gasoline Automobile</option>
            <option value="carpool">Shared Carpool (3+ Commuters)</option>
            <option value="public_transit">Subway, Train, or Bus</option>
            <option value="active_walking_cycling">Active Walking or Cycling</option>
          </select>
        </div>

        {/* Accessible Range Slider */}
        <div>
          <div className="flex justify-between items-center mb-25">
            <label
              htmlFor="input-room-area"
              className="caption-4 text-neutral-300 font-medium"
            >
              Main Living Room Area
            </label>
            <span
              className="font-mono text-sm text-white font-medium"
              aria-live="polite"
            >
              {roomAreaSqM} m²
            </span>
          </div>
          <input
            id="input-room-area"
            type="range"
            min={10}
            max={90}
            step={2}
            value={roomAreaSqM}
            onChange={(e) => onRoomAreaChange(parseInt(e.target.value))}
            role="slider"
            aria-valuenow={roomAreaSqM}
            aria-valuemin={10}
            aria-valuemax={90}
            aria-valuetext={`${roomAreaSqM} square meters`}
            className="w-full accent-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          />
        </div>
      </div>

      {/* Air Purifier Checkbox with Semantic Label */}
      <div className="flex items-center gap-75 mb-300 p-75 bg-surface-2 rounded-lg border border-border-subtle">
        <input
          id="checkbox-air-purifier"
          type="checkbox"
          checked={hasAirPurifier}
          onChange={(e) => onHasAirPurifierChange(e.target.checked)}
          className="w-4 h-4 rounded bg-surface-3 border-border-default text-white accent-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        />
        <label
          htmlFor="checkbox-air-purifier"
          className="caption-2 text-neutral-300 cursor-pointer select-none"
        >
          Dwelling currently operates an air purifier or HEPA cleaner
        </label>
      </div>

      {/* Submit Action Button */}
      <button
        type="submit"
        disabled={isGenerating || !canGenerate}
        aria-disabled={isGenerating || !canGenerate}
        className="w-full flex items-center justify-center gap-75 bg-white hover:bg-neutral-200 text-black py-75 px-100 rounded-lg button-md transition-all duration-300 ease-base active:scale-95 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        {isGenerating ? (
          <span className="flex items-center gap-50" role="status" aria-live="polite">
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <span>Synthesizing Gemini 3 Advice...</span>
          </span>
        ) : (
          <span className="flex items-center gap-50">
            <Sparkle size={18} weight="bold" aria-hidden="true" />
            <span>Generate AI Advisory Routine</span>
          </span>
        )}
      </button>
    </form>
  );
}
