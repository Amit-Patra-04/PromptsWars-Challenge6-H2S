import { describe, it, expect } from 'vitest';
import {
  GREENER_SWAPS_CATALOG,
  EPA_EMISSION_FACTORS,
  calculateDynamicSwapImpact,
} from '../lib/greener-swaps';

describe('Greener Alternatives & Quantitative Impact Engine', () => {
  it('includes key sustainable swaps with EPA emission factors', () => {
    // 1. Plant-based cleaning products
    const plantCleaners = GREENER_SWAPS_CATALOG.find(s => s.id === 'swap-plant-cleaners');
    expect(plantCleaners).toBeDefined();
    expect(plantCleaners!.pollutionReducedMetric.toLowerCase()).toContain('voc');
    expect(plantCleaners!.annotatedText).toContain('➞');
    expect(plantCleaners!.annotatedText).toContain('VOC reduction');

    // 2. Biomass to LPG / Induction
    const lpgSwap = GREENER_SWAPS_CATALOG.find(s => s.id === 'swap-biomass-to-lpg-or-induction');
    expect(lpgSwap).toBeDefined();
    expect(lpgSwap!.pollutionReducedMetric).toContain('PM2.5');
    expect(lpgSwap!.carbonSavedKgPerUnit).toBe(3.60);
    expect(lpgSwap!.annotatedText).toContain('➞');

    // 3. Electric heat pump / heater vs kerosene
    const heatPump = GREENER_SWAPS_CATALOG.find(s => s.id === 'swap-heat-pump');
    expect(heatPump).toBeDefined();
    expect(heatPump!.carbonSavedKgPerUnit).toBe(0.52);
    expect(heatPump!.carbonUnitLabel).toContain('hour of heating');
    expect(heatPump!.annotatedText).toContain('➞');
    expect(heatPump!.annotatedText).toContain('kg CO2e saved per hour');

    // 4. Commute mode shift
    const transit = GREENER_SWAPS_CATALOG.find(s => s.id === 'swap-transit-commute');
    expect(transit).toBeDefined();
    expect(transit!.epaFactorCitation).toContain('404 g CO2 per vehicle mile');
    expect(transit!.annotatedText).toContain('➞');
  });

  it('formats every item with arrow-annotated UI text as requested by user', () => {
    for (const swap of GREENER_SWAPS_CATALOG) {
      expect(swap.annotatedText).toContain('➞');
      expect(swap.annotatedText.startsWith('Switch') || swap.annotatedText.startsWith('Set')).toBe(true);
      expect(swap.epaFactorCitation).toBeTruthy();
      expect(swap.assumptions.length).toBeGreaterThanOrEqual(2);
      expect(swap.carbonSavedKgPerUnit).toBeGreaterThan(0);
    }
  });

  it('accurately calculates dynamic emissions reductions using EPA 404 g/mile factor', () => {
    // 15 miles * 0.404 kg/mile = 6.06 kg baseline
    // Transit saves 80% = 4.85 kg saved daily
    const commuteImpact = calculateDynamicSwapImpact('swap-transit-commute', {
      distanceMiles: 15,
      daysPerWeek: 5,
    });

    expect(commuteImpact.dailyCo2SavedKg).toBe(4.85);
    // Annual = 4.85 * 250 = 1212.5 kg
    expect(commuteImpact.annualCo2SavedKg).toBe(1212.5);
    expect(commuteImpact.annotatedText).toContain('➞');
    expect(commuteImpact.annotatedText).toContain('4.85 kg CO2e saved per day');
  });

  it('accurately calculates dynamic heating emissions reductions', () => {
    // 6 hours of heating * 0.52 kg/hour = 3.12 kg saved
    const heatingImpact = calculateDynamicSwapImpact('swap-heat-pump', {
      hoursPerDay: 6,
      daysPerWeek: 5,
    });

    expect(heatingImpact.dailyCo2SavedKg).toBe(3.12);
    expect(heatingImpact.annualCo2SavedKg).toBe(780);
    expect(heatingImpact.annotatedText).toContain('➞');
  });
});
