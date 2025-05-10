import { NextRequest, NextResponse } from 'next/server';
import { generateRoute } from '@/lib/ai/route-generator';
import { z } from 'zod';

// Define schema for request validation
const routeRequestSchema = z.object({
  startPoint: z.string().min(1, 'Starting point is required'),
  routePriority: z.enum(['scenic', 'twisty', 'avoid_highways']),
  motorcycleType: z.string(),
  distance: z.number().optional(),
  duration: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    console.log('Route generation request received:', body);

    // Validate request body
    const result = routeRequestSchema.safeParse(body);
    if (!result.success) {
      console.error('Validation error:', result.error);
      return NextResponse.json({
        error: 'Invalid request data',
        details: result.error.format(),
      }, { status: 400 });
    }

    // Extract validated data
    const { startPoint, routePriority, motorcycleType, distance, duration } = result.data;

    // Check that either distance or duration is provided
    if (distance === undefined && duration === undefined) {
      return NextResponse.json({
        error: 'Either distance or duration must be provided',
      }, { status: 400 });
    }

    // Generate route
    console.log('Generating route with params:', result.data);
    const routeResult = await generateRoute({
      startPoint,
      routePriority,
      motorcycleType,
      distance,
      duration,
    });

    // Return successful response
    return NextResponse.json({
      success: true,
      data: routeResult,
    });
  } catch (error: any) {
    console.error('Error generating route:', error);
    
    // Return error response
    return NextResponse.json({
      error: 'Failed to generate route',
      message: error.message || 'An unexpected error occurred',
    }, { status: 500 });
  }
}
