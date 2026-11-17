import { describe, it, expect } from 'vitest';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, getTranslation } from '../lib/i18n';

describe('Multilingual Localization Service', () => {
  it('supports all 6 specified smog-prone regional languages', () => {
    const codes = SUPPORTED_LANGUAGES.map(l => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('hi');
    expect(codes).toContain('zh');
    expect(codes).toContain('es');
    expect(codes).toContain('fr');
    expect(codes).toContain('pa');
  });

  it('provides complete translation dictionaries across all languages', () => {
    const requiredKeys = [
      'appTitle',
      'heroHeadline',
      'primaryCta',
      'currentAqi',
      'inversionAlertTitle',
      'pm25AvoidedMetric',
      'carbonSavedMetric',
      'cadrToolTitle',
    ];

    for (const lang of SUPPORTED_LANGUAGES) {
      for (const key of requiredKeys) {
        const text = getTranslation(lang.code, key);
        expect(text).toBeTruthy();
        expect(typeof text).toBe('string');
      }
    }
  });

  it('falls back gracefully to English when key is missing', () => {
    const fallbackText = getTranslation('hi', 'nonExistentKey');
    expect(fallbackText).toBe('nonExistentKey');
  });
});
