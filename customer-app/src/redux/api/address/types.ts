export interface Address {
  id: string;
  label?: string | null;
  houseFlat?: string | null;
  areaStreet: string;
  line: string;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
  createdAt: string;
}

export interface AddressInput {
  label?: string;
  houseFlat?: string;
  areaStreet: string;
  city?: string;
  state?: string;
  postalCode?: string;
  // Optional — the customer isn't necessarily at this address when adding it.
  // The backend best-effort geocodes from postalCode/city/state when omitted.
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}
