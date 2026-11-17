import { describe, it, expect, vi } from 'vitest';
import {
  fetchAirQualityMetrics,
  fetchLocalWeatherMetrics,
  fetchConsolidatedAtmosphericTelemetry,
  AtmosphericValidationError,
  AtmosphericTimeoutError,
  AtmosphericError,
} from '../lib/data-retrieval/atmospheric-client';

describe('Atmospheric Data Retrieval Client (Open-Meteo / CAMS)', () => {
  // Test coordinates: Delhi (28.6139, 77.2090)
  const DELHI_LAT = 28.6139;
  const DELHI_LON = 77.2090;

  it('fetches and parses outdoor PM2.5 and NO2 levels', async () => {
    const aq = await fetchAirQualityMetrics(DELHI_LAT, DELHI_LON, {
      timeoutMs: 8000,
      retries: 1,
    });

    expect(aq).toBeDefined();
    expect(typeof aq.pm25).toBe('number');
    expect(aq.pm25).toBeGreaterThanOrEqual(0);
    expect(typeof aq.no2).toBe('number');
    expect(aq.no2).toBeGreaterThanOrEqual(0);
    expect(typeof aq.aqiUs).toBe('number');
    expect(typeof aq.pm10).toBe('number');
    expect(aq.retrievedAt).toBeTruthy();
  });

  it('fetches and parses local weather and boundary layer height', async () => {
    const weather = await fetchLocalWeatherMetrics(DELHI_LAT, DELHI_LON, {
      timeoutMs: 8000,
      retries: 1,
    });

    expect(weather).toBeDefined();
    expect(typeof weather.temperatureC).toBe('number');
    expect(typeof weather.relativeHumidityPct).toBe('number');
    expect(typeof weather.windSpeedKmh).toBe('number');
    expect(typeof weather.boundaryLayerHeightM).toBe('number');
    expect(weather.boundaryLayerHeightM).toBeGreaterThanOrEqual(20);
    expect(weather.retrievedAt).toBeTruthy();
  });

  it('rejects physically invalid coordinates with AtmosphericValidationError', async () => {
    await expect(fetchAirQualityMetrics(195.0, 77.2090)).rejects.toThrow(
      AtmosphericValidationError
    );
    await expect(fetchLocalWeatherMetrics(28.6139, -210.0)).rejects.toThrow(
      AtmosphericValidationError
    );
  });

  it('consolidates air quality, weather, and thermal inversion diagnostics', async () => {
    const consolidated = await fetchConsolidatedAtmosphericTelemetry(
      DELHI_LAT,
      DELHI_LON,
      'Delhi',
      {
        timeoutMs: 8000,
        retries: 1,
        useFallbackOnFailure: true,
      }
    );

    expect(consolidated.city).toBe('Delhi');
    expect(typeof consolidated.pm25).toBe('number');
    expect(typeof consolidated.no2).toBe('number');
    expect(typeof consolidated.boundaryLayerHeightM).toBe('number');
    expect(typeof consolidated.isInversion).toBe('boolean');
    expect(['none', 'moderate', 'critical']).toContain(consolidated.inversionSeverity);

    // Citations are present
    expect(consolidated.sources.length).toBeGreaterThanOrEqual(2);
    expect(consolidated.sources[0].citationUrl).toContain('open-meteo.com');
  });

  it('handles simulated timeouts with fallback resilience', async () => {
    // Calling with 1ms timeout without fallback throws AtmosphericTimeoutError
    await expect(
      fetchAirQualityMetrics(DELHI_LAT, DELHI_LON, {
        timeoutMs: 1,
        retries: 0,
        useFallbackOnFailure: false,
      })
    ).rejects.toThrow(AtmosphericError);

    // Calling with 1ms timeout WITH fallback returns calibrated physical baseline
    const fallbackData = await fetchAirQualityMetrics(DELHI_LAT, DELHI_LON, {
      timeoutMs: 1,
      retries: 0,
      useFallbackOnFailure: true,
    });

    expect(fallbackData).toBeDefined();
    expect(fallbackData.pm25).toBeGreaterThan(0);
    expect(fallbackData.no2).toBeGreaterThan(0);
  });

  it('serves cached telemetry on repeated calls to optimize latency and efficiency', async () => {
    // Prime the cache
    const firstCall = await fetchConsolidatedAtmosphericTelemetry(DELHI_LAT, DELHI_LON, 'Delhi', {
      timeoutMs: 8000,
    });
    expect(firstCall).toBeDefined();

    // Second call should return cached instance immediately
    const start = performance.now();
    const secondCall = await fetchConsolidatedAtmosphericTelemetry(DELHI_LAT, DELHI_LON, 'Delhi');
    const elapsed = performance.now() - start;

    expect(secondCall).toBeDefined();
    expect(secondCall.pm25).toBe(firstCall.pm25);
    expect(elapsed).toBeLessThan(50); // In-memory cache returns in under 50ms
  });
});
