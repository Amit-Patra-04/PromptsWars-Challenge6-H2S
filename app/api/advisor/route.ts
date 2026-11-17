import { NextRequest, NextResponse } from 'next/server';
import { generateUrbanAirAdvice } from '@/lib/gemini-advisor';
import { UserProfileSchema, AtmosphericDataSchema } from '@/lib/sanitizer';
import { SupportedLanguage } from '@/lib/i18n';

/**
 * POST handler for Urban Air Advisor Generation Endpoint.
 * Validates user profile and atmospheric telemetry payloads with Zod schemas,
 * sanitizes language codes, and invokes Vertex AI Gemini 3 prompt orchestration.
 *
 * @param request Next.js API Request containing user profile, atmospheric data, and language
 * @returns JSON response with personalized routines, indoor hacks, and quantified impact
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, weather, language } = body;

    // Validate Profile against strict schema
    const profileValidation = UserProfileSchema.safeParse(profile);
    if (!profileValidation.success) {
      return NextResponse.json(
        { error: 'Invalid user profile data', details: profileValidation.error.format() },
        { status: 400 }
      );
    }

    // Validate Atmospheric Data against strict schema
    const weatherValidation = AtmosphericDataSchema.safeParse(weather);
    if (!weatherValidation.success) {
      return NextResponse.json(
        { error: 'Valid atmospheric data is required', details: weatherValidation.error.format() },
        { status: 400 }
      );
    }

    const safeLanguage: SupportedLanguage = ['en', 'hi', 'zh', 'es', 'fr', 'pa'].includes(language)
      ? language
      : 'en';

    const advisorResult = await generateUrbanAirAdvice({
      profile: profileValidation.data,
      weather: weatherValidation.data,
      language: safeLanguage,
    });

    return NextResponse.json(advisorResult);
  } catch (error) {
    console.error('Advisor API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate urban air advisor guidance' },
      { status: 500 }
    );
  }
}
