import { OpenRouterService, GenerateRouteParams } from '../../../lib/ai/openrouter-service';

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
      mockConfig.webAppUrl
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

  // More tests would be added here for error cases, timeout handling, etc.
});
