import { http, HttpResponse } from 'msw';

// Mock response data
const successfulRouteResponse = {
  choices: [
    {
      message: {
        content: JSON.stringify({
          title: 'Beautiful Mountain Ride from Warsaw',
          summary:
            'A scenic route from Warsaw through the foothills of Poland, featuring amazing views and twisting roads.',
          routePoints: [
            {
              name: 'Warsaw, Palace of Culture and Science',
              description: 'Starting point in the heart of Warsaw',
              coordinates: { lat: 52.2321, lng: 21.0063 },
            },
            {
              name: 'Góra Kalwaria',
              description: 'Charming town with historical significance',
              coordinates: { lat: 51.9628, lng: 21.2158 },
            },
            {
              name: 'Kozienice',
              description: 'Passing through forest areas with smooth roads',
              coordinates: { lat: 51.5849, lng: 21.5451 },
            },
            {
              name: 'Kazimierz Dolny',
              description: 'Picturesque town by the Vistula river with stunning views',
              coordinates: { lat: 51.3248, lng: 21.9499 },
            },
            {
              name: 'Nałęczów',
              description: 'Famous spa town with beautiful architecture',
              coordinates: { lat: 51.2867, lng: 22.2178 },
            },
          ],
        }),
      },
    },
  ],
};

// Error response structures
const rateLimitError = {
  error: {
    message: 'Rate limit exceeded',
    code: 'rate_limit_exceeded',
  },
};

const invalidFormatError = {
  choices: [
    {
      message: {
        content: 'This is not valid JSON format',
      },
    },
  ],
};

// Define handlers for OpenRouter API
export const openrouterHandlers = [
  // Successful response
  http.post('https://openrouter.ai/api/v1/chat/completions', async ({ request }) => {
    const body = (await request.json()) as any;

    // Simulate different responses based on request content
    const requestContent = body.messages?.find((m: any) => m.role === 'user')?.content || '';

    if (requestContent.includes('Warsaw')) {
      return HttpResponse.json(successfulRouteResponse);
    }

    // Default success response
    return HttpResponse.json(successfulRouteResponse);
  }),

  // Simulated error response (can be activated in tests by using a specific search parameter)
  http.post('https://openrouter.ai/api/v1/chat/completions', async ({ request }) => {
    const url = new URL(request.url);

    if (url.searchParams.get('simulate') === 'error') {
      return new HttpResponse(JSON.stringify(rateLimitError), { status: 429 });
    }

    return new Response();
  }),

  // Invalid format response
  http.post('https://openrouter.ai/api/v1/chat/completions', async ({ request }) => {
    const url = new URL(request.url);

    if (url.searchParams.get('simulate') === 'invalid-format') {
      return HttpResponse.json(invalidFormatError);
    }

    return new Response();
  }),
];
