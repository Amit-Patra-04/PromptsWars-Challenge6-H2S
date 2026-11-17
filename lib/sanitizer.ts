import { z } from 'zod';
import { VulnerabilityCohort, DwellingType, HeatingSource, CommuteMode } from './types';

/**
 * Strips HTML tags, script vectors, and abnormal control characters
 * to prevent Stored / Reflected Cross-Site Scripting (XSS).
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
 */
export function sanitizePromptText(input: string): string {
  const sanitized = sanitizeString(input);
  return sanitized
    .replace(/(system:|developer:|assistant:|user:|human:)/gi, '')
    .replace(/<\|.*?\|>/g, '')
    .replace(/\{%.*?%\}/g, '');
}

/**
 * Coordinate and geographic boundaries validator
 */
export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  city: z.string().max(100).default('Urban Area'),
});

/**
 * Cohorts enumeration schema
 */
export const CohortEnum = z.enum([
  'infants',
  'elderly',
  'pregnant',
  'asthma_respiratory',
  'healthy_adult',
]);

/**
 * Full User Profile validation schema
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
  ceilingHeightM: z.number().min(1.8).max(6.0).default(2.6),
  hasAirPurifier: z.boolean().default(false),
  city: z.string().max(100).default('Delhi'),
  latitude: z.number().min(-90).max(90).default(28.6139),
  longitude: z.number().min(-180).max(180).default(77.2090),
});

/**
 * CADR Calculator input schema
 */
export const CADRInputSchema = z.object({
  roomAreaSqM: z.number().min(5).max(400),
  ceilingHeightM: z.number().min(1.8).max(5.5).default(2.5),
  targetAirChangesPerHour: z.number().min(2).max(10).default(5),
});

export type ValidatedUserProfile = z.infer<typeof UserProfileSchema>;
export type ValidatedCADRInput = z.infer<typeof CADRInputSchema>;
