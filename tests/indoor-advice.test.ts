import { describe, it, expect } from 'vitest';
import {
  WINTER_INDOOR_HACKS,
  EPA_AUTHORITATIVE_FINDINGS,
  getTailoredIndoorAdvice,
} from '../lib/indoor-advice';

describe('Winter Indoor Air Quality Advice & EPA Science Engine', () => {
  it('incorporates authoritative EPA findings regarding indoor vs outdoor pollution', () => {
    expect(EPA_AUTHORITATIVE_FINDINGS.indoorOutdoorRatio).toContain('2 to 5 times more polluted');
    expect(EPA_AUTHORITATIVE_FINDINGS.sourceAgency).toContain('Environmental Protection Agency');
    expect(EPA_AUTHORITATIVE_FINDINGS.citationPublication).toContain('EPA');
  });

  it('includes essential winter-specific indoor hacks with quantified impact explanations', () => {
    // 1. HEPA filters
    const hepaHack = WINTER_INDOOR_HACKS.find(h => h.id === 'hack-hepa-continuous');
    expect(hepaHack).toBeDefined();
    expect(hepaHack!.impactExplanation).toContain('PM2.5');
    expect(hepaHack!.estimatedReductionPct).toBeGreaterThanOrEqual(65);
    expect(hepaHack!.authoritativeSource).toContain('EPA');

    // 2. Ventilating when cooking
    const cookingHack = WINTER_INDOOR_HACKS.find(h => h.id === 'hack-cooking-ventilation');
    expect(cookingHack).toBeDefined();
    expect(cookingHack!.impactExplanation.toLowerCase()).toContain('reduces');
    expect(cookingHack!.estimatedReductionPct).toBeGreaterThanOrEqual(70);

    // 3. Avoiding kerosene and unvented space heaters
    const keroseneHack = WINTER_INDOOR_HACKS.find(h => h.id === 'hack-avoid-kerosene');
    expect(keroseneHack).toBeDefined();
    expect(keroseneHack!.impactExplanation).toContain('carbon monoxide');
    expect(keroseneHack!.estimatedReductionPct).toBeGreaterThanOrEqual(90);

    // 4. Damp microfiber cleaning vs dry sweeping
    const cleaningHack = WINTER_INDOOR_HACKS.find(h => h.id === 'hack-damp-cleaning');
    expect(cleaningHack).toBeDefined();
    expect(cleaningHack!.impactExplanation).toContain('resuspension');

    // 5. Clean room sealing
    const sealingHack = WINTER_INDOOR_HACKS.find(h => h.id === 'hack-clean-room-sealing');
    expect(sealingHack).toBeDefined();
    expect(sealingHack!.impactExplanation).toContain('infiltration');
  });

  it('ensures every hack has a concise, quantified impact explanation and action steps', () => {
    for (const hack of WINTER_INDOOR_HACKS) {
      expect(hack.title).toBeTruthy();
      expect(hack.impactExplanation).toBeTruthy();
      expect(hack.impactExplanation.length).toBeGreaterThan(20);
      expect(hack.actionSteps.length).toBeGreaterThanOrEqual(2);
      expect(hack.authoritativeSource).toBeTruthy();
      expect(hack.winterRelevance).toBeTruthy();
      expect(hack.highlightStat).toBeTruthy();
    }
  });

  it('tailors advice priority dynamically based on household constraints', () => {
    // Household with gas cooking and fuel heating should prioritize combustion & ventilation
    const tailoredGas = getTailoredIndoorAdvice({
      hasGasCooking: true,
      heatingSource: 'natural_gas',
      hasChildrenOrElderly: false,
    });

    const highPriorityCategories = tailoredGas.highPriorityHacks.map(h => h.category);
    expect(
      highPriorityCategories.includes('combustion_safety') ||
      highPriorityCategories.includes('ventilation')
    ).toBe(true);

    // Household with vulnerable family members should prioritize filtration & clean rooms
    const tailoredVulnerable = getTailoredIndoorAdvice({
      hasGasCooking: false,
      heatingSource: 'heat_pump',
      hasChildrenOrElderly: true,
    });

    const vulnerableIds = tailoredVulnerable.highPriorityHacks.map(h => h.id);
    expect(
      vulnerableIds.includes('hack-clean-room-sealing') ||
      vulnerableIds.includes('hack-hepa-continuous')
    ).toBe(true);
  });
});
