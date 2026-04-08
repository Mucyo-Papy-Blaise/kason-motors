/**
 * Shared session cache for `/api/vehicles/getList` — same key as inventory page
 * so landing + inventory reuse one payload within the TTL.
 */
export const VEHICLE_LIST_CACHE_KEY = "inventory-cars-cache-v1";
export const VEHICLE_LIST_CACHE_TTL_MS = 5 * 60 * 1000;

type Payload<T> = {
  data: T[];
  cachedAt: number;
};

export function readVehicleListCache<T>(): T[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(VEHICLE_LIST_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Payload<T>;
    if (!Array.isArray(parsed.data)) return null;
    if (Date.now() - parsed.cachedAt >= VEHICLE_LIST_CACHE_TTL_MS) {
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function writeVehicleListCache<T>(data: T[]): void {
  if (typeof window === "undefined") return;
  try {
    const payload: Payload<T> = { data, cachedAt: Date.now() };
    sessionStorage.setItem(VEHICLE_LIST_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Quota or private mode — ignore.
  }
}
