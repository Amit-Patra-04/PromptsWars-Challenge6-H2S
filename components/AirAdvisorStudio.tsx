'use client';

import React, { useState, useEffect } from 'react';
import { Wind, Warning, Sparkle, ArrowRight } from '@phosphor-icons/react';
import {
  UserProfile,
  AtmosphericData,
  AdvisorResponse,
  VulnerabilityCohort,
  DwellingType,
  HeatingSource,
  CommuteMode,
} from '@/lib/types';
import { WINTER_SMOG_HOTSPOTS, CityPreset } from '@/lib/aqi-service';
import { SupportedLanguage } from '@/lib/i18n';
import LocationInput from './LocationInput';
import ProfileBuilder from './ProfileBuilder';
import SuggestionsDisplay from './SuggestionsDisplay';

/**
 * ACCESSIBILITY & RESPONSIVE ARCHITECTURE:
 * -----------------------------------------------------------------------------------------
 * - CSS Grid with 1 column on mobile (< 1024px) and 12 columns on desktop (>= 1024px).
 * - ARIA live regions for dynamic atmospheric and advisor updates.
 * - Modular components ensuring clean separation of concerns and keyboard focus flows.
 * -----------------------------------------------------------------------------------------
 */

interface AirAdvisorStudioProps {
  currentLang: SupportedLanguage;
}

