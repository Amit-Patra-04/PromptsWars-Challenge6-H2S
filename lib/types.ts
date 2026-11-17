/**
 * Types and Data Contracts for AeroPulse Urban Air Quality Advisor
 *
 * Strictly typed for deterministic calculations, UI binding, and API contracts.
 * Grounded in WHO 2021 guidelines, EPA Exposure Factors, and ASHRAE standards.
 */

/**
 * Demographic cohort vulnerability classification
 */
export type VulnerabilityCohort =
  | 'infants'
  | 'elderly'
  | 'pregnant'
  | 'asthma_respiratory'
  | 'healthy_adult';

/**
 * Residential building envelope and ventilation infiltration classification
 */
export type DwellingType =
  | 'apartment_highrise'
  | 'apartment_lowrise'
  | 'detached_house'
  | 'traditional_masonry';

/**
 * Primary domestic space heating source
 */
export type HeatingSource =
  | 'natural_gas'
  | 'electric_resistance'
  | 'heat_pump'
  | 'wood_biomass'
  | 'district_steam';

/**
 * Daily primary commute mode
 */
export type CommuteMode =
  | 'solo_car_gas'
  | 'carpool'
  | 'public_transit'
  | 'active_walking_cycling';

/**
 * User demographic and dwelling profile input contract
 */
export interface UserProfile {
  /** Selected vulnerability cohorts residing in household */
  cohorts: VulnerabilityCohort[];
  /** Type of dwelling determining ambient infiltration */
  dwelling: DwellingType;
  /** Primary winter space heating technology */
  heating: HeatingSource;
  /** Primary mode of daily transportation */
  commute: CommuteMode;
  /** Floor area of primary occupied room in square meters */
  roomAreaSqM: number;
  /** Ceiling height in meters (defaults to 2.6m) */
  ceilingHeightM?: number;
  /** Whether household operates active mechanical air purifier */
  hasAirPurifier: boolean;
  /** Urban center or locality name */
  city: string;
  /** Geographic latitude (-90 to 90) */
  latitude: number;
  /** Geographic longitude (-180 to 180) */
  longitude: number;
}

/**
 * Consolidated outdoor atmospheric and meteorological telemetry snapshot
 */
export interface AtmosphericData {
  /** Locality or metropolitan center name */
  city: string;
  /** Latitude coordinate */
  latitude: number;
  /** Longitude coordinate */
  longitude: number;
  /** United States Air Quality Index (0-500 scale) */
  aqiUs: number;
  /** European Air Quality Index rating */
  aqiEu: number;
  /** Fine particulate matter (< 2.5 µm) in µg/m³ */
  pm25: number;
  /** Coarse particulate matter (< 10 µm) in µg/m³ */
  pm10: number;
  /** Nitrogen dioxide concentration in µg/m³ */
  no2: number;
  /** Surface ozone concentration in µg/m³ */
  o3: number;
  /** Sulfur dioxide concentration in µg/m³ */
  so2: number;
  /** Carbon monoxide concentration in mg/m³ */
  co: number;
  /** Ambient 2-meter air temperature in degrees Celsius */
  temperatureC: number;
  /** Relative humidity percentage (0-100%) */
  relativeHumidityPct: number;
  /** 10-meter surface anemometer wind speed in km/h */
  windSpeedKmh: number;
  /** Planetary boundary layer mixing height (Hpbl) in meters */
  boundaryLayerHeightM: number;
  /** Whether thermal inversion condition is actively detected */
  isInversion: boolean;
  /** Inversion severity tier based on boundary layer compression */
  inversionSeverity: 'none' | 'moderate' | 'critical';
  /** ISO 8601 timestamp of data ingestion */
  lastUpdatedIso: string;
  /** Transparent scientific source provenance citations */
  sources: {
    name: string;
    description: string;
    citationUrl: string;
  }[];
}

/**
 * Transparent mathematical formulation and audit assumptions
 */
export interface ImpactEquationBreakdown {
  /** Mathematical algebraic equation string */
  formula: string;
  /** Parameter keys and evaluated numeric values */
  variables: Record<string, string | number>;
  /** Scientific citations and baseline exposure assumptions */
  assumptions: string[];
}

/**
 * Individual action suggestion card contract
 */
export interface ActionSuggestion {
  /** Unique suggestion identifier */
  id: string;
  /** Action category */
  category: 'routine' | 'indoor_hack' | 'green_alternative';
  /** Action headline */
  title: string;
  /** Detailed actionable instructions */
  description: string;
  /** Recommended execution time window (e.g., afternoon trough) */
  timeWindow?: string;
  /** Micrograms of PM2.5 lung intake avoided by this intervention */
  pm25AvoidedUg: number;
  /** Kilograms of CO2 equivalent greenhouse emissions abated */
  carbonSavedKg: number;
  /** Auditable mathematical formula and variable breakdown */
  impactBreakdown: ImpactEquationBreakdown;
  /** Priority classification */
  priority: 'urgent' | 'high' | 'recommended';
  /** Effort and capital requirements */
  implementationDifficulty: 'immediate' | 'low_cost' | 'planned';
}

/**
 * Consolidated advisor response returned to the client interface
 */
export interface AdvisorResponse {
  /** Executive summary synthesized by Gemini 3 */
  summary: string;
  /** Overall EPA health risk tier */
  alertLevel: 'safe' | 'moderate' | 'unhealthy' | 'hazardous' | 'emergency';
  /** Specific inversion warning message if inversion condition is active */
  inversionAlert: string | null;
  /** Low-emission daily routines */
  routines: ActionSuggestion[];
  /** Authoritative EPA indoor air hacks */
  indoorHacks: ActionSuggestion[];
  /** Greener domestic alternatives */
  greenAlternatives: ActionSuggestion[];
  /** Cumulative micrograms of PM2.5 lung exposure avoided */
  totalAvoidedPm25Ug: number;
  /** Cumulative kilograms of carbon equivalent emissions abated */
  totalSavedCarbonKg: number;
  /** ISO 8601 timestamp of synthesis */
  generatedAtIso: string;
  /** Active AI / physical synthesis engine descriptor */
  aiEngine: string;
  /** Language locale code of the response */
  language: string;
}

/**
 * Clean Air Delivery Rate (CADR) sizing calculation output
 */
export interface CADRCalculationResult {
  /** Room floor area in square meters */
  roomAreaSqM: number;
  /** Room volume in cubic meters */
  roomVolumeM3: number;
  /** Room volume in cubic feet */
  roomVolumeCuFt: number;
  /** Target air changes per hour */
  recommendedAirChangesPerHour: number;
  /** Required CADR delivery rate in cubic feet per minute */
  requiredCADRCfm: number;
  /** Standard Corsi-Rosenthal box deliverable CADR in CFM */
  corsiRosenthalBoxCapabilityCfm: number;
  /** Whether a single Corsi-Rosenthal box satisfies the room CADR target */
  crBoxAdequate: boolean;
  /** Estimated minutes to achieve 90% particle concentration decay (t90) */
  estimatedPm25DecayMinutes: number;
  /** Actionable filtration unit recommendation text */
  filterRecommendation: string;
}
