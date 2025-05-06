'use client';

import { openRouterService } from './openrouter-config';
import type { GenerateRouteParams, RouteGenerationResult } from './openrouter-service';

export { type GenerateRouteParams, type RouteGenerationResult } from './openrouter-service';

export async function generateRoute(params: GenerateRouteParams): Promise<RouteGenerationResult> {
  try {
    return await openRouterService.generateRoute(params);
  } catch (error) {
    console.error('Error generating route:', error);
    throw new Error('Failed to generate route. Please try again.');
  }
}