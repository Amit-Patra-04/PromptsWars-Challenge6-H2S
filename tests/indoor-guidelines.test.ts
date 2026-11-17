import { describe, it, expect } from 'vitest';
import { calculateCADR, WHO_2021_THRESHOLDS } from '../lib/indoor-guidelines';

describe('Indoor Air Quality & CADR Physics Engine', () => {
  it('correctly computes required CADR for given room area and ACH', () => {
    // 20 m2 room with 2.5m ceiling = 50 m3 = ~1765.7 cu ft
    // At 5 ACH: CADR = (1765.7 * 5) / 60 = 147.1 CFM -> rounded to 147 CFM
    const result = calculateCADR(20, 2.5, 5);

    expect(result.roomAreaSqM).toBe(20);
    expect(result.roomVolumeM3).toBe(50);
    expect(result.requiredCADRCfm).toBeCloseTo(147, -1);
    expect(result.crBoxAdequate).toBe(true); // 320 CFM > 147 CFM
  });

  it('identifies when room size exceeds a single Corsi-Rosenthal box', () => {
    // 60 m2 room with 3m ceiling = 180 m3 = 6356 cu ft
    // At 5 ACH: CADR = (6356 * 5) / 60 = 530 CFM
    const result = calculateCADR(60, 3.0, 5);

    expect(result.requiredCADRCfm).toBeGreaterThan(320);
    expect(result.crBoxAdequate).toBe(false);
    expect(result.filterRecommendation).toContain('dual Corsi-Rosenthal');
  });

  it('calculates 90% particle concentration decay time', () => {
    // t90 = (ln(10) / ACH) * 60 = (2.3026 / 5) * 60 = 27.6 minutes -> 28 min
    const result = calculateCADR(25, 2.5, 5);
    expect(result.estimatedPm25DecayMinutes).toBe(28);
  });

  it('WHO 2021 thresholds are properly calibrated to WHO standards', () => {
    expect(WHO_2021_THRESHOLDS.pm25_24h_limit_ug_m3).toBe(15);
    expect(WHO_2021_THRESHOLDS.pm25_annual_limit_ug_m3).toBe(5);
    expect(WHO_2021_THRESHOLDS.no2_24h_limit_ug_m3).toBe(25);
  });
});
