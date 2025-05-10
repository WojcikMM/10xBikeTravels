/**
 * Utility functions for working with maps
 */

import { RoutePoint } from './ai/openrouter-service';

/**
 * Creates a Google Maps URL with all waypoints from the route
 * to allow opening the route directly in Google Maps
 */
export function createGoogleMapsUrl(routePoints: RoutePoint[]): string {
  if (!routePoints || routePoints.length < 2) {
    return '';
  }

  const startPoint = routePoints[0];
  const endPoint = routePoints[routePoints.length - 1];
  const waypoints = routePoints.slice(1, routePoints.length - 1);

  let url = 'https://www.google.com/maps/dir/?api=1';

  // Add origin (starting point)
  url += `&origin=${startPoint.coordinates.lat},${startPoint.coordinates.lng}`;
  
  // Add destination (end point)
  url += `&destination=${endPoint.coordinates.lat},${endPoint.coordinates.lng}`;
  
  // Add waypoints (intermediate points)
  if (waypoints.length > 0) {
    const waypointsString = waypoints
      .map(point => `${point.coordinates.lat},${point.coordinates.lng}`)
      .join('|');
    
    url += `&waypoints=${waypointsString}`;
  }
  
  // Set travel mode to driving as it's for motorcyclists
  url += '&travelmode=driving';
  
  return url;
}

/**
 * Creates a description of the route based on the number of waypoints and distance
 */
export function createRouteDescription(routePoints: RoutePoint[], distance?: number): string {
  if (!routePoints || routePoints.length < 2) {
    return 'Invalid route';
  }

  const pointCount = routePoints.length;
  const startPoint = routePoints[0].name;
  const endPoint = routePoints[pointCount - 1].name;

  let description = `Route from ${startPoint} to ${endPoint} with ${pointCount - 2} waypoints`;
  
  if (distance) {
    description += ` (approximately ${distance} km)`;
  }
  
  return description;
}
