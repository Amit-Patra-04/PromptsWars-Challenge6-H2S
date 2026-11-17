import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveAtmosphericData } from '@/lib/aqi-service';
import { CoordinatesSchema, sanitizeString } from '@/lib/sanitizer';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latParam = parseFloat(searchParams.get('lat') || '28.6139');
    const lonParam = parseFloat(searchParams.get('lon') || '77.2090');
    const rawCity = searchParams.get('city') || 'Delhi';
    const city = sanitizeString(rawCity) || 'Metropolitan Area';

    // Validate coordinates
    const validation = CoordinatesSchema.safeParse({
      latitude: latParam,
      longitude: lonParam,
      city,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid coordinate parameters', details: validation.error.format() },
        { status: 400 }
      );
    }

    const atmosphericData = await fetchLiveAtmosphericData(
      validation.data.latitude,
      validation.data.longitude,
      validation.data.city
    );

    return NextResponse.json(atmosphericData);
  } catch (error) {
    console.error('AQI API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve atmospheric telemetry' },
      { status: 500 }
    );
  }
}
