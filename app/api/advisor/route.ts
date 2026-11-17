import { NextRequest, NextResponse } from 'next/server';
import { generateUrbanAirAdvice } from '@/lib/gemini-advisor';
import { UserProfileSchema } from '@/lib/sanitizer';
import { AtmosphericData } from '@/lib/types';
import { SupportedLanguage } from '@/lib/i18n';

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

    if (!weather || typeof weather.pm25 !== 'number') {
      return NextResponse.json(
        { error: 'Valid atmospheric data is required' },
        { status: 400 }
      );
    }

    const safeLanguage: SupportedLanguage = ['en', 'hi', 'zh', 'es', 'fr', 'pa'].includes(language)
      ? language
      : 'en';

    const advisorResult = await generateUrbanAirAdvice({
      profile: profileValidation.data,
      weather: weather as AtmosphericData,
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
