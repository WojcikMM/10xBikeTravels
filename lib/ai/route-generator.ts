interface RouteParams {
  startPoint: string;
  routePriority: string;
  motorcycleType: string;
  distance?: number;
  duration?: number;
}

interface RouteResult {
  title: string;
  summary: string;
  routePoints: any[];
  // other fields that might be returned
}

const getApiConfig = () => ({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_KEY,
  apiUrl: process.env.NEXT_PUBLIC_OPENROUTER_API_URL,
  model: process.env.NEXT_PUBLIC_OPENROUTER_MODEL,
  appUrl: process.env.NEXT_PUBLIC_OPENROUTER_APP_URL,
});

export async function generateRoute(params: RouteParams): Promise<RouteResult> {
  const { apiKey, apiUrl, model, appUrl } = getApiConfig();

  if (!apiKey || !apiUrl || !model) {
    throw new Error('Missing required API configurations for route generator');
  }

  try {
    const prompt = createRoutePrompt(params);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': appUrl || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You are an expert in planning motorcycle routes in Poland.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();

    return processRouteResponse(data);
  } catch (error: any) {
    console.error('Error generating route:', error);
    throw new Error(error.message || 'Failed to generate route. Please try again.');
  }
}

// Helper to create prompt for an AI model
function createRoutePrompt(params: RouteParams): string {
  const { startPoint, routePriority, motorcycleType, distance, duration } = params;

  let prompt = `Plan a motorcycle route starting at ${startPoint}. `;

  // Add information about route priority
  if (routePriority === 'scenic') {
    prompt += 'The route should be scenic, with beautiful views. ';
  } else if (routePriority === 'twisty') {
    prompt += 'The route should include as many twisty roads as possible. ';
  } else if (routePriority === 'avoid_highways') {
    prompt += 'The route should avoid highways and expressways. ';
  }

  // Add information about motorcycle type
  prompt += `The route is intended for a ${motorcycleType} type motorcycle. `;

  // Add information about distance or duration
  if (distance) {
    prompt += `The route should be approximately ${distance} kilometers. `;
  } else if (duration) {
    prompt += `The route should take approximately ${duration} hours to ride. `;
  }

  prompt += 'Provide a detailed description of the route, including a list of places to visit, road descriptions, and rest stop suggestions. ';
  prompt += 'Return the response in JSON format containing: "title" (short route title), "summary" (brief route summary), "routePoints" (array of route points).';

  return prompt;
}

function processRouteResponse(data: any): RouteResult {
  try {
    const responseContent = data.choices?.[0]?.message?.content;

    if (!responseContent) {
      throw new Error('Received empty response from API');
    }

    const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/) ||
        responseContent.match(/{[\s\S]*?}/);

    if (!jsonMatch) {
      return {
        title: 'Generated Route',
        summary: responseContent.substring(0, 500) + '...',
        routePoints: [],
      };
    }

    let jsonString = jsonMatch[1] || jsonMatch[0];
    const result = JSON.parse(jsonString);

    return {
      title: result.title || 'Generated Route',
      summary: result.summary || 'No detailed route description.',
      routePoints: result.routePoints || [],
    };
  } catch (error) {
    console.error('Error processing response:', error);
    throw new Error('Failed to process response from route generator.');
  }
}