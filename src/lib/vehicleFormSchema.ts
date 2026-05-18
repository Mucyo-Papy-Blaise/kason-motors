import { z } from "zod";

const currentYear = new Date().getFullYear();

export const vehicleFormSchema = z.object({
  title: z.string().min(5, "Title is required"),
  brand: z.string().min(1, "Please select a brand"),
  model: z.string().min(1, "Model is required"),
  year: z
    .string()
    .min(1, "Year is required")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 1900 && Number(value) <= currentYear + 1, {
      message: `Year must be between 1900 and ${currentYear + 1}`,
    }),
  condition: z.string().min(1, "Please select vehicle condition"),
  bodyType: z.string().min(1, "Please select body type"),
  mileage: z
    .string()
    .min(1, "Mileage is required")
    .refine((value) => !Number.isNaN(Number(value.replace(/,/g, ""))) && Number(value.replace(/,/g, "")) >= 0, {
      message: "Mileage must be a valid number",
    }),
  engineSize: z.string().min(1, "Engine size is required"),
  fuel: z.string().min(1, "Please select fuel type"),
  transmission: z.string().min(1, "Please select transmission"),
  driveType: z.string().min(1, "Please select drive type"),
  horsepower: z
    .string()
    .optional()
    .refine((value) => !value || (!Number.isNaN(Number(value)) && Number(value) > 0), {
      message: "Horsepower must be a valid number",
    }),
  range: z
    .string()
    .optional()
    .refine((value) => !value || (!Number.isNaN(Number(value)) && Number(value) > 0), {
      message: "Range must be a valid number greater than 0",
    }),
  exteriorColor: z.string().optional(),
  interiorColor: z.string().optional(),
  doors: z
    .string()
    .optional()
    .refine((value) => !value || (!Number.isNaN(Number(value)) && Number(value) > 0), {
      message: "Doors must be a valid number",
    }),
  seats: z
    .string()
    .optional()
    .refine((value) => !value || (!Number.isNaN(Number(value)) && Number(value) > 0), {
      message: "Seats must be a valid number",
    }),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, {
      message: "Price must be a valid number greater than 0",
    }),
  negotiable: z.boolean(),
  fullOption: z.boolean().default(false),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().min(1, "Please upload at least one vehicle image"),
  imageUrls: z.array(z.string()).min(1, "Please upload at least one vehicle image"),
  videoUrl: z.string().optional(),
  features: z.array(z.string()).optional(),
  badge: z.string().optional(),
});

export type VehicleFormData = z.infer<typeof vehicleFormSchema>;
