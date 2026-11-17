import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchAirQualityMetrics,
  fetchLocalWeatherMetrics,
  fetchConsolidatedAtmosphericTelemetry,
  AtmosphericRateLimitError,
  AtmosphericTimeoutError,
} from '../lib/data-retrieval/atmospheric-client';

describe('Data Fetching Module (Mocked APIs & Resilience)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully parses air quality telemetry from a mocked 200 OK API response', async () => {
    const mockApiResponse = {
      current: {
        pm2_5: 148.4,
        nitrogen_dioxide: 46.2,
        pm10: 220.1,
        ozone: 31.0,
        sulphur_dioxide: 16.5,
        carbon_monoxide: 1400, // in ug/m3 -> 1.4 mg/m3
        us_aqi: 198,
        european_aqi: 91,
      },
    };

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockApiResponse,
    } as Response);

    const result = await fetchAirQualityMetrics(28.6139, 77.2090, {
      timeoutMs: 3000,
      retries: 0,
      useFallbackOnFailure: false,
    });

    expect(result.pm25).toBe(148);
    expect(result.no2).toBe(46);
    expect(result.pm10).toBe(220);
    expect(result.co).toBe(1.4);
    expect(result.aqiUs).toBe(198);
    expect(result.retrievedAt).toBeTruthy();
  });

  it('successfully parses weather & boundary layer height from a mocked 200 OK API response', async () => {
    const mockWeatherResponse = {
      current: {
        temperature_2m: 14.2,
        relative_humidity_2m: 81,
        wind_speed_10m: 4.8,
        surface_pressure: 1014,
      },
      hourly: {
        boundary_layer_height: [215, 230, 290, 420],
      },
    };

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockWeatherResponse,
    } as Response);

    const result = await fetchLocalWeatherMetrics(28.6139, 77.2090, {
      timeoutMs: 3000,
      retries: 0,
      useFallbackOnFailure: false,
    });

    expect(result.temperatureC).toBe(14.2);
    expect(result.relativeHumidityPct).toBe(81);
    expect(result.windSpeedKmh).toBe(4.8);
    expect(result.boundaryLayerHeightM).toBe(215);
  });

  it('detects HTTP 429 and throws AtmosphericRateLimitError', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    } as Response);

    await expect(
      fetchAirQualityMetrics(28.6139, 77.2090, {
        timeoutMs: 3000,
        retries: 0,
        useFallbackOnFailure: false,
      })
    ).rejects.toThrow(AtmosphericRateLimitError);
  });

  it('retries on 500 server error and recovers if subsequent attempt succeeds', async () => {
    const mockApiResponse = {
      current: {
        pm2_5: 90,
        nitrogen_dioxide: 35,
        pm10: 130,
        ozone: 24,
        sulphur_dioxide: 10,
        carbon_monoxide: 1000,
        us_aqi: 168,
        european_aqi: 72,
      },
    };

    // First attempt fails with 500, second succeeds with 200
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockApiResponse,
      } as Response);

    const result = await fetchAirQualityMetrics(28.6139, 77.2090, {
      timeoutMs: 3000,
      retries: 1,
      retryDelayMs: 10,
      useFallbackOnFailure: false,
    });

    expect(result.pm25).toBe(90);
    expect(result.aqiUs).toBe(168);
  });

  it('triggers calibrated physical fallback when upstream network completely fails', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Connection Refused / Offline'));

    const result = await fetchConsolidatedAtmosphericTelemetry(28.6139, 77.2090, 'Delhi', {
      timeoutMs: 1000,
      retries: 0,
      useFallbackOnFailure: true,
    });

    expect(result).toBeDefined();
    expect(result.pm25).toBeGreaterThan(0);
    expect(result.no2).toBeGreaterThan(0);
    expect(result.city).toBe('Delhi');
    expect(result.isInversion).toBe(true);
  });
});
