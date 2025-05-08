import {
  OpenRouterService,
  GenerateRouteParams,
  OpenRouterError,
  RouteGenerationError,
} from '../../../lib/ai/openrouter-service';
import { server } from '../../mocks/server/server';
import { http, HttpResponse } from 'msw';

// Use environment variables similar to the actual implementation
const mockConfig = {
  apiKey: 'test-api-key',
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  modelName: 'test-model',
  webAppUrl: 'https://10xbiketravels.com',
};

describe('OpenRouterService', () => {
  let openRouterService: OpenRouterService;

  beforeEach(() => {
    // Create a new instance for each test
    openRouterService = new OpenRouterService(
      mockConfig.apiKey,
      mockConfig.apiUrl,
      mockConfig.modelName,
      mockConfig.webAppUrl,
      1, // Set max retries to 1 for faster tests
      100 // Set retry delay to 100ms for faster tests
    );
  });

  it('should be properly initialized with config values', () => {
    // This test verifies that the service is constructed correctly
    expect(openRouterService).toBeInstanceOf(OpenRouterService);
  });

  it('should throw an error if required config is missing', () => {
    // Test that the service validates required configuration
    expect(
      () => new OpenRouterService('', mockConfig.apiUrl, mockConfig.modelName, mockConfig.webAppUrl)
    ).toThrow();
    expect(
      () => new OpenRouterService(mockConfig.apiKey, '', mockConfig.modelName, mockConfig.webAppUrl)
    ).toThrow();
    expect(
      () => new OpenRouterService(mockConfig.apiKey, mockConfig.apiUrl, '', mockConfig.webAppUrl)
    ).toThrow();
    expect(
      () => new OpenRouterService(mockConfig.apiKey, mockConfig.apiUrl, mockConfig.modelName, '')
    ).toThrow();
  });

  it('should generate a route successfully', async () => {
    // Test route generation using MSW mock
    const params: GenerateRouteParams = {
      startPoint: 'Warsaw',
      routePriority: 'scenic',
      distance: 200,
    };

    const result = await openRouterService.generateRoute(params);

    // Verify the result structure
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('summary');
    expect(result).toHaveProperty('routePoints');
    expect(Array.isArray(result.routePoints)).toBe(true);
    expect(result.routePoints.length).toBeGreaterThan(0);

    // Verify a sample route point
    const firstPoint = result.routePoints[0];
    expect(firstPoint).toHaveProperty('name');
    expect(firstPoint).toHaveProperty('description');
    expect(firstPoint).toHaveProperty('coordinates');
    expect(firstPoint.coordinates).toHaveProperty('lat');
    expect(firstPoint.coordinates).toHaveProperty('lng');
  });

  it('should handle API errors gracefully', async () => {
    // Override the default MSW handler for this test only
    server.use(
      http.post(mockConfig.apiUrl, () => {
        return new HttpResponse(
          JSON.stringify({
            error: {
              message: 'Rate limit exceeded',
              code: 'rate_limit_exceeded',
            },
          }),
          { status: 429 }
        );
      })
    );

    const params: GenerateRouteParams = {
      startPoint: 'Warsaw',
      routePriority: 'scenic',
      distance: 200,
    };

    // The API error should propagate as an OpenRouterError or similar error
    await expect(openRouterService.generateRoute(params)).rejects.toThrow();
  }, 10000); // Increase timeout to 10 seconds

  it('should handle invalid JSON response format', async () => {
    // Override the default MSW handler for this test only
    server.use(
      http.post(mockConfig.apiUrl, () => {
        return HttpResponse.json({
          choices: [
            {
              message: {
                content: 'This is not valid JSON format',
              },
            },
          ],
        });
      })
    );

    const params: GenerateRouteParams = {
      startPoint: 'Warsaw',
      routePriority: 'scenic',
      distance: 200,
    };

    // Expect any error related to JSON parsing or validation
    await expect(openRouterService.generateRoute(params)).rejects.toThrow();
  });

  it('should handle non-Poland coordinates correctly', async () => {
    // Override the default MSW handler for this test only
    server.use(
      http.post(mockConfig.apiUrl, () => {
        return HttpResponse.json({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  title: 'Invalid Route',
                  summary: 'Route with coordinates outside Poland',
                  routePoints: [
                    {
                      name: 'Outside Poland',
                      description: 'This point is outside Poland',
                      coordinates: { lat: 40.7128, lng: -74.006 }, // New York coordinates
                    },
                  ],
                }),
              },
            },
          ],
        });
      })
    );

    const params: GenerateRouteParams = {
      startPoint: 'Warsaw',
      routePriority: 'scenic',
      distance: 200,
    };

    // Expect any error related to coordinate validation
    await expect(openRouterService.generateRoute(params)).rejects.toThrow();
  });
});
