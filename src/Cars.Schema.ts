import {z} from 'zod'
export  const carSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  price: z.string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && val.trim() !== "", {
      message: "Price must be a number",
    }),
  year: z.string()
    .min(1, "Year is required")
    .refine((val) => !isNaN(Number(val)) && val.trim() !== "", {
      message: "Year must be a number",
    }),
  mileage: z.string()
    .min(1, "Mileage is required")
    .refine((val) => !isNaN(Number(val)) && val.trim() !== "", {
      message: "Mileage must be a number",
    }),
  fuel: z.string().min(1, "Fuel is required"),
  transmission: z.string().min(1, "Transmission is required"),
  image: z.string().optional(),
  badge: z.string().optional(),
});