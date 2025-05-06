// Validate required environment variables
if (!process.env.NEXT_PUBLIC_OPENROUTER_KEY) {
  throw new Error('NEXT_PUBLIC_OPENROUTER_KEY environment variable is not set');
}
if (!process.env.NEXT_PUBLIC_OPENROUTER_API_URL) {
  throw new Error('NEXT_PUBLIC_OPENROUTER_API_URL environment variable is not set');
}

if (!process.env.NEXT_PUBLIC_OPENROUTER_MODEL) {
  throw new Error('NEXT_PUBLIC_OPENROUTER_MODEL environment variable is not set'); 
}

if (!process.env.NEXT_PUBLIC_OPENROUTER_APP_URL) {
  throw new Error('NEXT_PUBLIC_OPENROUTER_APP_URL environment variable is not set');
}

// OpenRouter API Configuration
const config = {
  API_URL: process.env.NEXT_PUBLIC_OPENROUTER_API_URL,
  MODEL: process.env.NEXT_PUBLIC_OPENROUTER_MODEL,
  APP_URL: process.env.NEXT_PUBLIC_OPENROUTER_APP_URL,
  APP_NAME: '10xBikeTravels',
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // in milliseconds
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2000
} as const;



// Create a singleton instance of OpenRouterService
import { OpenRouterService } from './openrouter-service';

export const openRouterService = new OpenRouterService(
  process.env.NEXT_PUBLIC_OPENROUTER_KEY,
  config.API_URL,
  config.MODEL,
  config.APP_NAME,
  config.MAX_RETRIES,
  config.RETRY_DELAY,
  config.MAX_TOKENS,
  config.TEMPERATURE
); 