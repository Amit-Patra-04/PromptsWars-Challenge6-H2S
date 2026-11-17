/**
 * Deterministic Impact Calculation Engine
 * Calculates:
 * 1. Micrograms of PM2.5 inhaled dose avoided by vulnerable individuals
 * 2. Kilograms of carbon (CO2 equivalent) avoided
 * 3. Transparent, auditable mathematical formulas and assumptions
 *
 * Grounded in:
 * - EPA Exposure Factors Handbook (2011 Edition, Chapter 6: Inhalation Rates)
 * - UK DEFRA / BEIS Greenhouse Gas Reporting Conversion Factors (2023)
 * - EPA Greenhouse Gas Equivalencies Calculator
 * - Air Quality Life Index (AQLI) particulate dose models
 */

import { UserProfile, AtmosphericData, ActionSuggestion } from './types';

// Inhalation rates in m3/hour from EPA Exposure Factors Handbook Table 6-1
const INHALATION_RATES_M3_PER_HOUR = {
  infants: 0.35,              // Infant 0-2 yrs mean resting/light
  elderly: 0.55,              // Adults 65+ sedentary/light activity
  pregnant: 0.70,             // Pregnant women elevated tidal volume
  asthma_respiratory: 0.65,    // Sensitive respiratory adult
  healthy_adult: 0.60,         // General adult resting
  active_outdoor: 1.80,        // Moderate outdoor exercise / brisk commute
} as const;

// Emission factors from DEFRA 2023 / US EPA AP-42
const EMISSION_FACTORS = {
  passenger_car_gasoline_kg_co2_per_km: 0.192,
  carpool_savings_fraction: 0.60,
  transit_savings_fraction: 0.75,
  natural_gas_kwh_kg_co2: 0.203,
  wood_biomass_day_kg_co2: 4.80,
  wood_biomass_pm25_emitted_g_per_day: 120.0,
  electric_cooking_efficiency_gain_kg_co2: 0.35,
} as const;

/**
 * Determines effective minute ventilation (m3/h) for the household
 * by weighting the most vulnerable demographic member.
 */
export function getHouseholdVentilationRate(cohorts: UserProfile['cohorts']): number {
  if (cohorts.includes('pregnant')) return INHALATION_RATES_M3_PER_HOUR.pregnant;
  if (cohorts.includes('infants')) return INHALATION_RATES_M3_PER_HOUR.infants;
  if (cohorts.includes('asthma_respiratory')) return INHALATION_RATES_M3_PER_HOUR.asthma_respiratory;
  if (cohorts.includes('elderly')) return INHALATION_RATES_M3_PER_HOUR.elderly;
  return INHALATION_RATES_M3_PER_HOUR.healthy_adult;
}

/**
 * Calculates PM2.5 inhaled dose (ug) avoided when shifting from an unmitigated baseline
 * to an advised intervention over an active exposure duration.
 *
 * Dose = Inhalation Rate (m3/h) * Concentration Differential (ug/m3) * Duration (hours)
 */
export function computeAvoidedInhaledDose(
  ventilationRateM3h: number,
  baselineConcentrationUgM3: number,
  mitigatedConcentrationUgM3: number,
  hoursOfExposure: number
): number {
  const concentrationDelta = Math.max(0, baselineConcentrationUgM3 - mitigatedConcentrationUgM3);
  const avoidedDoseUg = ventilationRateM3h * concentrationDelta * hoursOfExposure;
  return Math.round(avoidedDoseUg * 10) / 10;
}

/**
 * Generates tailored suggestions with exact mathematical impact breakdowns
 */
