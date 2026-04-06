export type UserRole = "admin" | "user";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          role: UserRole;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name: string;
          id: string;
          role?: UserRole;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          role?: UserRole;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ✅ ADD THIS BLOCK
      cars: {
        Row: {
          id: number;
          name: string | null;
          category: string | null;
          type: string | null;
          price: number | null;
          year: number | null;
          mileage: number | null;
          fuel: string | null;
          transmission: string | null;
          image: string | null;
          badge: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          name?: string | null;
          category?: string | null;
          type?: string | null;
          price?: number | null;
          year?: number | null;
          mileage?: number | null;
          fuel?: string | null;
          transmission?: string | null;
          image?: string | null;
          badge?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          name?: string | null;
          category?: string | null;
          type?: string | null;
          price?: number | null;
          year?: number | null;
          mileage?: number | null;
          fuel?: string | null;
          transmission?: string | null;
          image?: string | null;
          badge?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};