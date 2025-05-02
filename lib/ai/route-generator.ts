'use client';

interface GenerateRouteParams {
  startPoint: string;
  routePriority: string;
  motorcycleType?: string;
  distance?: number;
  duration?: number;
}

// Define a type for the route result
export interface RouteGenerationResult {
  title: string;
  summary: string;
  routePoints: any;
}

export async function generateRoute(params: GenerateRouteParams): Promise<RouteGenerationResult> {
  try {
    // Prepare the prompt based on input parameters
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
      default:
        prompt += 'Create a balanced route with interesting roads. ';
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
    
    Include 5-10 waypoints with accurate coordinates in Poland. Make the route logical and interesting.`;

    // In a real implementation, this would call OpenRouter API
    // For POC, simulate API response with realistic mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock data based on the input parameters
    return generateMockRoute(params);
    
  } catch (error) {
    console.error('Error generating route:', error);
    throw new Error('Failed to generate route. Please try again.');
  }
}

// Function to generate realistic mock route data for POC
function generateMockRoute(params: GenerateRouteParams): RouteGenerationResult {
  // Map of major Polish cities with coordinates
  const polishCities: {[key: string]: {lat: number, lng: number}} = {
    'Warsaw': {lat: 52.2297, lng: 21.0122},
    'Krakow': {lat: 50.0647, lng: 19.9450},
    'Gdansk': {lat: 54.3520, lng: 18.6466},
    'Wroclaw': {lat: 51.1079, lng: 17.0385},
    'Poznan': {lat: 52.4064, lng: 16.9252},
    'Lodz': {lat: 51.7592, lng: 19.4560},
    'Zakopane': {lat: 49.2992, lng: 19.9496},
    'Lublin': {lat: 51.2465, lng: 22.5684},
    'Bialystok': {lat: 53.1325, lng: 23.1688},
    'Rzeszow': {lat: 50.0412, lng: 21.9991},
  };
  
  // Find coordinates for starting point (if it's a known city)
  const startingCoords = polishCities[params.startPoint] || 
    (Object.keys(polishCities).includes(params.startPoint) ? 
      polishCities[params.startPoint] : polishCities['Warsaw']);
  
  // Generate title based on priority
  let title = '';
  switch (params.routePriority) {
    case 'scenic':
      title = `Scenic Mountain Views: ${params.startPoint} Explorer`;
      break;
    case 'twisty':
      title = `Twisty Road Adventure from ${params.startPoint}`;
      break;
    case 'avoid_highways':
      title = `Hidden Backroads: ${params.startPoint} Country Tour`;
      break;
    default:
      title = `Discover Poland: ${params.startPoint} Journey`;
  }
  
  // Generate summary
  const distanceText = params.distance ? `${params.distance} km` : 
    params.duration ? `${params.duration * 90}-${params.duration * 110} km` : '150-200 km';
  
  let summary = '';
  switch (params.routePriority) {
    case 'scenic':
      summary = `This breathtaking route from ${params.startPoint} showcases the best scenic views Poland has to offer. Covering approximately ${distanceText}, you'll ride through picturesque landscapes, stunning mountain vistas, and charming villages. The route features well-maintained roads with plenty of opportunities to stop and enjoy the natural beauty.`;
      break;
    case 'twisty':
      summary = `Prepare for an exhilarating ride on this twisty route starting from ${params.startPoint}. This ${distanceText} journey offers a perfect combination of challenging curves, elevation changes, and smooth road surfaces ideal for enjoying the handling of your ${params.motorcycleType || 'motorcycle'}. The route includes some of Poland's most exciting motorcycle roads with minimal traffic.`;
      break;
    case 'avoid_highways':
      summary = `Experience authentic Poland on this countryside route from ${params.startPoint}. Covering ${distanceText}, this journey completely avoids major highways, taking you through peaceful rural areas, historic small towns, and scenic landscapes. Enjoy the relaxed pace and discover hidden gems off the beaten path.`;
      break;
    default:
      summary = `Explore the beauty of Poland on this diverse route starting in ${params.startPoint}. This balanced ${distanceText} journey combines scenic views, interesting road characteristics, and cultural points of interest. Perfect for a day trip, this route offers a true taste of Polish countryside and culture.`;
  }
  
  // Generate route points - these would normally come from the AI
  const routePoints = [
    {
      name: params.startPoint,
      description: `Starting point of our journey in ${params.startPoint}.`,
      coordinates: startingCoords
    }
  ];
  
  // Add waypoints based on priority type
  if (params.routePriority === 'scenic') {
    routePoints.push(
      {
        name: "Panorama Viewpoint",
        description: "Stunning panoramic vista overlooking the valley. Perfect spot for photos.",
        coordinates: {lat: startingCoords.lat + 0.15, lng: startingCoords.lng + 0.12}
      },
      {
        name: "Mountain Pass",
        description: "Beautiful mountain pass with sweeping views and good road surface.",
        coordinates: {lat: startingCoords.lat + 0.25, lng: startingCoords.lng + 0.18}
      },
      {
        name: "Lakeside Route",
        description: "Gorgeous road alongside a crystal-clear lake with mountains in the background.",
        coordinates: {lat: startingCoords.lat + 0.32, lng: startingCoords.lng + 0.08}
      },
      {
        name: "Forest Ride",
        description: "Peaceful ride through dense forest with sunlight filtering through the trees.",
        coordinates: {lat: startingCoords.lat + 0.4, lng: startingCoords.lng - 0.05}
      },
      {
        name: "Ancient Castle",
        description: "Historic castle on a hilltop offering exceptional views of the surrounding landscape.",
        coordinates: {lat: startingCoords.lat + 0.28, lng: startingCoords.lng - 0.15}
      },
      {
        name: "Traditional Village",
        description: "Charming Polish village with traditional architecture and a welcoming cafe.",
        coordinates: {lat: startingCoords.lat + 0.1, lng: startingCoords.lng - 0.25}
      }
    );
  } else if (params.routePriority === 'twisty') {
    routePoints.push(
      {
        name: "Hairpin Heaven",
        description: "Series of tight hairpin turns climbing up the hillside. Take care on the blind corners.",
        coordinates: {lat: startingCoords.lat + 0.12, lng: startingCoords.lng + 0.18}
      },
      {
        name: "Serpentine Road",
        description: "Beautiful snake-like road with perfect curves and excellent visibility.",
        coordinates: {lat: startingCoords.lat + 0.24, lng: startingCoords.lng + 0.28}
      },
      {
        name: "Rider's Ridge",
        description: "Fast-flowing curves with good camber along a scenic ridge. Popular with local motorcyclists.",
        coordinates: {lat: startingCoords.lat + 0.35, lng: startingCoords.lng + 0.22}
      },
      {
        name: "Technical Section",
        description: "Challenging sequence of tight corners requiring precise handling and line selection.",
        coordinates: {lat: startingCoords.lat + 0.42, lng: startingCoords.lng + 0.08}
      },
      {
        name: "Valley Descent",
        description: "Thrilling downhill section with sweeping curves and great visibility.",
        coordinates: {lat: startingCoords.lat + 0.3, lng: startingCoords.lng - 0.1}
      },
      {
        name: "Mountain Pass",
        description: "Legendary pass road with a perfect mix of tight and open corners.",
        coordinates: {lat: startingCoords.lat + 0.15, lng: startingCoords.lng - 0.2}
      }
    );
  } else if (params.routePriority === 'avoid_highways') {
    routePoints.push(
      {
        name: "Rural Backroad",
        description: "Quiet country road passing through farmlands and small settlements.",
        coordinates: {lat: startingCoords.lat + 0.1, lng: startingCoords.lng + 0.15}
      },
      {
        name: "Historic Village",
        description: "Charming village with cobblestone streets and a historic marketplace.",
        coordinates: {lat: startingCoords.lat + 0.22, lng: startingCoords.lng + 0.25}
      },
      {
        name: "Forest Trail",
        description: "Well-maintained road through a dense, peaceful forest.",
        coordinates: {lat: startingCoords.lat + 0.33, lng: startingCoords.lng + 0.2}
      },
      {
        name: "Riverside Route",
        description: "Scenic road following the curves of a river with minimal traffic.",
        coordinates: {lat: startingCoords.lat + 0.39, lng: startingCoords.lng + 0.05}
      },
      {
        name: "Countryside Inn",
        description: "Traditional Polish inn serving local specialties - perfect for a lunch break.",
        coordinates: {lat: startingCoords.lat + 0.32, lng: startingCoords.lng - 0.12}
      },
      {
        name: "Ancient Church",
        description: "12th-century church in a peaceful setting off the main tourist routes.",
        coordinates: {lat: startingCoords.lat + 0.18, lng: startingCoords.lng - 0.22}
      }
    );
  } else {
    routePoints.push(
      {
        name: "Scenic Overlook",
        description: "Beautiful viewpoint overlooking the valley below.",
        coordinates: {lat: startingCoords.lat + 0.13, lng: startingCoords.lng + 0.17}
      },
      {
        name: "Twisty Hill Section",
        description: "Fun sequence of curves climbing up the hillside.",
        coordinates: {lat: startingCoords.lat + 0.26, lng: startingCoords.lng + 0.24}
      },
      {
        name: "Historic Town",
        description: "Charming town with cobblestone streets and a beautiful market square.",
        coordinates: {lat: startingCoords.lat + 0.36, lng: startingCoords.lng + 0.18}
      },
      {
        name: "Lakeside Stop",
        description: "Peaceful lake with a small cafe perfect for a break.",
        coordinates: {lat: startingCoords.lat + 0.41, lng: startingCoords.lng + 0.04}
      },
      {
        name: "Forest Road",
        description: "Smooth road through dense, beautiful forest.",
        coordinates: {lat: startingCoords.lat + 0.35, lng: startingCoords.lng - 0.09}
      },
      {
        name: "Mountain View",
        description: "Spectacular view of the mountain range, worth a photo stop.",
        coordinates: {lat: startingCoords.lat + 0.21, lng: startingCoords.lng - 0.19}
      }
    );
  }
  
  return {
    title,
    summary,
    routePoints
  };
}