export function generateDeterministicActionSuite(
  profile: UserProfile,
  weather: AtmosphericData
): {
  routines: ActionSuggestion[];
  indoorHacks: ActionSuggestion[];
  greenAlternatives: ActionSuggestion[];
  totalAvoidedPm25Ug: number;
  totalSavedCarbonKg: number;
} {
  const ventRate = getHouseholdVentilationRate(profile.cohorts);
  const ambientPm25 = weather.pm25;
  const isHighSmog = ambientPm25 > 75 || weather.isInversion;

  const routines: ActionSuggestion[] = [];
  const indoorHacks: ActionSuggestion[] = [];
  const greenAlternatives: ActionSuggestion[] = [];

  // 1. Commute & Outdoor Activity Shift
  if (isHighSmog) {
    // Shifting 45 mins outdoor commute or exercise indoors
    // Outdoor rate: 1.8 m3/h @ ambientPm25 vs Filtered indoor rate: ventRate @ (ambientPm25 * 0.20)
    const outdoorDose = 1.80 * ambientPm25 * 0.75; // 45 min = 0.75h
    const indoorProtectedDose = ventRate * (ambientPm25 * 0.20) * 0.75;
    const pm25Avoided = Math.round(Math.max(5, outdoorDose - indoorProtectedDose));

    routines.push({
      id: 'routine-shift-outdoor-window',
      category: 'routine',
      title: 'Shift morning transit and exercise to afternoon inversion trough',
      description: weather.isInversion
        ? 'A severe thermal inversion locks particulates near ground until 1:00 PM. Delay outdoor errands until solar warming elevates the boundary layer.'
        : 'Peak vehicular smog clusters between 7:30 AM and 10:00 AM. Shift outdoor transit to the afternoon dispersion window.',
      timeWindow: '1:30 PM to 4:00 PM',
      pm25AvoidedUg: pm25Avoided,
      carbonSavedKg: 0.0,
      impactBreakdown: {
        formula: 'Avoided Dose = (V_outdoor * C_ambient - V_indoor * C_filtered) * 0.75 hours',
        variables: {
          'Outdoor Inhalation Rate': '1.80 m³/h',
          'Ambient PM2.5': `${ambientPm25} µg/m³`,
          'Indoor Inhalation Rate': `${ventRate} m³/h`,
          'Filtered Indoor PM2.5': `${Math.round(ambientPm25 * 0.2)} µg/m³`,
          'Exposure Duration': '0.75 h (45 min)',
        },
        assumptions: [
          'EPA 2011 Inhalation Rate for moderate activity is 1.80 m³/h.',
          'Shifting indoors with 80% filtration reduces particulate exposure by four-fifths.',
          'Thermal inversion layer mixes upward by early afternoon, dispersing street-level plumes.',
        ],
      },
      priority: 'urgent',
      implementationDifficulty: 'immediate',
    });
  }

  // 2. High-Efficiency Infiltration & Purifier Positioning Hack
  const roomVolM3 = profile.roomAreaSqM * (profile.ceilingHeightM || 2.5);
  // Indoor continuous filtration avoids 8 hours of sleep exposure:
  // Unfiltered indoor (infil 70%): ambientPm25 * 0.70; Filtered (infil + HEPA 15%): ambientPm25 * 0.15
  const unfilteredIndoorConc = ambientPm25 * 0.70;
  const filteredIndoorConc = ambientPm25 * 0.15;
  const sleepHours = 8;
  const sleepDoseAvoided = Math.round(
    ventRate * (unfilteredIndoorConc - filteredIndoorConc) * sleepHours
  );

  indoorHacks.push({
    id: 'hack-clean-room-weatherstrip',
    category: 'indoor_hack',
    title: 'Seal bedroom perimeter and establish a positive-pressure clean room',
    description: `Weatherstrip door sweeps and window jambs in the main bedroom (${profile.roomAreaSqM} m²). Place air cleaner at breathing level away from exterior drafts to maintain continuous filtration.`,
    timeWindow: 'Active during overnight rest',
    pm25AvoidedUg: Math.max(12, sleepDoseAvoided),
    carbonSavedKg: 0.45,
    impactBreakdown: {
      formula: 'Avoided Dose = V_sleep * (C_unfiltered - C_sealed_hepa) * 8.0 hours',
      variables: {
        'Sleep Inhalation Rate': `${ventRate} m³/h`,
        'Unmitigated Indoor PM2.5': `${Math.round(unfilteredIndoorConc)} µg/m³ (70% infiltration)`,
        'Sealed Purified PM2.5': `${Math.round(filteredIndoorConc)} µg/m³ (15% infiltration)`,
        'Exposure Time': '8.0 hours',
      },
      assumptions: [
        'Standard residential envelope without weatherstripping has an infiltration factor of 0.70.',
        'Adding silicone door sweeps and running a CADR-matched purifier drops infiltration to 0.15.',
        'Energy efficiency gain: reduced draft leakage saves 0.45 kg CO2e in night space heating.',
      ],
    },
    priority: 'high',
    implementationDifficulty: 'immediate',
  });

  // 3. DIY Corsi-Rosenthal Box or MERV 13 Box Fan Hack
  indoorHacks.push({
    id: 'hack-diy-corsi-rosenthal',
    category: 'indoor_hack',
    title: 'Deploy DIY Corsi-Rosenthal filtration array',
    description: `Build or position a 4-filter MERV 13 box fan unit. It delivers over 320 CFM of clean air delivery rate (CADR) for your ${profile.roomAreaSqM} m² space at a fraction of commercial filter cost.`,
    timeWindow: 'Continuous operation during high smog days',
    pm25AvoidedUg: Math.round(ventRate * ambientPm25 * 0.55 * 12),
    carbonSavedKg: 0.15,
    impactBreakdown: {
      formula: 'Avoided Inhalation = V_daily * (0.55 * C_ambient) * 12 hours active occupancy',
      variables: {
        'Clean Air Delivery Rate': '320 CFM (543 m³/h)',
        'Filter Media': '4x MERV 13 (5 cm pleated)',
        'Occupancy Duration': '12.0 hours',
        'Cohort Inhalation Rate': `${ventRate} m³/h`,
      },
      assumptions: [
        'UC Davis research validates that 4-filter MERV 13 box fans achieve 85% single-pass efficiency for 1-3 µm particles.',
        'Energy consumption: 45W box fan vs 120W dual commercial units saves 0.15 kg CO2e per day.',
      ],
    },
    priority: profile.hasAirPurifier ? 'recommended' : 'urgent',
    implementationDifficulty: 'low_cost',
  });

  // 4. Damp Microfiber Cleaning vs Dry Sweeping Hack
  indoorHacks.push({
    id: 'hack-damp-microfiber-mopping',
    category: 'indoor_hack',
    title: 'Switch to damp microfiber surface wipe-downs instead of dry sweeping',
    description: 'Dry sweeping resuspends coarse dust and toxic settled PM2.5 particles into respiratory reach. Use a damp microfiber cloth with electrostatic retention.',
    timeWindow: 'Morning and evening cleaning',
    pm25AvoidedUg: Math.round(ventRate * 28 * 3), // avoids 28 ug/m3 resuspension spike over 3 hours
    carbonSavedKg: 0.0,
    impactBreakdown: {
      formula: 'Resuspension Prevention = V_breathing * C_resuspended_spike * 3 hours',
      variables: {
        'Resuspension Spike Avoided': '28 µg/m³ settled particulate',
        'Breathing Rate': `${ventRate} m³/h`,
        'Decay Time': '3 hours',
      },
      assumptions: [
        'EPA Indoor Air study confirms dry sweeping elevates indoor PM2.5 concentrations by 25 to 40 µg/m³ for up to 3 hours.',
        'Damp microfiber binds sub-micron soot without resuspension.',
      ],
    },
    priority: 'high',
    implementationDifficulty: 'immediate',
  });

  // 5. Commute Green Alternative
  if (profile.commute === 'solo_car_gas') {
    const commuteKm = 24; // typical round-trip urban commute
    const carEmissionsAvoidedKg = Math.round(
      commuteKm * EMISSION_FACTORS.passenger_car_gasoline_kg_co2_per_km * EMISSION_FACTORS.transit_savings_fraction * 10
    ) / 10;
    // Driver stuck in stop-and-go traffic inhales high in-cabin tailpipe NO2 and PM2.5
    const inCabinAvoidedUg = Math.round(1.2 * 45 * 1.5); // 1.5 hours in traffic plume

    greenAlternatives.push({
      id: 'alt-commute-shared-transit',
      category: 'green_alternative',
      title: 'Shift commute to metro transit or 3-person rideshare',
      description: 'Single-occupancy vehicles emit concentrated exhaust plumes that penetrate following vehicles. Transitioning to metro rail or a 3-person carpool cuts neighborhood emissions directly.',
      timeWindow: 'Daily rush hour commute',
      pm25AvoidedUg: inCabinAvoidedUg,
      carbonSavedKg: carEmissionsAvoidedKg,
      impactBreakdown: {
        formula: 'Carbon Saved = Commute Distance (24 km) * Factor (0.192 kg/km) * 0.75 reduction',
        variables: {
          'Round-trip Distance': '24 km',
          'Vehicle Emission Factor': '0.192 kg CO2e / km',
          'Mode Shift Savings Factor': '75% reduction vs solo driving',
        },
        assumptions: [
          'DEFRA 2023 UK/EU & EPA average passenger car emission rating of 0.192 kg CO2e/km.',
          'Metro electric rail reduces personal transit carbon intensity by 75% per passenger-km.',
          'Eliminates in-cabin tailpipe plume inhalation during bumper-to-bumper standstill traffic.',
        ],
      },
      priority: 'high',
      implementationDifficulty: 'planned',
    });
  }

  // 6. Cooking & Heating Green Alternative
  if (profile.heating === 'natural_gas' || profile.heating === 'wood_biomass') {
    const isBiomass = profile.heating === 'wood_biomass';
    const co2Saved = isBiomass ? 4.8 : 1.2;
    const pmAvoided = isBiomass ? 180 : 35;

    greenAlternatives.push({
      id: 'alt-heating-and-cooking-optimization',
      category: 'green_alternative',
      title: isBiomass
        ? 'Transition from wood/biomass space heating to sealed electric radiant or heat pump'
        : 'Optimize gas heating schedule with a 1.5°C night setback and electric induction cooking',
      description: isBiomass
        ? 'Residential biomass combustion is the leading contributor to winter urban secondary organic aerosols. Eliminating wood burning directly spares your neighborhood airshed.'
        : 'Gas cooktops emit nitrogen dioxide levels exceeding 200 µg/m³ indoors. Utilize electric induction or electric kettle for boiling, and lower central heat by 1.5°C.',
      timeWindow: 'Heating & meal preparation cycles',
      pm25AvoidedUg: pmAvoided,
      carbonSavedKg: co2Saved,
      impactBreakdown: {
        formula: isBiomass
          ? 'Daily Biomass Avoidance = Direct PM2.5 cessation + 4.8 kg CO2e avoided'
          : 'Carbon Saved = Gas displacement (6 kWh gas * 0.203 kg/kWh) = 1.2 kg CO2e',
        variables: {
          'Fuel Type': profile.heating,
          'Direct CO2e Factor': isBiomass ? '4.80 kg/day' : '0.203 kg CO2e / kWh',
          'Indoor NO2 / PM2.5 Spike Displaced': isBiomass ? '180 µg/m³' : '35 µg/m³',
        },
        assumptions: [
          'EPA AP-42 residential wood combustion emission factor.',
          'WHO 2021 indoor cooking exposure assessment: gas stoves without range hoods exceed WHO 24h NO2 limits within 20 minutes.',
          'Every 1°C reduction in winter thermostat setpoint reduces fuel combustion by 6-8%.',
        ],
      },
      priority: isBiomass ? 'urgent' : 'recommended',
      implementationDifficulty: 'low_cost',
    });
  } else {
    // Electric / Heat Pump profile alternative
    greenAlternatives.push({
      id: 'alt-smart-grid-preheat',
      category: 'green_alternative',
      title: 'Pre-heat dwelling during mid-day clean solar peak',
      description: 'Run your electric heat pump during 12:00 PM to 3:00 PM when grid solar generation peaks and atmospheric dispersion is highest, allowing a setback during evening inversion.',
      timeWindow: '12:00 PM to 3:00 PM',
      pm25AvoidedUg: 15,
      carbonSavedKg: 0.85,
      impactBreakdown: {
        formula: 'Grid Marginal Carbon Saved = 4.2 kWh shifted * (0.380 - 0.175 kg CO2e/kWh)',
        variables: {
          'Energy Shifted': '4.2 kWh',
          'Peak Evening Grid Intensity': '0.380 kg CO2e/kWh',
          'Midday Solar Grid Intensity': '0.175 kg CO2e/kWh',
        },
        assumptions: [
          'Marginal grid emission factor drops substantially during peak solar noon hours.',
          'Thermal inertia of dwelling stores heat through evening smog onset.',
        ],
      },
      priority: 'recommended',
      implementationDifficulty: 'immediate',
    });
  }

  const allSuggestions = [...routines, ...indoorHacks, ...greenAlternatives];
  const totalAvoidedPm25Ug = allSuggestions.reduce((acc, s) => acc + s.pm25AvoidedUg, 0);
  const totalSavedCarbonKg = Math.round(allSuggestions.reduce((acc, s) => acc + s.carbonSavedKg, 0) * 10) / 10;

  return {
    routines,
    indoorHacks,
    greenAlternatives,
    totalAvoidedPm25Ug,
    totalSavedCarbonKg,
  };
}
