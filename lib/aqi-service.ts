/**
 * Atmospheric & Air Quality Ingestion Service
 *
 * Re-exports presets and connects to the modular Atmospheric Client
 * in lib/data-retrieval/atmospheric-client.ts.
 */

import { AtmosphericData } from './types';
import { fetchConsolidatedAtmosphericTelemetry } from './data-retrieval/atmospheric-client';

export interface CityPreset {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  typicalWinterIssue: string;
}

export const WINTER_SMOG_HOTSPOTS: CityPreset[] = [
  {
    name: 'Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.2090,
    typicalWinterIssue: 'Agricultural stubble smoke trapped under strong northern plains winter inversion',
  },
  {
    name: 'Beijing',
    country: 'China',
    latitude: 39.9042,
    longitude: 116.4074,
    typicalWinterIssue: 'Coal and industrial emissions locked against northern mountain ranges',
  },
  {
    name: 'Lahore',
    country: 'Pakistan',
    latitude: 31.5204,
    longitude: 74.3587,
    typicalWinterIssue: 'Persistent seasonal radiation fog combined with vehicular exhaust and brick kilns',
  },
  {
    name: 'Salt Lake City',
    country: 'United States',
    latitude: 40.7608,
    longitude: -111.8910,
    typicalWinterIssue: 'Classic Wasatch basin thermal inversion trapping wood smoke and vehicle emissions',
  },
  {
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    typicalWinterIssue: 'Cold calm anticyclones causing diesel NO2 and domestic wood burner particulate spikes',
  },
  {
    name: 'Katowice',
    country: 'Poland',
    latitude: 50.2649,
    longitude: 19.0238,
    typicalWinterIssue: 'Silesian basin domestic coal and furnace heating smoke trapped in valley cold pools',
  },
];

/**
 * Fetches live atmospheric and air quality telemetry for any coordinate pair.
 * Uses the reusable atmospheric retrieval client with timeout and retry controls.
 */
export async function fetchLiveAtmosphericData(
  latitude: number,
  longitude: number,
  cityName: string = 'Current Location'
): Promise<AtmosphericData> {
  return fetchConsolidatedAtmosphericTelemetry(latitude, longitude, cityName, {
    timeoutMs: 6000,
    retries: 2,
    useFallbackOnFailure: true,
  });
}
