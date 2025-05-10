import { GenerateRouteParams, RouteGenerationResult } from '@/lib/ai/openrouter-service';
import { openRouterService } from '@/lib/ai/openrouter-config';

export async function generateRoute(params: GenerateRouteParams): Promise<RouteGenerationResult> {
  return openRouterService.generateRoute(params);
}
