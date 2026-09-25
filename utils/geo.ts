/** Geographic helpers for parcel boundaries (GeoJSON uses [longitude, latitude] order). */

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

// Approximate centres of districts, used when the device location is unavailable.
const DISTRICT_CENTRES: Record<string, [number, number]> = {
  Gasabo: [-1.9380, 30.1100],
  Kicukiro: [-1.9900, 30.1000],
  Nyarugenge: [-1.9500, 30.0600],
  Musanze: [-1.4990, 29.6340],
  Huye: [-2.5960, 29.7390],
  Rubavu: [-1.6800, 29.2600],
  Rusizi: [-2.4840, 28.9070],
  Nyagatare: [-1.2950, 30.3270],
  Bugesera: [-2.2100, 30.1500],
  Rwamagana: [-1.9490, 30.4350],
  Muhanga: [-2.0850, 29.7560],
};

/** Square boundary of the given area (in m²) centred on a point. */
export function squareAround(lat: number, lng: number, areaSqm: number): GeoPolygon {
  const side = Math.sqrt(Math.max(areaSqm, 1));
  const dLat = side / 2 / 111320;
  const dLng = side / 2 / (111320 * Math.cos((lat * Math.PI) / 180));
  const ring = [
    [lng - dLng, lat + dLat],
    [lng + dLng, lat + dLat],
    [lng + dLng, lat - dLat],
    [lng - dLng, lat - dLat],
    [lng - dLng, lat + dLat],
  ];
  return { type: 'Polygon', coordinates: [ring] };
}

export function districtCentre(district?: string): [number, number] {
  return (district && DISTRICT_CENTRES[district]) || [-1.9441, 30.0619];
}

/** Parses a stored GeoJSON polygon into map coordinates ({ latitude, longitude }[]). */
export function toMapCoordinates(value: unknown): { latitude: number; longitude: number }[] {
  try {
    const geo = typeof value === 'string' ? JSON.parse(value) : value;
    const ring: number[][] | undefined = geo?.coordinates?.[0];
    if (!ring || ring.length < 3) return [];
    return ring.map(([lng, lat]) => ({ latitude: lat, longitude: lng }));
  } catch {
    return [];
  }
}
