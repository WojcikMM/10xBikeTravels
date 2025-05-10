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
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly modelName: string;
  private readonly webAppUrl: string;
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private readonly maxTokens: number;
  private readonly temperature: number;

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
    let prompt = `Create a realistic and detailed motorcycle route in Poland. `;
    prompt += `Starting point: "${params.startPoint}". `;

    // Add route priority to prompt
    switch (params.routePriority) {
      case 'scenic':
        prompt +=
          'The route should be scenic, passing through beautiful landscapes, lakes, mountains, or coastline, with plenty of viewpoints and photo-worthy locations. Visual appeal and aesthetic experiences should be the priority. ';
        break;
      case 'twisty':
        prompt +=
          'The route should contain as many twisty, technical roads with curves and switchbacks that are enjoyable to ride on a motorcycle. Mountainous or hilly areas are preferred. The priority is riding pleasure, not the shortest path. ';
        break;
      case 'avoid_highways':
        prompt +=
          'The route should completely avoid highways (A1, A2, A4, etc.) and expressways (S1, S3, S7, etc.). Instead, prefer provincial and local roads with good surfaces. The priority is calm riding away from heavy traffic. ';
        break;
    }

    // Add distance or duration constraint
    if (params.distance) {
      prompt += `The route should be approximately ${params.distance} kilometers one-way (not counting the return journey). `;
    } else if (params.duration) {
      prompt += `The route should take about ${params.duration} hours of riding time (not including stops and sightseeing), assuming an average speed of 60-70 km/h on local roads and 90 km/h on main roads. `;
    }

    // Add motorcycle type if provided
    if (params.motorcycleType && params.motorcycleType !== 'other') {
      switch (params.motorcycleType) {
        case 'sport':
          prompt +=
            'The route is planned for a sport motorcycle, so good road surface quality and interesting curves are important. ';
          break;
        case 'cruiser':
          prompt +=
            'The route is planned for a cruiser, so riding comfort, wider roads, and nice views are preferred over technical handling. ';
          break;
        case 'touring':
          prompt +=
            'The route is planned for a touring motorcycle, so it should include diverse terrain and opportunities to visit interesting places. ';
          break;
        case 'adventure':
          prompt +=
            'The route is planned for an adventure motorcycle, so it may include sections of gravel and forest roads (but not difficult off-road), which are passable for this type of motorcycle. ';
          break;
        case 'standard':
          prompt +=
            'The route is planned for a standard motorcycle, so it should be balanced in terms of difficulty and road types. ';
          break;
        default:
          prompt += `The route is planned for a ${params.motorcycleType} type motorcycle. `;
      }
    }

    // Add regional context
    prompt += `
  Include interesting tourist attractions, towns, or landscapes in the region around the starting point. In the route, include real roads marked with numbers (e.g., DK7, DW123), existing cities, and tourist attractions.
  
  For different regions of Poland:
  - For mountain routes (Tatra, Bieszczady, Karkonosze): include mountain passes, viewpoints, and scenic valleys
  - For coastal routes: include coastline, cliffs, lighthouses
  - For Masurian Lake District routes: include lakes, piers, historic bridges
  - For Podlasie region routes: include Białowieża Forest, national parks
  
  Each point on the route must have precise GPS coordinates (accurate to 4 decimal places), a real place name, and a brief description of the place along with information about what makes it worth visiting for a motorcyclist.
  `;

    // Add instructions for output format
    prompt += `
  Return the result ONLY in the following JSON format, without any additional explanations:
  
  {
  "title": "A catchy route title, e.g., 'Karkonosze Serpentines' or 'Coastal Adventure'",
  "summary": "A concise description of the entire route (150-250 words), listing main attractions, approximate length, road character, and landscape type",
  "routePoints": [
    {
      "name": "Starting point name",
      "description": "Description of this place and surroundings, 2-3 sentences",
      "coordinates": {"lat": 52.1234, "lng": 21.1234}
    },
    {
      "name": "Intermediate point name",
      "description": "Description of the place and the road leading to it (surface type, curves, landscape)",
      "coordinates": {"lat": 52.2345, "lng": 21.2345}
    },
    ... and so on for all points
  ]
  }
  
  Return exactly 7-10 points (including starting and ending points), logically distributed along the route.
  Make sure all coordinates are within Poland's borders (between 49°N-55°N and 14°E-24°E).
  The route should be realistic - points should not be more than 50-70 km apart from each other.
  IMPORTANT: Return only clean JSON without additional comments, formatting characters, headers, or examples.
  `;

    return prompt;
  }

  private parseCleanJson(content: string): any {
    const cleanedContent = content.trim().replace(/^```json\s*|```$/g, '');

    try {
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
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
        const parsedContent = this.parseCleanJson(content);

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
