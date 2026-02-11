export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
  cidade?: string;
  pais?: string;
}

export interface GeocodingService {
  geocode(address: string): Promise<GeocodingResult | null>;
}
