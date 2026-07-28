import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchCompetitorPricesDto } from './dto/search-competitor-prices.dto';

type NullableNumber = number | null;

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface SerpApiRate {
  lowest?: string;
  extracted_lowest?: number;
  before_taxes_fees?: string;
  extracted_before_taxes_fees?: number;
}

interface SerpApiPriceSource {
  source?: string;
  link?: string;
  logo?: string;
  rate_per_night?: SerpApiRate;
  total_rate?: SerpApiRate;
}

interface SerpApiProperty {
  type?: string;
  name?: string;
  description?: string;
  address?: string;
  gps_coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  rate_per_night?: SerpApiRate;
  total_rate?: SerpApiRate;
  prices?: SerpApiPriceSource[];
  overall_rating?: number;
  reviews?: number;
  hotel_class?: string;
  extracted_hotel_class?: number;
  amenities?: string[];
  images?: Array<{
    thumbnail?: string;
    original_image?: string;
  }>;
  property_token?: string;
}

interface SerpApiPropertyDetails extends SerpApiProperty {
  error?: string;
  link?: string;
  directions?: string;
  phone?: string;
  phone_link?: string;
  check_in_time?: string;
  check_out_time?: string;
  featured_prices?: SerpApiPriceSource[];
  typical_price_range?: {
    lowest?: string;
    highest?: string;
    extracted_lowest?: number;
    extracted_highest?: number;
  };
}

interface SerpApiResponse {
  search_metadata?: {
    id?: string;
    status?: string;
    total_time_taken?: {
      float?: number;
    };
  };
  properties?: SerpApiProperty[];
  serpapi_pagination?: {
    current_from?: number;
    current_to?: number;
    next_page_token?: string;
    next?: string;
  };
  error?: string;
}

interface NormalizedHotelProperty {
  name: string;
  type: string | null;
  description: string | null;
  address: string | null;
  gpsCoordinates: Coordinates | null;
  ratePerNight: {
    lowest: string | null;
    extractedLowest: NullableNumber;
    beforeTaxesFees: string | null;
    extractedBeforeTaxesFees: NullableNumber;
  };
  totalRate: {
    lowest: string | null;
    extractedLowest: NullableNumber;
  };
  priceValue: NullableNumber;
  priceLabel: string | null;
  priceDelta: NullableNumber;
  priceDeltaPercent: NullableNumber;
  prices: Array<{
    source: string;
    link: string | null;
    logo: string | null;
    lowest: string | null;
    extractedLowest: NullableNumber;
    totalLowest: string | null;
    extractedTotalLowest: NullableNumber;
  }>;
  overallRating: NullableNumber;
  reviews: number | null;
  hotelClass: string | null;
  extractedHotelClass: number | null;
  amenities: string[];
  thumbnail: string | null;
  propertyToken: string | null;
  mapUrl: string;
  link: string | null;
  phone: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  typicalPriceRange: {
    lowest: string | null;
    highest: string | null;
    extractedLowest: NullableNumber;
    extractedHighest: NullableNumber;
  } | null;
  isOwnHotel: boolean;
  distanceKm: NullableNumber;
  detailFetched: boolean;
}

const DEFAULT_QUERY = 'hotels near Halong Marina Bayzone Hung Thang Bai Chay';
const TARGET_HOTEL_NAME = 'Anstay Residence by A La Carte Hạ Long';
const TARGET_HOTEL_ADDRESS =
  'Khu đô thị dịch vụ Hùng Thắng, P. Hùng Thắng, Hạ Long, Quảng Ninh, Việt Nam';
const TARGET_HOTEL_MAP_URL = 'https://maps.app.goo.gl/m7c3NiYsydvmaTBd8';
const TARGET_HOTEL_COORDINATES: Coordinates = {
  latitude: 20.9533227,
  longitude: 107.0027267,
};
const DEFAULT_RADIUS_KM = 3;
const DEFAULT_MAX_PAGES = 10;
const DEFAULT_DETAIL_LIMIT = 30;

@Injectable()
export class CompetitorPricesService {
  private readonly serpApiUrl = 'https://serpapi.com/search';

  constructor(private readonly configService: ConfigService) {}

