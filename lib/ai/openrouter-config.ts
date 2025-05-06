import { OpenRouterService } from './openrouter-service';

if (!process.env.NEXT_PUBLIC_OPENROUTER_KEY) {
  throw new Error('NEXT_PUBLIC_OPENROUTER_KEY environment variable is not set');
}

// Create a singleton instance of OpenRouterService
export const openRouterService = new OpenRouterService(
  process.env.NEXT_PUBLIC_OPENROUTER_KEY,
  3, // maxRetries
  1000 // retryDelay in ms
); 