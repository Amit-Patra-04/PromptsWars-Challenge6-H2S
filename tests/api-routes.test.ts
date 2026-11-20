import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getAqiHandler } from '../app/api/aqi/route';
import { GET as getCadrHandler } from '../app/api/cadr/route';
import { POST as postAdvisorHandler } from '../app/api/advisor/route';

describe('API Route Handlers Integration Tests', () => {
  describe('GET /api/aqi', () => {
    it('returns atmospheric telemetry with Cache-Control headers for valid coordinates', async () => {
      const request = new NextRequest('http://localhost:3000/api/aqi?lat=28.6139&lon=77.2090&city=Delhi');
      const response = await getAqiHandler(request);

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toBeDefined();
      expect(data.city).toBe('Delhi');
      expect(typeof data.pm25).toBe('number');
      expect(typeof data.aqiUs).toBe('number');
      expect(typeof data.isInversion).toBe('boolean');
      expect(response.headers.get('Cache-Control')).toContain('s-maxage=180');
    });

    it('returns 400 Bad Request on out-of-bounds geographic coordinates', async () => {
      const request = new NextRequest('http://localhost:3000/api/aqi?lat=950.0&lon=77.2090&city=Invalid');
      const response = await getAqiHandler(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid coordinate parameters');
    });
  });

  describe('GET /api/cadr', () => {
    it('computes clean air delivery rate and ACH with caching headers', async () => {
      const request = new NextRequest('http://localhost:3000/api/cadr?roomAreaSqM=30&ceilingHeightM=2.6&targetACH=5');
      const response = await getCadrHandler(request);

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toBeDefined();
      expect(data.roomVolumeM3).toBeCloseTo(78, 0);
      expect(typeof data.requiredCADRCfm).toBe('number');
      expect(typeof data.crBoxAdequate).toBe('boolean');
      expect(data.estimatedPm25DecayMinutes).toBeGreaterThan(0);
      expect(response.headers.get('Cache-Control')).toContain('max-age=3600');
    });

    it('handles CADR boundary conditions at minimum room area (5m²)', async () => {
      const request = new NextRequest('http://localhost:3000/api/cadr?roomAreaSqM=5&ceilingHeightM=2.0&targetACH=2');
      const response = await getCadrHandler(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.roomVolumeM3).toBeCloseTo(10, 0);
      expect(data.requiredCADRCfm).toBeGreaterThan(0);
      expect(data.crBoxAdequate).toBe(true);
    });

    it('returns 400 Bad Request when target ACH exceeds safe physical limits', async () => {
      const request = new NextRequest('http://localhost:3000/api/cadr?roomAreaSqM=30&targetACH=25');
      const response = await getCadrHandler(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid CADR sizing parameters');
    });
  });

  describe('POST /api/advisor', () => {
    it('synthesizes personalized air advisor plan with deterministic actions', async () => {
      const validPayload = {
        profile: {
          cohorts: ['infants', 'asthma_respiratory'],
          dwelling: 'apartment_highrise',
          heating: 'natural_gas',
          commute: 'public_transit',
          roomAreaSqM: 32,
          ceilingHeightM: 2.7,
          hasAirPurifier: true,
          city: 'Delhi',
          latitude: 28.6139,
          longitude: 77.2090,
        },
        weather: {
          city: 'Delhi',
          latitude: 28.6139,
          longitude: 77.2090,
          aqiUs: 220,
          aqiEu: 90,
          pm25: 165,
          pm10: 240,
          no2: 55,
          o3: 30,
          so2: 18,
          co: 1.5,
          temperatureC: 9.0,
          relativeHumidityPct: 84,
          windSpeedKmh: 3.2,
          boundaryLayerHeightM: 210,
          isInversion: true,
          inversionSeverity: 'critical',
          lastUpdatedIso: new Date().toISOString(),
          sources: [],
        },
        language: 'en',
      };

      const request = new NextRequest('http://localhost:3000/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      const response = await postAdvisorHandler(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toBeDefined();
      expect(data.routines.length).toBeGreaterThanOrEqual(1);
      expect(data.indoorHacks.length).toBeGreaterThanOrEqual(1);
      expect(data.greenAlternatives.length).toBeGreaterThanOrEqual(1);
      expect(['unhealthy', 'very_unhealthy', 'hazardous']).toContain(data.alertLevel);
      expect(data.totalAvoidedPm25Ug).toBeGreaterThan(0);
      expect(data.totalSavedCarbonKg).toBeGreaterThanOrEqual(0);
    });

    it('returns 400 Bad Request when profile is invalid or empty', async () => {
      const invalidPayload = {
        profile: {
          cohorts: [], // Invalid empty cohort
        },
        weather: null,
      };

      const request = new NextRequest('http://localhost:3000/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPayload),
      });

      const response = await postAdvisorHandler(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid user profile data');
    });

    it('returns 400 Bad Request when atmospheric data payload is missing or invalid', async () => {
      const payloadWithMissingWeather = {
        profile: {
          cohorts: ['elderly'],
          dwelling: 'detached_house',
          heating: 'heat_pump',
          commute: 'solo_car_gas',
          roomAreaSqM: 25,
          ceilingHeightM: 2.5,
          hasAirPurifier: false,
          city: 'London',
          latitude: 51.5074,
          longitude: -0.1278,
        },
        weather: {
          city: 'London',
          // missing required fields
        },
        language: 'en',
      };

      const request = new NextRequest('http://localhost:3000/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadWithMissingWeather),
      });

      const response = await postAdvisorHandler(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Valid atmospheric data is required');
    });
  });
});