  async searchHotels(dto: SearchCompetitorPricesDto) {
    const apiKey = this.configService.get<string>('SERPAPI_API_KEY');
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'SERPAPI_API_KEY is not configured',
      );
    }

    this.assertValidDateRange(dto.checkInDate, dto.checkOutDate);

    const params = this.createSearchParams(dto, apiKey);
    const pagedResults = await this.fetchHotelPages(
      params,
      apiKey,
      this.getMaxPages(),
    );

    const radiusKm = dto.radiusKm ?? DEFAULT_RADIUS_KM;
    const normalized = this.normalizeProperties(
      this.dedupeProperties(pagedResults.properties),
    );
    const initialOwnHotel =
      normalized.find((property) => property.isOwnHotel) || null;
    const centerCoordinates =
      initialOwnHotel?.gpsCoordinates || TARGET_HOTEL_COORDINATES;
    const withDistance = normalized.map((property) =>
      this.applyDistance(property, centerCoordinates),
    );
    const nearbyProperties = withDistance.filter(
      (property) =>
        property.isOwnHotel ||
        (property.distanceKm !== null && property.distanceKm <= radiusKm),
    );
    const detailLimit = this.getDetailLimit(dto.detailLimit);
    const detailedProperties = await this.enrichPropertiesWithDetails(
      nearbyProperties,
      params,
      apiKey,
      detailLimit,
    );
    const ownHotel =
      detailedProperties.find((property) => property.isOwnHotel) ||
      (initialOwnHotel
        ? this.applyDistance(initialOwnHotel, centerCoordinates)
        : null);
    const targetPrice =
      ownHotel?.priceValue ?? dto.targetPrice ?? null;
    const withDeltas = detailedProperties.map((property) =>
      this.applyPriceDelta(property, targetPrice),
    );
    const limitedProperties =
      typeof dto.limit === 'number' ? withDeltas.slice(0, dto.limit) : withDeltas;
    const competitors = limitedProperties.filter(
      (property) => !property.isOwnHotel,
    );

    return {
      targetHotel: {
        name: TARGET_HOTEL_NAME,
        address: TARGET_HOTEL_ADDRESS,
        mapUrl: TARGET_HOTEL_MAP_URL,
        gpsCoordinates: TARGET_HOTEL_COORDINATES,
        matchedProperty: ownHotel
          ? this.applyPriceDelta(ownHotel, targetPrice)
          : null,
      },
      search: {
        query: dto.query?.trim() || DEFAULT_QUERY,
        checkInDate: dto.checkInDate,
        checkOutDate: dto.checkOutDate,
        adults: dto.adults ?? 2,
        currency: (dto.currency || 'VND').toUpperCase(),
        sortBy: dto.sortBy || 'relevance',
        radiusKm,
        targetPrice,
      },
      summary: this.createSummary(limitedProperties, competitors, targetPrice),
      properties: limitedProperties,
      competitors,
      filter: {
        center: centerCoordinates,
        radiusKm,
        rawResultCount: pagedResults.rawResultCount,
        uniqueRawResultCount: normalized.length,
        filteredOutCount: Math.max(normalized.length - detailedProperties.length, 0),
      },
      metadata: {
        searchId: pagedResults.searchId,
        status: pagedResults.status,
        totalTimeTaken: pagedResults.totalTimeTaken,
        pagesFetched: pagedResults.pagesFetched,
        maxPages: pagedResults.maxPages,
        paginationExhausted: pagedResults.paginationExhausted,
        detailsFetched: detailedProperties.filter(
          (property) => property.detailFetched,
        ).length,
        detailLimit,
      },
    };
  }

  private createSearchParams(dto: SearchCompetitorPricesDto, apiKey: string) {
    const params = new URLSearchParams({
      engine: 'google_hotels',
      q: dto.query?.trim() || DEFAULT_QUERY,
      gl: 'vn',
      hl: 'vi',
      currency: (dto.currency || 'VND').toUpperCase(),
      check_in_date: dto.checkInDate,
      check_out_date: dto.checkOutDate,
      adults: String(dto.adults ?? 2),
      api_key: apiKey,
      output: 'json',
    });

    if (dto.sortBy && dto.sortBy !== 'relevance') {
      params.set('sort_by', dto.sortBy);
    }

    return params;
  }

  private async fetchHotelPages(
    baseParams: URLSearchParams,
    apiKey: string,
    maxPages: number,
  ) {
    const properties: SerpApiProperty[] = [];
    let page = 0;
    let nextPageToken: string | undefined;
    let searchId: string | null = null;
    let status: string | null = null;
    let totalTimeTaken = 0;
    let paginationExhausted = false;

    do {
      const params = new URLSearchParams(baseParams);
      if (nextPageToken) {
        params.set('next_page_token', nextPageToken);
      }

      const response = await fetch(`${this.serpApiUrl}?${params.toString()}`);
      const rawText = await response.text();
      const data = this.parseSerpApiResponse(rawText, apiKey);

      if (!response.ok || data.error) {
        throw new BadRequestException(
          this.sanitizeError(data.error || rawText, apiKey),
        );
      }

      page += 1;
      searchId = data.search_metadata?.id || searchId;
      status = data.search_metadata?.status || status;
      totalTimeTaken += data.search_metadata?.total_time_taken?.float || 0;
      properties.push(...(data.properties || []));
      nextPageToken = data.serpapi_pagination?.next_page_token;

      if (!nextPageToken) {
        paginationExhausted = true;
      }
    } while (nextPageToken && page < maxPages);

    return {
      properties,
      rawResultCount: properties.length,
      searchId,
      status,
      totalTimeTaken: Math.round(totalTimeTaken * 100) / 100,
      pagesFetched: page,
      maxPages,
      paginationExhausted,
    };
  }

  private getMaxPages() {
    const configured = Number(
      this.configService.get<string>('SERPAPI_MAX_HOTEL_PAGES'),
    );

    if (Number.isFinite(configured) && configured >= 1) {
      return Math.min(Math.floor(configured), 25);
    }

    return DEFAULT_MAX_PAGES;
  }

  private getDetailLimit(requested?: number) {
    if (typeof requested === 'number' && Number.isFinite(requested)) {
      return Math.min(Math.max(Math.floor(requested), 0), 200);
    }

    const configured = Number(
      this.configService.get<string>('SERPAPI_DETAIL_LIMIT'),
    );

    if (Number.isFinite(configured) && configured >= 0) {
      return Math.min(Math.floor(configured), 200);
    }

    return DEFAULT_DETAIL_LIMIT;
  }

  private assertValidDateRange(checkInDate: string, checkOutDate: string) {
    const checkIn = this.parseDateOnly(checkInDate);
    const checkOut = this.parseDateOnly(checkOutDate);

    if (checkOut.getTime() <= checkIn.getTime()) {
      throw new BadRequestException(
        'Ngày check-out phải sau ngày check-in',
      );
    }
  }

  private parseDateOnly(date: string) {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  private parseSerpApiResponse(rawText: string, apiKey: string): SerpApiResponse {
    try {
      return JSON.parse(rawText) as SerpApiResponse;
    } catch {
      throw new BadRequestException(this.sanitizeError(rawText, apiKey));
    }
  }

  private normalizeProperties(
    properties: SerpApiProperty[],
  ): NormalizedHotelProperty[] {
    return properties.map((property) => {
      const priceValue =
        property.rate_per_night?.extracted_lowest ??
        property.total_rate?.extracted_lowest ??
        null;
      const priceLabel =
        property.rate_per_night?.lowest ?? property.total_rate?.lowest ?? null;
      const gpsCoordinates =
        typeof property.gps_coordinates?.latitude === 'number' &&
        typeof property.gps_coordinates?.longitude === 'number'
          ? {
              latitude: property.gps_coordinates.latitude,
              longitude: property.gps_coordinates.longitude,
            }
          : null;

      return {
        name: property.name || 'Không rõ tên',
        type: property.type || null,
        description: property.description || null,
        address: property.address || null,
        gpsCoordinates,
        ratePerNight: {
          lowest: property.rate_per_night?.lowest || null,
          extractedLowest: property.rate_per_night?.extracted_lowest ?? null,
          beforeTaxesFees: property.rate_per_night?.before_taxes_fees || null,
          extractedBeforeTaxesFees:
            property.rate_per_night?.extracted_before_taxes_fees ?? null,
        },
        totalRate: {
          lowest: property.total_rate?.lowest || null,
          extractedLowest: property.total_rate?.extracted_lowest ?? null,
        },
        priceValue,
        priceLabel,
        priceDelta: null,
        priceDeltaPercent: null,
        prices: this.normalizePriceSources(property.prices || []),
        overallRating: property.overall_rating ?? null,
        reviews: property.reviews ?? null,
        hotelClass: property.hotel_class || null,
        extractedHotelClass: property.extracted_hotel_class ?? null,
        amenities: property.amenities || [],
        thumbnail:
          property.images?.[0]?.thumbnail ||
          property.images?.[0]?.original_image ||
          null,
        propertyToken: property.property_token || null,
        mapUrl: this.createMapUrl(property.name, gpsCoordinates),
        link: null,
        phone: null,
        checkInTime: null,
        checkOutTime: null,
        typicalPriceRange: null,
        isOwnHotel: this.isOwnHotel(property.name || ''),
        distanceKm: null,
        detailFetched: false,
      };
    });
  }

  private async enrichPropertiesWithDetails(
    properties: NormalizedHotelProperty[],
    baseParams: URLSearchParams,
    apiKey: string,
    detailLimit: number,
  ): Promise<NormalizedHotelProperty[]> {
    if (detailLimit <= 0) {
      return properties;
    }

    let remaining = detailLimit;
    const enriched: NormalizedHotelProperty[] = [];

    for (const property of properties) {
      if (!this.shouldFetchPropertyDetails(property) || remaining <= 0) {
        enriched.push(property);
        continue;
      }

      remaining -= 1;
      const details = await this.fetchHotelDetails(
        baseParams,
        apiKey,
        property.propertyToken!,
      );
      enriched.push(details ? this.mergePropertyDetails(property, details) : property);
    }

    return enriched;
  }

  private shouldFetchPropertyDetails(property: NormalizedHotelProperty) {
    if (!property.propertyToken) {
      return false;
    }

    return (
      property.isOwnHotel ||
      property.priceValue === null ||
      property.prices.length === 0
    );
  }

  private async fetchHotelDetails(
    baseParams: URLSearchParams,
    apiKey: string,
    propertyToken: string,
  ): Promise<SerpApiPropertyDetails | null> {
    const params = new URLSearchParams(baseParams);
    params.set('property_token', propertyToken);

    const response = await fetch(`${this.serpApiUrl}?${params.toString()}`);
    const rawText = await response.text();
    const data = this.parseSerpApiResponse(rawText, apiKey) as SerpApiPropertyDetails;

    if (!response.ok || data.error) {
      return null;
    }

    return data;
  }

  private mergePropertyDetails(
    property: NormalizedHotelProperty,
    details: SerpApiPropertyDetails,
  ): NormalizedHotelProperty {
    const detailPriceSources = this.normalizePriceSources([
      ...(details.featured_prices || []),
      ...(details.prices || []),
    ]);
    const lowestDetailSource = this.findLowestPriceSource(detailPriceSources);
    const detailPriceValue =
      details.rate_per_night?.extracted_lowest ??
      lowestDetailSource?.extractedLowest ??
      null;
    const detailPriceLabel =
      details.rate_per_night?.lowest ?? lowestDetailSource?.lowest ?? null;

    return {
      ...property,
      description: property.description || details.description || null,
      address: property.address || details.address || null,
      gpsCoordinates: property.gpsCoordinates ||
        (typeof details.gps_coordinates?.latitude === 'number' &&
        typeof details.gps_coordinates?.longitude === 'number'
          ? {
              latitude: details.gps_coordinates.latitude,
              longitude: details.gps_coordinates.longitude,
            }
          : null),
      ratePerNight: {
        lowest:
          property.ratePerNight.lowest ||
          details.rate_per_night?.lowest ||
          lowestDetailSource?.lowest ||
          null,
        extractedLowest:
          property.ratePerNight.extractedLowest ??
          details.rate_per_night?.extracted_lowest ??
          lowestDetailSource?.extractedLowest ??
          null,
        beforeTaxesFees:
          property.ratePerNight.beforeTaxesFees ||
          details.rate_per_night?.before_taxes_fees ||
          null,
        extractedBeforeTaxesFees:
          property.ratePerNight.extractedBeforeTaxesFees ??
          details.rate_per_night?.extracted_before_taxes_fees ??
          null,
      },
      totalRate: {
        lowest: property.totalRate.lowest || details.total_rate?.lowest || null,
        extractedLowest:
          property.totalRate.extractedLowest ??
          details.total_rate?.extracted_lowest ??
          null,
      },
      priceValue: property.priceValue ?? detailPriceValue,
      priceLabel: property.priceLabel || detailPriceLabel,
      prices: detailPriceSources.length ? detailPriceSources : property.prices,
      overallRating: property.overallRating ?? details.overall_rating ?? null,
      reviews: property.reviews ?? details.reviews ?? null,
      amenities: property.amenities.length ? property.amenities : details.amenities || [],
      thumbnail:
        property.thumbnail ||
        details.images?.[0]?.thumbnail ||
        details.images?.[0]?.original_image ||
        null,
      link: property.link || details.link || null,
      phone: property.phone || details.phone || null,
      checkInTime: property.checkInTime || details.check_in_time || null,
      checkOutTime: property.checkOutTime || details.check_out_time || null,
      typicalPriceRange: details.typical_price_range
        ? {
            lowest: details.typical_price_range.lowest || null,
            highest: details.typical_price_range.highest || null,
            extractedLowest:
              details.typical_price_range.extracted_lowest ?? null,
            extractedHighest:
              details.typical_price_range.extracted_highest ?? null,
          }
        : property.typicalPriceRange,
      detailFetched: true,
    };
  }

  private normalizePriceSources(prices: SerpApiPriceSource[]) {
    return prices.map((price) => ({
      source: price.source || 'Không rõ nguồn',
      link: price.link || null,
      logo: price.logo || null,
      lowest: price.rate_per_night?.lowest || null,
      extractedLowest: price.rate_per_night?.extracted_lowest ?? null,
      totalLowest: price.total_rate?.lowest || null,
      extractedTotalLowest: price.total_rate?.extracted_lowest ?? null,
    }));
  }

  private findLowestPriceSource(
    prices: NormalizedHotelProperty['prices'],
  ) {
    const pricedSources = prices.filter(
      (price) => typeof price.extractedLowest === 'number',
    );

    if (!pricedSources.length) {
      return null;
    }

    return pricedSources.reduce((lowest, current) =>
      (current.extractedLowest || 0) < (lowest.extractedLowest || 0)
        ? current
        : lowest,
    );
  }

  private dedupeProperties(properties: SerpApiProperty[]) {
    const seen = new Set<string>();
    const deduped: SerpApiProperty[] = [];

    properties.forEach((property) => {
      const key =
        property.property_token ||
        [
          this.normalizeText(property.name || ''),
          property.gps_coordinates?.latitude || '',
          property.gps_coordinates?.longitude || '',
        ].join('|');

      if (!key || seen.has(key)) {
        return;
      }

      seen.add(key);
      deduped.push(property);
    });

    return deduped;
  }

  private applyDistance(
    property: NormalizedHotelProperty,
    center: Coordinates,
  ): NormalizedHotelProperty {
    return {
      ...property,
      distanceKm: property.gpsCoordinates
        ? Math.round(
            this.calculateDistanceKm(center, property.gpsCoordinates) * 10,
          ) / 10
        : null,
    };
  }

  private applyPriceDelta(
    property: NormalizedHotelProperty,
    targetPrice: NullableNumber,
  ): NormalizedHotelProperty {
    if (targetPrice === null || property.priceValue === null || targetPrice <= 0) {
      return property;
    }

    const priceDelta = property.priceValue - targetPrice;
    return {
      ...property,
      priceDelta,
      priceDeltaPercent: Math.round((priceDelta / targetPrice) * 1000) / 10,
    };
  }

  private createSummary(
    properties: NormalizedHotelProperty[],
    competitors: NormalizedHotelProperty[],
    targetPrice: NullableNumber,
  ) {
    const prices = competitors
      .map((property) => property.priceValue)
      .filter((price): price is number => typeof price === 'number');
    const lowestPrice = prices.length ? Math.min(...prices) : null;
    const highestPrice = prices.length ? Math.max(...prices) : null;
    const averagePrice = prices.length
      ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
      : null;

    return {
      resultCount: properties.length,
      competitorCount: competitors.length,
      targetPrice,
      lowestCompetitorPrice: lowestPrice,
      highestCompetitorPrice: highestPrice,
      averageCompetitorPrice: averagePrice,
      cheaperCompetitors:
        targetPrice === null
          ? null
          : competitors.filter(
              (property) =>
                typeof property.priceValue === 'number' &&
                property.priceValue < targetPrice,
            ).length,
    };
  }

  private createMapUrl(
    name: string | undefined,
    coordinates: Coordinates | null,
  ) {
    if (coordinates) {
      return `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      name || DEFAULT_QUERY,
    )}`;
  }

  private isOwnHotel(name: string) {
    const normalized = this.normalizeText(name);
    return (
      normalized.includes('anstayresidence') ||
      normalized.includes('alacartehalongbaymanagedbyanstay') ||
      normalized.includes('alacartehalongbayapartmentmanagedbyanstay')
    );
  }

  private normalizeText(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  private calculateDistanceKm(from: Coordinates, to: Coordinates) {
    const earthRadiusKm = 6371;
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const deltaLat = toRadians(to.latitude - from.latitude);
    const deltaLng = toRadians(to.longitude - from.longitude);
    const fromLat = toRadians(from.latitude);
    const toLat = toRadians(to.latitude);
    const haversine =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(fromLat) *
        Math.cos(toLat) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);

    return (
      2 *
      earthRadiusKm *
      Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
    );
  }

  private sanitizeError(message: string, apiKey: string) {
    const sanitized = message.split(apiKey).join('[redacted]');
    return sanitized.slice(0, 500) || 'SerpApi request failed';
  }
}
