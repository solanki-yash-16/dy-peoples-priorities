import { apiClient } from '../lib/api-client';

export interface LocationDetails {
  address: string;
  village: string;
  district: string;
  state: string;
  country: string;
}

export const locationService = {
  async reverseGeocode(lat: number, lng: number): Promise<LocationDetails> {
    const response = await apiClient.get<{ status: string; data: LocationDetails }>(
      `/v1/location/reverse-geocode?lat=${lat}&lng=${lng}`
    );
    return response.data.data;
  }
};
