import { NextRequest, NextResponse } from 'next/server';
import { calculateCADR } from '@/lib/indoor-guidelines';
import { CADRInputSchema } from '@/lib/sanitizer';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomArea = parseFloat(searchParams.get('roomAreaSqM') || '25');
    const ceilingHeight = parseFloat(searchParams.get('ceilingHeightM') || '2.5');
    const targetAch = parseFloat(searchParams.get('targetACH') || '5');

    const validation = CADRInputSchema.safeParse({
      roomAreaSqM: roomArea,
      ceilingHeightM: ceilingHeight,
      targetAirChangesPerHour: targetAch,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid CADR sizing parameters', details: validation.error.format() },
        { status: 400 }
      );
    }

    const result = calculateCADR(
      validation.data.roomAreaSqM,
      validation.data.ceilingHeightM,
      validation.data.targetAirChangesPerHour
    );

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to compute clean air delivery rate' },
      { status: 500 }
    );
  }
}
