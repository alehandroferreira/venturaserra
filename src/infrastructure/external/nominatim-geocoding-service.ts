import { GeocodingService, GeocodingResult } from '@application/ports/geocoding-service';
import { Logger } from '@application/ports/logger';
import { ExternalServiceError } from '@domain/errors';

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
  };
}

export class NominatimGeocodingService implements GeocodingService {
  private readonly cache = new Map<string, GeocodingResult>();
  private readonly baseUrl = 'https://nominatim.openstreetmap.org/search';
  private readonly userAgent: string;
  private readonly cacheTTL: number;

  constructor(
    private readonly logger: Logger,
    userAgent: string = 'RastreamentoCargas/1.0',
    cacheTTL: number = 3600000, // 1 hora em ms
  ) {
    this.userAgent = userAgent;
    this.cacheTTL = cacheTTL;
  }

  async geocode(address: string): Promise<GeocodingResult | null> {
    // Verifica cache
    const cached = this.cache.get(address);
    if (cached) {
      this.logger.debug('Geocoding: usando resultado do cache', { address });
      return cached;
    }

    try {
      this.logger.debug('Geocoding: consultando Nominatim', { address });

      const url = new URL(this.baseUrl);
      url.searchParams.append('q', address);
      url.searchParams.append('format', 'json');
      url.searchParams.append('limit', '1');
      url.searchParams.append('addressdetails', '1');

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': this.userAgent,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as NominatimResponse[];

      if (!data || data.length === 0) {
        this.logger.warn('Geocoding: nenhum resultado encontrado', { address });
        return null;
      }

      const result = data[0];
      const geocodingResult: GeocodingResult = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
        cidade: result.address?.city || result.address?.town || result.address?.village,
        pais: result.address?.country,
      };

      // Armazena no cache
      this.cache.set(address, geocodingResult);

      // Remove do cache após TTL
      setTimeout(() => {
        this.cache.delete(address);
      }, this.cacheTTL);

      this.logger.info('Geocoding bem-sucedido', {
        address,
        lat: geocodingResult.lat,
        lng: geocodingResult.lng,
      });

      return geocodingResult;
    } catch (error) {
      this.logger.error('Erro ao geocodificar endereço', error as Error, { address });
      throw new ExternalServiceError('Nominatim', (error as Error).message);
    }
  }
}
