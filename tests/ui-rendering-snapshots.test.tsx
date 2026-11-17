import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import LocationInput from '../components/LocationInput';
import ProfileBuilder from '../components/ProfileBuilder';
import SuggestionsDisplay from '../components/SuggestionsDisplay';
import IndoorAirAdvice from '../components/IndoorAirAdvice';
import GreenerAlternatives from '../components/GreenerAlternatives';
import { WINTER_SMOG_HOTSPOTS } from '../lib/aqi-service';
import { AdvisorResponse } from '../lib/types';

describe('UI Rendering & Component Snapshot Tests', () => {
  it('renders LocationInput and matches snapshot', () => {
    const { container } = render(
      <LocationInput
        selectedCity={WINTER_SMOG_HOTSPOTS[0]}
        onSelectCity={vi.fn()}
        customLat="28.6139"
        customLon="77.2090"
        onCustomLatChange={vi.fn()}
        onCustomLonChange={vi.fn()}
        isCustomMode={false}
        onToggleCustomMode={vi.fn()}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('renders ProfileBuilder with accessible slider and matches snapshot', () => {
    const { container } = render(
      <ProfileBuilder
        cohorts={['infants', 'elderly']}
        onToggleCohort={vi.fn()}
        dwelling="apartment_highrise"
        onDwellingChange={vi.fn()}
        heating="natural_gas"
        onHeatingChange={vi.fn()}
        commute="solo_car_gas"
        onCommuteChange={vi.fn()}
        roomAreaSqM={28}
        onRoomAreaChange={vi.fn()}
        hasAirPurifier={true}
        onHasAirPurifierChange={vi.fn()}
        onGenerateAdvice={vi.fn()}
        isGenerating={false}
        canGenerate={true}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('renders SuggestionsDisplay with metrics and matches snapshot', () => {
    const mockAdvisorData: AdvisorResponse = {
      summary: 'Atmospheric telemetry in Delhi indicates 275 US AQI with severe inversion.',
      alertLevel: 'unhealthy',
      inversionAlert: 'Severe thermal inversion active.',
      routines: [
        {
          id: 'routine-shift-window',
          category: 'routine',
          title: 'Shift morning transit to afternoon inversion trough',
          description: 'Delay outdoor errands until solar warming elevates the boundary layer.',
          timeWindow: '1:30 PM to 4:00 PM',
          pm25AvoidedUg: 120,
          carbonSavedKg: 0.0,
          impactBreakdown: {
            formula: 'Avoided Dose = (V_outdoor * C_ambient - V_indoor * C_filtered) * 0.75h',
            variables: { 'Ambient PM2.5': '195 µg/m³' },
            assumptions: ['EPA 2011 Inhalation Rate is 1.80 m³/h.'],
          },
          priority: 'urgent',
          implementationDifficulty: 'immediate',
        },
      ],
      indoorHacks: [
        {
          id: 'hack-clean-room',
          category: 'indoor_hack',
          title: 'Establish a positive-pressure clean room with weatherstripping',
          description: 'Weatherstrip door sweeps and run air cleaner continuously.',
          pm25AvoidedUg: 310,
          carbonSavedKg: 0.45,
          impactBreakdown: {
            formula: 'Avoided Dose = V_sleep * (C_unfiltered - C_sealed) * 8.0h',
            variables: { 'Sleep Rate': '0.6 m³/h' },
            assumptions: ['Sealing drops infiltration to 0.15.'],
          },
          priority: 'high',
          implementationDifficulty: 'immediate',
        },
      ],
      greenAlternatives: [
        {
          id: 'alt-metro',
          category: 'green_alternative',
          title: 'Shift commute to metro transit',
          description: 'Transitioning to metro rail cuts neighborhood emissions.',
          pm25AvoidedUg: 65,
          carbonSavedKg: 4.85,
          impactBreakdown: {
            formula: 'Carbon Saved = 24 km * 0.192 kg/km * 0.75 reduction',
            variables: { Distance: '24 km' },
            assumptions: ['DEFRA 2023 passenger car factor.'],
          },
          priority: 'high',
          implementationDifficulty: 'planned',
        },
      ],
      totalAvoidedPm25Ug: 495,
      totalSavedCarbonKg: 5.3,
      generatedAtIso: '2026-11-18T00:00:00.000Z',
      aiEngine: 'Google Cloud Vertex AI (Gemini 3)',
      language: 'en',
    };

    const { container } = render(<SuggestionsDisplay advisorData={mockAdvisorData} />);
    expect(container).toMatchSnapshot();
  });

  it('renders IndoorAirAdvice section with EPA 2-5x callout and matches snapshot', () => {
    const { container } = render(<IndoorAirAdvice />);
    expect(container).toMatchSnapshot();
  });

  it('renders GreenerAlternatives section with simulator and matches snapshot', () => {
    const { container } = render(<GreenerAlternatives />);
    expect(container).toMatchSnapshot();
  });
});
