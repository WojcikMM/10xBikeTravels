import { z } from 'zod';

// Types
export interface RoutePoint {
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RouteGenerationResult {
  title: string;
  summary: string;
  routePoints: RoutePoint[];
}

export interface GenerateRouteParams {
  startPoint: string;
  routePriority: 'scenic' | 'twisty' | 'avoid_highways';
  motorcycleType?: string;
  distance?: number;
  duration?: number;
}

// Validation schemas
const RoutePointSchema = z.object({
  name: z.string(),
  description: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

const RouteGenerationResultSchema = z.object({
  title: z.string(),
  summary: z.string(),
  routePoints: z.array(RoutePointSchema),
});

// Error types
export class OpenRouterError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

export class RouteGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RouteGenerationError';
  }
}

export class OpenRouterService {
  private apiKey: string;
  private apiUrl: string;
  private modelName: string;
  private webAppUrl: string;
  private maxRetries: number;
  private retryDelay: number;
  private maxTokens: number;
  private temperature: number;

  constructor(
    apiKey: string,
    apiUrl: string,
    modelName: string,
    webAppUrl: string,
    maxRetries = 3,
    retryDelay = 1000,
    maxTokens = 900,
    temperature = 9
  ) {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }
    if (!apiUrl) {
      throw new Error('OpenRouter API URL is required');
    }
    if (!modelName) {
      throw new Error('OpenRouter model name is required');
    }
    if (!webAppUrl) {
      throw new Error('OpenRouter web app URL is required');
    }
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.modelName = modelName;
    this.webAppUrl = webAppUrl;
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
    this.maxTokens = maxTokens;
    this.temperature = temperature;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private buildPrompt(params: GenerateRouteParams): string {
    let prompt = `Generate an interesting motorcycle route in Poland. `;
    prompt += `The starting point is ${params.startPoint}. `;

    // Add route priority to prompt
    switch (params.routePriority) {
      case 'scenic':
        prompt += 'Prioritize scenic routes with beautiful landscapes and views. ';
        break;
      case 'twisty':
        prompt += 'Prioritize twisty, curvy roads that are fun to ride. ';
        break;
      case 'avoid_highways':
        prompt += 'Avoid highways and main roads, focus on smaller, less traveled roads. ';
        break;
    }

    // Add distance or duration constraint
    if (params.distance) {
      prompt += `The route should be approximately ${params.distance} kilometers. `;
    } else if (params.duration) {
      prompt += `The route should take approximately ${params.duration} hours to complete at a leisurely pace. `;
    }

    // Add motorcycle type if provided
    if (params.motorcycleType && params.motorcycleType !== 'other') {
      prompt += `Consider that I'll be riding a ${params.motorcycleType} motorcycle. `;
    }

    // Add instructions for output format
    prompt += `
    Please provide the output in the following JSON format:
    {
      "title": "A catchy title for the route",
      "summary": "A short summary describing the route, highlights, and key features",
      "routePoints": [
        {
          "name": "Starting point name",
          "description": "Brief description of this location",
          "coordinates": {"lat": 52.1234, "lng": 21.1234}
        },
        {
          "name": "Waypoint 1 name",
          "description": "Description of this waypoint and the road leading to it",
          "coordinates": {"lat": 52.2345, "lng": 21.2345}
        },
        ...and so on
      ]
    }
    
    Include 5-10 waypoints with accurate coordinates in Poland. Make the route logical and interesting.
    Ensure all coordinates are within Poland's borders (approximately 49°N to 55°N, 14°E to 24°E).
    The route should be realistic and follow actual roads.
    
    Please make sure that you return only expected JSON wthout any additional descriptions or hints.
    `;

    return prompt;
  }

  private async callOpenRouter(prompt: string, retryCount = 0): Promise<RouteGenerationResult> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': this.webAppUrl,
          'X-Title': '10xBikeTravels',
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: 'system',
              content:
                'You are a motorcycle route planning expert specializing in creating interesting and safe routes in Poland. You have extensive knowledge of Polish roads, landscapes, and points of interest.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new OpenRouterError(
          error.error?.message || `OpenRouter API error: ${response.status}`,
          error.error?.code
        );
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new OpenRouterError('No content received from OpenRouter');
      }

      try {
        // Parse the JSON response
        const parsedContent = JSON.parse(content);

        // Validate the response structure
        const validatedResult = RouteGenerationResultSchema.parse(parsedContent);

        // Additional validation for coordinates
        for (const point of validatedResult.routePoints) {
          if (
            point.coordinates.lat < 49 ||
            point.coordinates.lat > 55 ||
            point.coordinates.lng < 14 ||
            point.coordinates.lng > 24
          ) {
            throw new RouteGenerationError("Generated coordinates are outside Poland's borders");
          }
        }

        return validatedResult;
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new RouteGenerationError(`Invalid route format: ${error.message}`);
        }
        throw error;
      }
    } catch (error) {
      if (error instanceof OpenRouterError && retryCount < this.maxRetries) {
        await this.delay(this.retryDelay * Math.pow(2, retryCount));
        return this.callOpenRouter(prompt, retryCount + 1);
      }
      throw error;
    }
  }

  public async generateRoute(params: GenerateRouteParams): Promise<RouteGenerationResult> {
    try {
      const prompt = this.buildPrompt(params);
      return await this.callOpenRouter(prompt);
    } catch (error) {
      if (error instanceof OpenRouterError) {
        throw new Error(`Failed to generate route: ${error.message}`);
      }
      if (error instanceof RouteGenerationError) {
        throw error;
      }
      throw new Error('An unexpected error occurred while generating the route');
    }
  }
}
