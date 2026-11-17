/**
 * Types and Data Contracts for AeroPulse Urban Air Quality Advisor
 * strictly typed for deterministic calculations, UI binding, and API contracts.
 */

export type VulnerabilityCohort = 'infants' | 'elderly' | 'pregnant' | 'asthma_respiratory' | 'healthy_adult';

export type DwellingType = 'apartment_highrise' | 'apartment_lowrise' | 'detached_house' | 'traditional_masonry';

export type HeatingSource = 'natural_gas' | 'electric_resistance' | 'heat_pump' | 'wood_biomass' | 'district_steam';

export type CommuteMode = 'solo_car_gas' | 'carpool' | 'public_transit' | 'active_walking_cycling';

export interface UserProfile {
  cohorts: VulnerabilityCohort[];
  dwelling: DwellingType;
  heating: HeatingSource;
  commute: CommuteMode;
  roomAreaSqM: number;
  ceilingHeightM?: number;
  hasAirPurifier: boolean;
  city: string;
  latitude: number;
  longitude: number;
}

export interface AtmosphericData {
  city: string;
  latitude: number;
  longitude: number;
  aqiUs: number;
  aqiEu: number;
  pm25: number; // micrograms per cubic meter (ug/m3)
  pm10: number; // ug/m3
  no2: number;  // ug/m3
  o3: number;   // ug/m3
  so2: number;  // ug/m3
  co: number;   // mg/m3
  temperatureC: number;
  relativeHumidityPct: number;
  windSpeedKmh: number;
  boundaryLayerHeightM: number; // meters
  isInversion: boolean;
  inversionSeverity: 'none' | 'moderate' | 'critical';
  lastUpdatedIso: string;
  sources: {
    name: string;
    description: string;
    citationUrl: string;
  }[];
}

export interface ImpactEquationBreakdown {
  formula: string;
  variables: Record<string, string | number>;
  assumptions: string[];
}

export interface ActionSuggestion {
  id: string;
  category: 'routine' | 'indoor_hack' | 'green_alternative';
  title: string;
  description: string;
  timeWindow?: string;
  pm25AvoidedUg: number;       // micrograms of PM2.5 lung exposure avoided
  carbonSavedKg: number;        // kilograms of CO2 equivalent avoided
  impactBreakdown: ImpactEquationBreakdown;
  priority: 'urgent' | 'high' | 'recommended';
  implementationDifficulty: 'immediate' | 'low_cost' | 'planned';
}

export interface AdvisorResponse {
  summary: string;
  alertLevel: 'safe' | 'moderate' | 'unhealthy' | 'hazardous' | 'emergency';
  inversionAlert: string | null;
  routines: ActionSuggestion[];
  indoorHacks: ActionSuggestion[];
  greenAlternatives: ActionSuggestion[];
  totalAvoidedPm25Ug: number;
  totalSavedCarbonKg: number;
  generatedAtIso: string;
  aiEngine: string;
  language: string;
}

export interface CADRCalculationResult {
  roomAreaSqM: number;
  roomVolumeM3: number;
  roomVolumeCuFt: number;
  recommendedAirChangesPerHour: number;
  requiredCADRCfm: number;
  corsiRosenthalBoxCapabilityCfm: number;
  crBoxAdequate: boolean;
  estimatedPm25DecayMinutes: number;
  filterRecommendation: string;
}
