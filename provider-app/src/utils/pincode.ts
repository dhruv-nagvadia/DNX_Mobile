/**
 * City (district) + state for an exact 6-digit Indian PIN code, from India
 * Post's free, keyless directory — same source as the web app's
 * `frontend/src/utils/geoLookup.ts`. Returns null on any failure.
 */
const POSTAL_BASE = 'https://api.postalpincode.in';

interface RawPostOfficeResponse {
  Status?: string;
  PostOffice?: { District?: string; State?: string }[];
}

export async function lookupPincode(pincode: string): Promise<{ city: string; state: string } | null> {
  if (!/^\d{6}$/.test(pincode)) {
    return null;
  }
  try {
    const res = await fetch(`${POSTAL_BASE}/pincode/${pincode}`);
    if (!res.ok) {
      return null;
    }
    const json: unknown = await res.json();
    const first = Array.isArray(json) ? (json[0] as RawPostOfficeResponse) : null;
    const office = first?.Status === 'Success' ? first.PostOffice?.[0] : undefined;
    if (!office?.District || !office.State) {
      return null;
    }
    return { city: office.District, state: office.State };
  } catch {
    return null;
  }
}
