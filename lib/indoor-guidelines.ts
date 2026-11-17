/**
 * Indoor Air Quality Guidelines and Clean Air Delivery Physics
 * Sources:
 * - WHO 2021 Global Air Quality Guidelines (WHO/HEP/ECH/AQH/2021.03)
 * - EPA Clean Air Act & Indoor Air Plus Standards
 * - ASHRAE Standard 62.2 (Ventilation and Acceptable Indoor Air Quality in Residential Buildings)
 * - UC Davis / Dr. Richard Corsi & Jim Rosenthal: Compendium of Corsi-Rosenthal Box Performance Data
 */

import { CADRCalculationResult } from './types';

export const WHO_2021_THRESHOLDS = {
  pm25_24h_limit_ug_m3: 15,
  pm25_annual_limit_ug_m3: 5,
  pm10_24h_limit_ug_m3: 45,
  no2_24h_limit_ug_m3: 25,
  o3_8h_limit_ug_m3: 100,
  co_24h_limit_mg_m3: 4.0,
} as const;

export const EPA_AQI_BREAKPOINTS = [
  { maxAqi: 50, label: 'Good', color: '#10B981', healthAdvice: 'Air quality is satisfactory with little or no risk.' },
  { maxAqi: 100, label: 'Moderate', color: '#F59E0B', healthAdvice: 'Acceptable; unusually sensitive individuals should consider limiting heavy outdoor exertion.' },
  { maxAqi: 150, label: 'Unhealthy for Sensitive Groups', color: '#F97316', healthAdvice: 'Children, seniors, and people with respiratory conditions should minimize prolonged outdoor activity.' },
  { maxAqi: 200, label: 'Unhealthy', color: '#EF4444', healthAdvice: 'Everyone may begin to experience health effects; sensitive members experience more serious effects.' },
  { maxAqi: 300, label: 'Very Unhealthy', color: '#8B5CF6', healthAdvice: 'Health alert: risk of health effects is significantly increased for the entire population.' },
  { maxAqi: 500, label: 'Hazardous', color: '#7F1D1D', healthAdvice: 'Emergency health warning: entire population is likely to be affected with severe respiratory stress.' },
] as const;

/**
 * Calculates required Clean Air Delivery Rate (CADR) in CFM and m3/h
 * based on room volume and desired Air Changes per Hour (ACH).
 *
 * Physics formula:
 * Room Volume V (ft³) = Floor Area (m²) * 10.7639 * Height (m) * 3.28084
 * CADR_cfm = (V * Target_ACH) / 60
 */
export function calculateCADR(
  roomAreaSqM: number,
  ceilingHeightM: number = 2.5,
  targetACH: number = 5
): CADRCalculationResult {
  const roomVolumeM3 = roomAreaSqM * ceilingHeightM;
  const roomVolumeCuFt = roomVolumeM3 * 35.3147; // 1 m³ = 35.3147 ft³

  // CADR (CFM) required to achieve target ACH
  const requiredCADRCfm = Math.round((roomVolumeCuFt * targetACH) / 60);

  // A standard 20-inch Corsi-Rosenthal box fan with 4x MERV 13 filters (20x20x2 or 20x20x1)
  // achieves ~350 - 450 CFM CADR at medium fan speed. We use conservative 320 CFM benchmark.
  const corsiRosenthalBoxCapabilityCfm = 320;
  const crBoxAdequate = corsiRosenthalBoxCapabilityCfm >= requiredCADRCfm;

  // Time in minutes to achieve 90% particle concentration decay:
  // t90 = (ln(10) / ACH) * 60 = (2.3026 / ACH) * 60
  const estimatedPm25DecayMinutes = Math.round((2.3026 / targetACH) * 60);

  let filterRecommendation = 'Standard MERV 13 or H13 HEPA purifier';
  if (roomAreaSqM > 35) {
    filterRecommendation = 'High-output dual Corsi-Rosenthal array or 2x 300 CFM HEPA air purifiers';
  } else if (roomAreaSqM > 18) {
    filterRecommendation = 'Single 4-filter Corsi-Rosenthal box or 1x 250 CFM True HEPA unit';
  } else {
    filterRecommendation = 'Compact 150-200 CFM HEPA air purifier or 16-inch DIY filter box';
  }

  return {
    roomAreaSqM,
    roomVolumeM3: Math.round(roomVolumeM3 * 10) / 10,
    roomVolumeCuFt: Math.round(roomVolumeCuFt),
    recommendedAirChangesPerHour: targetACH,
    requiredCADRCfm,
    corsiRosenthalBoxCapabilityCfm,
    crBoxAdequate,
    estimatedPm25DecayMinutes,
    filterRecommendation,
  };
}
