/**
 * Sample Usage Code: Requesting PM2.5, NO2, and Local Weather
 *
 * Demonstrates how to use the reusable atmospheric data retrieval module
 * with explicit error handling and timeout configurations.
 */

import {
  fetchAirQualityMetrics,
  fetchLocalWeatherMetrics,
  fetchConsolidatedAtmosphericTelemetry,
  AtmosphericTimeoutError,
  AtmosphericNetworkError,
  AtmosphericRateLimitError,
} from '../lib/data-retrieval/atmospheric-client';

async function main() {
  // Target location: Delhi NCR (28.6139° N, 77.2090° E)
  const latitude = 28.6139;
  const longitude = 77.2090;
  const cityName = 'Delhi';

  console.log('================================================================');
  console.log(`AeroPulse Atmospheric Retrieval Engine: ${cityName}`);
  console.log(`Coordinates: (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
  console.log('================================================================\n');

  // --------------------------------------------------------------------------
  // STEP 1: Request Outdoor PM2.5 and NO2 Levels with Timeout Handling
  // --------------------------------------------------------------------------
  console.log('>>> [1/3] Fetching criteria air pollutants (PM2.5, NO2)...');
  try {
    const airQuality = await fetchAirQualityMetrics(latitude, longitude, {
      timeoutMs: 5000, // 5-second timeout window
      retries: 2,
    });

    console.log('✓ Air Quality Retrieved Successfully:');
    console.log(`  - PM2.5 Concentration: ${airQuality.pm25} µg/m³ (WHO 24h limit is 15 µg/m³)`);
    console.log(`  - NO2 Concentration:   ${airQuality.no2} µg/m³ (WHO 24h limit is 25 µg/m³)`);
    console.log(`  - PM10 Concentration:  ${airQuality.pm10} µg/m³`);
    console.log(`  - Ozone (O3):          ${airQuality.o3} µg/m³`);
    console.log(`  - Calculated US AQI:   ${airQuality.aqiUs}`);
    console.log(`  - Timestamp:           ${airQuality.retrievedAt}\n`);
  } catch (error) {
    if (error instanceof AtmosphericTimeoutError) {
      console.error(`✗ Air Quality Request Timed Out after ${error.timeoutMs}ms.`);
    } else if (error instanceof AtmosphericRateLimitError) {
      console.error('✗ Air Quality API rate limit exceeded. Backing off.');
    } else if (error instanceof AtmosphericNetworkError) {
      console.error(`✗ Network error: ${error.message} (Status: ${error.statusCode})`);
    } else {
      console.error('✗ Unexpected error fetching air quality:', error);
    }
  }

  // --------------------------------------------------------------------------
  // STEP 2: Request Local Weather & Boundary Layer Height
  // --------------------------------------------------------------------------
  console.log('>>> [2/3] Fetching local meteorological parameters...');
  try {
    const weather = await fetchLocalWeatherMetrics(latitude, longitude, {
      timeoutMs: 5000,
      retries: 2,
    });

    console.log('✓ Local Weather Retrieved Successfully:');
    console.log(`  - Surface Temperature:     ${weather.temperatureC}°C`);
    console.log(`  - Relative Humidity:       ${weather.relativeHumidityPct}%`);
    console.log(`  - 10m Wind Velocity:       ${weather.windSpeedKmh} km/h`);
    console.log(`  - Surface Pressure:        ${weather.surfacePressureHpa} hPa`);
    console.log(`  - Boundary Layer Height:   ${weather.boundaryLayerHeightM} meters`);
    console.log(`  - Timestamp:               ${weather.retrievedAt}\n`);
  } catch (error) {
    if (error instanceof AtmosphericTimeoutError) {
      console.error(`✗ Weather Request Timed Out after ${error.timeoutMs}ms.`);
    } else {
      console.error('✗ Error fetching weather metrics:', error);
    }
  }

  // --------------------------------------------------------------------------
  // STEP 3: Consolidated Telemetry with Atmospheric Inversion Detection
  // --------------------------------------------------------------------------
  console.log('>>> [3/3] Orchestrating consolidated atmospheric telemetry...');
  try {
    const consolidated = await fetchConsolidatedAtmosphericTelemetry(
      latitude,
      longitude,
      cityName,
      {
        timeoutMs: 6000,
        retries: 2,
        useFallbackOnFailure: true,
      }
    );

    console.log('✓ Consolidated Diagnostics Output:');
    console.log(`  - City:                  ${consolidated.city}`);
    console.log(`  - US AQI:                ${consolidated.aqiUs}`);
    console.log(`  - Thermal Inversion:     ${consolidated.isInversion ? 'YES (ACTIVE)' : 'NO'}`);
    console.log(`  - Inversion Severity:    ${consolidated.inversionSeverity.toUpperCase()}`);
    console.log(`  - Boundary Layer Height: ${consolidated.boundaryLayerHeightM}m`);
    console.log(`  - PM2.5 Level:           ${consolidated.pm25} µg/m³`);
    console.log(`  - Data Sources Cited:    ${consolidated.sources.map(s => s.name).join(' | ')}`);
    console.log('\n================================================================');
  } catch (error) {
    console.error('✗ Critical failure in consolidated telemetry:', error);
  }
}

// Execute if run directly via Node/tsx
if (require.main === module) {
  main();
}

export { main };
