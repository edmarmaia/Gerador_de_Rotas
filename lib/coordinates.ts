export interface Coordinate {
  lat: number;
  lng: number;
}

export interface RoutePoint {
  type: 'address' | 'coordinate';
  value: string | Coordinate;
}

export function parseCoordinatesString(input: string): Coordinate[] {
  const coordinates: Coordinate[] = [];
  
  // Split by newlines, commas, or spaces
  const points = input.split(/[\n,\s]+/).filter(Boolean);
  
  for (let i = 0; i < points.length; i += 2) {
    const lat = parseFloat(points[i]);
    const lng = parseFloat(points[i + 1]);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        coordinates.push({ lat, lng });
      }
    }
  }
  
  return coordinates;
}

export function generateGoogleMapsLink(
  waypoints: Coordinate[], 
  startPoint?: RoutePoint, 
  endPoint?: RoutePoint,
  optimize: boolean = false
): string {
  if (waypoints.length === 0 && !startPoint && !endPoint) return '';
  
  const baseUrl = 'https://www.google.com/maps/dir/';
  const points: string[] = [];

  // Add start point
  if (startPoint) {
    points.push(startPoint.type === 'address' 
      ? encodeURIComponent(startPoint.value as string)
      : `${(startPoint.value as Coordinate).lat},${(startPoint.value as Coordinate).lng}`
    );
  }

  // Add waypoints
  points.push(...waypoints.map(coord => `${coord.lat},${coord.lng}`));

  // Add end point
  if (endPoint) {
    points.push(endPoint.type === 'address'
      ? encodeURIComponent(endPoint.value as string)
      : `${(endPoint.value as Coordinate).lat},${(endPoint.value as Coordinate).lng}`
    );
  }

  // Add optimization parameter
  let url = `${baseUrl}${points.join('/')}`;
  if (optimize && points.length > 2) {
    url += '/data=!4m2!4m1!3e0'; // Add parameters for route optimization
  }

  return url;
}