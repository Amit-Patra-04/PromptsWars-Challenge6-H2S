import { describe, it, expect } from 'vitest';
import {
  getHouseholdVentilationRate,
  computeAvoidedInhaledDose,
  generateDeterministicActionSuite,
} from '../lib/impact-calculator';
import { UserProfile, AtmosphericData } from '../lib/types';

describe('Deterministic Impact Calculator', () => {
  it('selects correct ventilation rate based on most vulnerable cohort', () => {
    // Pregnant woman has higher tidal volume
    expect(getHouseholdVentilationRate(['pregnant', 'healthy_adult'])).toBe(0.70);

    // Infant has specific pulmonary exposure profile
    expect(getHouseholdVentilationRate(['infants', 'healthy_adult'])).toBe(0.35);

    // Asthma respiratory has heightened ventilation vulnerability
    expect(getHouseholdVentilationRate(['asthma_respiratory'])).toBe(0.65);

    // Elderly
    expect(getHouseholdVentilationRate(['elderly'])).toBe(0.55);

    // General healthy adult
    expect(getHouseholdVentilationRate(['healthy_adult'])).toBe(0.60);
  });

  it('accurately calculates avoided inhaled PM2.5 dose using physical equation', () => {
    // Inhalation Rate = 0.6 m3/h, Baseline = 150 ug/m3, Mitigated = 25 ug/m3, Duration = 4 hours
    // Delta = 125 ug/m3 * 0.6 m3/h * 4 h = 300 ug avoided
    const dose = computeAvoidedInhaledDose(0.6, 150, 25, 4);
    expect(dose).toBe(300);
  });

  it('generates transparent mathematical assumptions in action suggestions', () => {
    const mockProfile: UserProfile = {
      cohorts: ['infants', 'asthma_respiratory'],
      dwelling: 'apartment_highrise',
      heating: 'natural_gas',
      commute: 'solo_car_gas',
      roomAreaSqM: 32,
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
      aqiUs: 260,
      aqiEu: 110,
      pm25: 180,
      pm10: 290,
      no2: 55,
      o3: 20,
      so2: 15,
      co: 1.8,
      temperatureC: 12.0,
      relativeHumidityPct: 80,
      windSpeedKmh: 3.2,
      boundaryLayerHeightM: 220,
      isInversion: true,
      inversionSeverity: 'critical',
      lastUpdatedIso: new Date().toISOString(),
      sources: [],
    };

    const suite = generateDeterministicActionSuite(mockProfile, mockWeather);

    expect(suite.routines.length).toBeGreaterThan(0);
    expect(suite.indoorHacks.length).toBeGreaterThan(0);
    expect(suite.greenAlternatives.length).toBeGreaterThan(0);

    expect(suite.totalAvoidedPm25Ug).toBeGreaterThan(0);
    expect(suite.totalSavedCarbonKg).toBeGreaterThan(0);

    // Inspect first suggestion for transparent assumptions
    const firstRoutine = suite.routines[0];
    expect(firstRoutine.impactBreakdown).toBeDefined();
    expect(firstRoutine.impactBreakdown.formula).toBeTruthy();
    expect(firstRoutine.impactBreakdown.assumptions.length).toBeGreaterThan(0);
    expect(Object.keys(firstRoutine.impactBreakdown.variables).length).toBeGreaterThan(0);
  });
});
