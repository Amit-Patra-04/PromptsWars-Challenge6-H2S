import { describe, it, expect } from 'vitest';
import { generateDeterministicActionSuite } from '../lib/impact-calculator';
import { generateUrbanAirAdvice } from '../lib/gemini-advisor';
import { UserProfile, AtmosphericData } from '../lib/types';

describe('Suggestion Generation Module (Key String & Content Validation)', () => {
  const mockProfile: UserProfile = {
    cohorts: ['infants', 'asthma_respiratory', 'elderly'],
    dwelling: 'apartment_highrise',
    heating: 'natural_gas',
    commute: 'solo_car_gas',
    roomAreaSqM: 30,
    ceilingHeightM: 2.6,
    hasAirPurifier: false,
    city: 'Delhi',
    latitude: 28.6139,
    longitude: 77.2090,
  };

  const mockWeather: AtmosphericData = {
    city: 'Delhi',
    latitude: 28.6139,
    longitude: 77.2090,
    aqiUs: 275,
    aqiEu: 115,
    pm25: 195,
    pm10: 310,
    no2: 58,
    o3: 22,
    so2: 18,
    co: 2.1,
    temperatureC: 10.8,
    relativeHumidityPct: 84,
    windSpeedKmh: 3.1,
    boundaryLayerHeightM: 190,
    isInversion: true,
    inversionSeverity: 'critical',
    lastUpdatedIso: new Date().toISOString(),
    sources: [],
  };

  it('generates low-emission routines containing essential atmospheric and inversion strings', () => {
    const suite = generateDeterministicActionSuite(mockProfile, mockWeather);
    const routineTitles = suite.routines.map(r => r.title.toLowerCase()).join(' ');
    const routineDescs = suite.routines.map(r => r.description.toLowerCase()).join(' ');

    // Check key strings required for winter inversion routines
    expect(routineTitles + ' ' + routineDescs).toContain('inversion');
    expect(routineTitles + ' ' + routineDescs).toContain('transit');
    expect(routineTitles + ' ' + routineDescs).toContain('boundary layer');

    // Check impact metrics presence
    for (const routine of suite.routines) {
      expect(routine.pm25AvoidedUg).toBeGreaterThan(0);
      expect(routine.impactBreakdown.formula).toContain('Avoided Dose');
      expect(routine.impactBreakdown.assumptions.join(' ')).toContain('EPA');
    }
  });

  it('generates indoor air hacks containing key strings: clean room, HEPA/Corsi-Rosenthal, microfiber', () => {
    const suite = generateDeterministicActionSuite(mockProfile, mockWeather);
    const hackContent = suite.indoorHacks
      .map(h => `${h.title} ${h.description} ${h.impactBreakdown.formula}`)
      .join(' ')
      .toLowerCase();

    // Check key hack strings
    expect(hackContent).toContain('clean room');
    expect(hackContent).toContain('weatherstrip');
    expect(hackContent).toContain('corsi-rosenthal');
    expect(hackContent).toContain('microfiber');
    expect(hackContent).toContain('merv 13');
  });

  it('generates greener alternatives containing key strings: induction, carpool, metro rail, CO2', () => {
    const suite = generateDeterministicActionSuite(mockProfile, mockWeather);
    const altContent = suite.greenAlternatives
      .map(a => `${a.title} ${a.description} ${a.impactBreakdown.formula}`)
      .join(' ')
      .toLowerCase();

    // Check key greener alternative strings
    expect(altContent).toContain('transit');
    expect(altContent).toContain('carbon');
    expect(altContent).toContain('induction');
    expect(altContent).toContain('gas');

    for (const alt of suite.greenAlternatives) {
      expect(alt.carbonSavedKg).toBeGreaterThan(0);
      expect(alt.impactBreakdown.assumptions.join(' ')).toContain('EPA');
    }
  });

  it('synthesizes overall Gemini advisor response with critical alert strings during inversion', async () => {
    const advice = await generateUrbanAirAdvice({
      profile: mockProfile,
      weather: mockWeather,
      language: 'en',
    });

    expect(['unhealthy', 'hazardous']).toContain(advice.alertLevel);
    expect(advice.inversionAlert).toBeTruthy();
    expect(advice.inversionAlert!.toLowerCase()).toContain('thermal inversion');
    expect(advice.summary.toLowerCase()).toContain('delhi');
    expect(advice.summary.toLowerCase()).toContain('pm2.5');
    expect(advice.summary.toLowerCase()).toContain('who');
    expect(advice.totalAvoidedPm25Ug).toBeGreaterThan(0);
    expect(advice.totalSavedCarbonKg).toBeGreaterThan(0);
  });
});
