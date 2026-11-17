import { z } from 'zod';
import { VulnerabilityCohort, DwellingType, HeatingSource, CommuteMode } from './types';

/**
 * Strips HTML tags, script vectors, and abnormal control characters
 * to prevent Stored / Reflected Cross-Site Scripting (XSS).
 *
 * @param input Untrusted raw input of unknown type
 * @returns Clean sanitized text string safe for DOM and prompt interpolation
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // strip tag brackets
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 300);
}

/**
 * Defends against prompt injection attempts in free text inputs
 * by neutralizing role hijacking and system tokens.
 *
 * @param input Free text prompt content
 * @returns Sanitized text with role hijacking markers stripped
 */
export function sanitizePromptText(input: string): string {
  const sanitized = sanitizeString(input);
  return sanitized
    .replace(/(system:|developer:|assistant:|user:|human:)/gi, '')
    .replace(/<\|.*?\|>/g, '')
    .replace(/\{%.*?%\}/g, '');
}

/**
 * Coordinate and geographic boundaries validator schema
 */
export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90, 'Latitude must be between -90 and 90').max(90),
  longitude: z.number().min(-180, 'Longitude must be between -180 and 180').max(180),
  city: z.string().max(100).default('Urban Area'),
});

/**
 * Cohorts enumeration runtime validator schema
 */
export const CohortEnum = z.enum([
  'infants',
  'elderly',
  'pregnant',
  'asthma_respiratory',
  'healthy_adult',
]);

/**
 * Full User Profile runtime validation schema
 */
export const UserProfileSchema = z.object({
  cohorts: z.array(CohortEnum).min(1, 'Please select at least one demographic cohort'),
  dwelling: z.enum([
    'apartment_highrise',
    'apartment_lowrise',
    'detached_house',
    'traditional_masonry',
  ]),
  heating: z.enum([
    'natural_gas',
    'electric_resistance',
    'heat_pump',
    'wood_biomass',
    'district_steam',
  ]),
  commute: z.enum([
    'solo_car_gas',
    'carpool',
    'public_transit',
    'active_walking_cycling',
  ]),
  roomAreaSqM: z.number().min(5, 'Room area must be at least 5 m²').max(500, 'Room area cannot exceed 500 m²'),
  ceilingHeightM: z.number().min(1.8, 'Ceiling height must be at least 1.8m').max(6.0).default(2.6),
  hasAirPurifier: z.boolean().default(false),
  city: z.string().max(100).default('Delhi'),
  latitude: z.number().min(-90).max(90).default(28.6139),
  longitude: z.number().min(-180).max(180).default(77.2090),
});

/**
 * Clean Air Delivery Rate (CADR) Calculator input schema
 */
export const CADRInputSchema = z.object({
  roomAreaSqM: z.number().min(5, 'Room area must be at least 5 m²').max(400, 'Room area cannot exceed 400 m²'),
  ceilingHeightM: z.number().min(1.8).max(5.5).default(2.5),
  targetAirChangesPerHour: z.number().min(2, 'Target ACH must be at least 2').max(10, 'Target ACH cannot exceed 10').default(5),
});

/**
 * Atmospheric Data schema for runtime payload validation
 */
export const AtmosphericDataSchema = z.object({
  city: z.string().max(100).default('Urban Area'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  aqiUs: z.number().nonnegative(),
  aqiEu: z.number().nonnegative().optional().default(0),
  pm25: z.number().nonnegative(),
  pm10: z.number().nonnegative(),
  no2: z.number().nonnegative(),
  o3: z.number().nonnegative(),
  so2: z.number().nonnegative().optional().default(0),
  co: z.number().nonnegative().optional().default(0),
  temperatureC: z.number(),
  relativeHumidityPct: z.number().min(0).max(100).optional().default(50),
  windSpeedKmh: z.number().nonnegative(),
  boundaryLayerHeightM: z.number().nonnegative(),
  isInversion: z.boolean(),
  inversionSeverity: z.enum(['none', 'moderate', 'critical']).optional().default('none'),
  lastUpdatedIso: z.string().optional().default(new Date().toISOString()),
  sources: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        citationUrl: z.string(),
      })
    )
    .optional()
    .default([]),
});

export type ValidatedUserProfile = z.infer<typeof UserProfileSchema>;
export type ValidatedCADRInput = z.infer<typeof CADRInputSchema>;
export type ValidatedAtmosphericData = z.infer<typeof AtmosphericDataSchema>;
