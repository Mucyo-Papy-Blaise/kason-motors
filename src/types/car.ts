
export type Car = {
  id: number;
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