export type Car = {
  id: number;
  title: string;
  brand: string;
  model: string;
  condition: string;
  bodyType: string;
  driveType: string;
  engineSize: string;
  horsepower: string | number;
  range: string | number;
  exteriorColor: string;
  interiorColor: string;
  doors: string | number;
  seats: string | number;
  negotiable: boolean;
  fullOption: boolean; // ← NEW: whether the car has all options/features
  full_option?: boolean;
  description: string;
  videoUrl: string;
  features: string[];
  imageUrls: string[];
  image_urls?: string[];
  name: string;
  category: string;
  type: string;
  price: string | number;
  year: string | number;
  mileage: string | number;
  fuel: string;
  transmission: string;
  image: string;
  badge: string;
};

export const EMPTY_FORM = {
  title: "",
  brand: "",
  model: "",
  condition: "",
  bodyType: "",
  driveType: "",
  engineSize: "",
  horsepower: "",
  range: "",
  exteriorColor: "",
  interiorColor: "",
  doors: "",
  seats: "",
  negotiable: false,
  fullOption: false, // ← NEW: default is OFF
  description: "",
  videoUrl: "",
  features: [] as string[],
  imageUrls: [] as string[],
  name: "",
  category: "",
  type: "",
  price: "",
  year: "",
  mileage: "",
  fuel: "",
  transmission: "",
  image: "",
  badge: "",
};

export type FormErrors = Partial<Record<keyof typeof EMPTY_FORM, string>>;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export function normalizeCarImages(
  image?: string | null,
  imageUrls?: string[] | null
) {
  const normalizedArray = Array.isArray(imageUrls)
    ? imageUrls.filter(isNonEmptyString)
    : [];

  if (normalizedArray.length > 0) {
    return normalizedArray;
  }

  return isNonEmptyString(image) ? [image] : [];
}

export type CarType = 'Mini' | 'Standard' | 'Compact' | 'Economy' | 'Van' | 'Pickup' | 'Other';

export interface CarMock {
  id: string;
  name: string;
  model: string;
  type: CarType;
  passengers: number;
  isElectric: boolean;
  unlimitedMileage: boolean;
  pricePerDay: number;
  isSpecialDeal?: boolean;
  imageUrl: string;
}

export interface FilterState {
  carTypes: CarType[];
  capacity: '2-5' | '6+' | 'all';
  maxDailyPrice: number;
}