export default function AirAdvisorStudio({ currentLang }: AirAdvisorStudioProps) {
  // Atmospheric State
  const [selectedCity, setSelectedCity] = useState<CityPreset>(WINTER_SMOG_HOTSPOTS[0]);
  const [customLat, setCustomLat] = useState('28.6139');
  const [customLon, setCustomLon] = useState('77.2090');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [atmosphericData, setAtmosphericData] = useState<AtmosphericData | null>(null);
  const [isAqiLoading, setIsAqiLoading] = useState(true);

  // User Profile State
  const [cohorts, setCohorts] = useState<VulnerabilityCohort[]>(['infants', 'elderly']);
  const [dwelling, setDwelling] = useState<DwellingType>('apartment_highrise');
  const [heating, setHeating] = useState<HeatingSource>('natural_gas');
  const [commute, setCommute] = useState<CommuteMode>('solo_car_gas');
  const [roomAreaSqM, setRoomAreaSqM] = useState(28);
  const [hasAirPurifier, setHasAirPurifier] = useState(false);

  // Advisor State
  const [advisorData, setAdvisorData] = useState<AdvisorResponse | null>(null);
  const [isAdvisorGenerating, setIsAdvisorGenerating] = useState(false);
  const [aqiError, setAqiError] = useState<string | null>(null);
  const [advisorError, setAdvisorError] = useState<string | null>(null);

  // Fetch AQI on city change
  const loadAqi = React.useCallback(async () => {
    setIsAqiLoading(true);
    setAqiError(null);
    try {
      const lat = isCustomMode ? parseFloat(customLat) || 28.6139 : selectedCity.latitude;
      const lon = isCustomMode ? parseFloat(customLon) || 77.2090 : selectedCity.longitude;
      const cityName = isCustomMode ? 'Custom Urban Coordinate' : selectedCity.name;

      const res = await fetch(`/api/aqi?lat=${lat}&lon=${lon}&city=${encodeURIComponent(cityName)}`);
      if (!res.ok) {
        throw new Error(`Atmospheric API responded with status ${res.status}`);
      }
      const data: AtmosphericData = await res.json();
      setAtmosphericData(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load atmospheric telemetry';
      console.error('Failed to load atmospheric data:', err);
      setAqiError(msg);
    } finally {
      setIsAqiLoading(false);
    }
  }, [selectedCity, isCustomMode, customLat, customLon]);

  useEffect(() => {
    loadAqi();
  }, [loadAqi]);

  // Generate Advisory Guidance
  const handleGenerateAdvice = async () => {
    if (!atmosphericData) return;
    setIsAdvisorGenerating(true);
    setAdvisorError(null);

    try {
      const userProfilePayload: UserProfile = {
        cohorts,
        dwelling,
        heating,
        commute,
        roomAreaSqM,
        ceilingHeightM: 2.6,
        hasAirPurifier,
        city: atmosphericData.city,
        latitude: atmosphericData.latitude,
        longitude: atmosphericData.longitude,
      };

      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: userProfilePayload,
          weather: atmosphericData,
          language: currentLang,
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || `Advisor engine error (status ${res.status})`);
      }

      const data: AdvisorResponse = await res.json();
      setAdvisorData(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to synthesize advisory guidance';
      console.error('Advisor generation error:', err);
      setAdvisorError(msg);
    } finally {
      setIsAdvisorGenerating(false);
    }
  };

  // Toggle Demographic Cohort
  const toggleCohort = (c: VulnerabilityCohort) => {
    if (cohorts.includes(c)) {
      if (cohorts.length > 1) {
        setCohorts(cohorts.filter(item => item !== c));
      }
    } else {
      setCohorts([...cohorts, c]);
    }
  };

  return (
    <section id="advisor" className="py-600 px-100 max-w-6xl mx-auto scroll-mt-900" aria-labelledby="studio-heading">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-500">
        <h2 id="studio-heading" className="heading-3 text-white tracking-tight mb-100">
          Interactive Air Quality &amp; Smog Advisor Studio
        </h2>
        <p className="body-3 text-neutral-400">
          Connect your local atmospheric telemetry with your family profile to generate low emission routines, indoor filtration hacks, and quantified health protection.
        </p>
      </div>

      {/* Grid: 2 Columns on desktop (>= 1024px), 1 Column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-300 items-start">
        {/* Left Column: Location, Live Atmospheric Telemetry & Profile Builder */}
        <div className="lg:col-span-5 flex flex-col gap-300">
          {/* Component 1: Semantic Location Input */}
          <LocationInput
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            customLat={customLat}
            customLon={customLon}
            onCustomLatChange={setCustomLat}
            onCustomLonChange={setCustomLon}
            isCustomMode={isCustomMode}
            onToggleCustomMode={setIsCustomMode}
          />

          {/* Live Atmospheric Sensor Board */}
          <div className="bg-surface-1 border border-border-default rounded-2xl p-200">
            <header className="flex items-center justify-between pb-100 mb-200 border-b border-border-subtle">
              <div className="flex items-center gap-75">
                <Wind size={20} weight="bold" className="text-white" aria-hidden="true" />
                <h3 className="title-3 text-white">Live Sensor Board</h3>
              </div>
              <span className="caption-4 text-emerald-400 font-mono">100% REAL TIME</span>
            </header>

            {/* Telemetry Error Alert if Occurred */}
            {aqiError && (
              <div
                role="alert"
                aria-live="assertive"
                className="bg-surface-amber/20 border border-amber-800/60 rounded-xl p-150 mb-200 text-center"
              >
                <div className="flex items-center justify-center gap-50 text-amber-300 caption-2 font-medium mb-50">
                  <Warning size={18} weight="bold" aria-hidden="true" />
                  <span>Atmospheric Telemetry Sync Interrupted</span>
                </div>
                <p className="caption-5 text-neutral-400 mb-100">{aqiError}</p>
                <button
                  type="button"
                  onClick={() => loadAqi()}
                  className="inline-flex items-center gap-50 bg-surface-2 hover:bg-surface-3 text-white border border-border-default py-25 px-75 rounded-md caption-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Retry Telemetry Sync
                </button>
              </div>
            )}

            {/* Inversion Alert Banner if Active */}
            {atmosphericData?.isInversion && (
              <aside
                role="alert"
                aria-label="Thermal Inversion Alert"
                className="bg-surface-amber border border-amber-800/60 rounded-xl p-100 mb-200 flex items-start gap-75"
              >
                <Warning size={20} weight="bold" className="text-amber-400 shrink-0 mt-25" aria-hidden="true" />
                <div>
                  <div className="caption-1 text-amber-300 font-medium">
                    Atmospheric Thermal Inversion Active
                  </div>
                  <p className="caption-5 text-amber-200/80 mt-25">
                    Planetary boundary layer compressed to {atmosphericData.boundaryLayerHeightM} meters. Surface pollutants trapped at breathing height.
                  </p>
                </div>
              </aside>
            )}

            {/* Sensor Readings Grid */}
            {isAqiLoading ? (
              <div className="space-y-75 py-200" aria-label="Loading atmospheric data">
                <div className="h-10 bg-surface-2 rounded-lg animate-pulse" />
                <div className="h-16 bg-surface-2 rounded-lg animate-pulse" />
              </div>
            ) : atmosphericData ? (
              <div className="flex flex-col gap-100">
                {/* Main AQI Pill */}
                <div className="bg-surface-2 border border-border-subtle rounded-xl p-100 flex items-center justify-between">
                  <div>
                    <span className="caption-4 text-neutral-400 block font-medium">US Air Quality Index</span>
                    <span className="text-3xl font-mono font-semibold text-white">
                      {atmosphericData.aqiUs}
                    </span>
                    <span className="caption-5 text-neutral-400 block mt-25">
                      {atmosphericData.aqiUs > 200 ? 'Hazardous Category' : 'Unhealthy Category'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="caption-4 text-neutral-400 block font-medium">Fine PM2.5</span>
                    <span className="text-3xl font-mono font-semibold text-amber-400">
                      {atmosphericData.pm25}
                    </span>
                    <span className="caption-5 text-neutral-400 block mt-25">µg/m³ (WHO limit: 15)</span>
                  </div>
                </div>

                {/* Secondary Telemetry Table with Semantic DL */}
                <dl className="grid grid-cols-3 gap-50 font-mono text-center caption-3 m-0">
                  <div className="bg-surface-2 p-50 rounded-lg border border-border-subtle">
                    <dt className="caption-5 text-neutral-400 block uppercase">PM10</dt>
                    <dd className="text-white m-0 font-medium">{atmosphericData.pm10} µg/m³</dd>
                  </div>
                  <div className="bg-surface-2 p-50 rounded-lg border border-border-subtle">
                    <dt className="caption-5 text-neutral-400 block uppercase">NO2</dt>
                    <dd className="text-white m-0 font-medium">{atmosphericData.no2} µg/m³</dd>
                  </div>
                  <div className="bg-surface-2 p-50 rounded-lg border border-border-subtle">
                    <dt className="caption-5 text-neutral-400 block uppercase">Boundary Layer</dt>
                    <dd className="text-white m-0 font-medium">{atmosphericData.boundaryLayerHeightM} m</dd>
                  </div>
                </dl>

                <footer className="caption-5 text-neutral-500 pt-50 flex items-center justify-between">
                  <span>Open Meteo &amp; CAMS Ensembles</span>
                  <span>{atmosphericData.temperatureC}°C · {atmosphericData.windSpeedKmh} km/h wind</span>
                </footer>
              </div>
            ) : null}
          </div>

          {/* Component 2: Semantic Profile Builder */}
          <ProfileBuilder
            cohorts={cohorts}
            onToggleCohort={toggleCohort}
            dwelling={dwelling}
            onDwellingChange={setDwelling}
            heating={heating}
            onHeatingChange={setHeating}
            commute={commute}
            onCommuteChange={setCommute}
            roomAreaSqM={roomAreaSqM}
            onRoomAreaChange={setRoomAreaSqM}
            hasAirPurifier={hasAirPurifier}
            onHasAirPurifierChange={setHasAirPurifier}
            onGenerateAdvice={handleGenerateAdvice}
            isGenerating={isAdvisorGenerating}
            canGenerate={atmosphericData !== null}
          />
        </div>

        {/* Right Column: AI Guidance, Actions & Direct Impact Visualizer */}
        <div className="lg:col-span-7 flex flex-col gap-300">
          {/* Advisory Error Alert if Occurred */}
          {advisorError && (
            <div
              role="alert"
              aria-live="assertive"
              className="bg-surface-amber/20 border border-amber-800/60 rounded-xl p-200 text-center"
            >
              <div className="flex items-center justify-center gap-50 text-amber-300 caption-2 font-medium mb-50">
                <Warning size={18} weight="bold" aria-hidden="true" />
                <span>Advisory Generation Notice</span>
              </div>
              <p className="caption-4 text-neutral-300 mb-100">{advisorError}</p>
              <button
                type="button"
                onClick={handleGenerateAdvice}
                disabled={isAdvisorGenerating}
                className="inline-flex items-center gap-50 bg-white hover:bg-neutral-200 text-black py-50 px-100 rounded-md caption-3 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Retry Synthesis
              </button>
            </div>
          )}

          {!advisorData && (
            <div className="bg-surface-1 border border-border-default rounded-2xl p-400 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center mb-200 border border-border-subtle">
                <Sparkle size={24} weight="bold" className="text-white" aria-hidden="true" />
              </div>
              <h3 className="title-1 text-white mb-75">
                Ready to Personalize Your Clean Air Routine
              </h3>
              <p className="body-4 text-neutral-400 max-w-md mb-300">
                Click Generate AI Advisory Routine to synthesize real time atmospheric inversion data with your household demographics using Google Gemini 3.
              </p>
              <button
                type="button"
                onClick={handleGenerateAdvice}
                disabled={isAdvisorGenerating || !atmosphericData}
                className="inline-flex items-center gap-75 bg-white hover:bg-neutral-200 text-black py-75 px-100 rounded-lg button-md transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Launch Advisory Engine</span>
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Component 3: Suggestions Display */}
          {advisorData && <SuggestionsDisplay advisorData={advisorData} />}
        </div>
      </div>
    </section>
  );
}
