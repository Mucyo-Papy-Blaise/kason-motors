// 📁 types/database.types.ts

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

      book_test_driver: {
        Row: {
          id: number;
          car_id: number;
          full_name: string;
          email: string;
          phone: string;
          preferred_date: string;
          notes: string | null;
          created_at: string;
          read: boolean;
        };
        Insert: {
          id?: number;
          car_id: number;
          full_name: string;
          email: string;
          phone: string;
          preferred_date: string;
          notes?: string | null;
          created_at?: string;
          read?: boolean;
        };
        Update: {
          id?: number;
          car_id?: number;
          full_name?: string;
          email?: string;
          phone?: string;
          preferred_date?: string;
          notes?: string | null;
          created_at?: string;
          read?: boolean;
        };
        Relationships: [];
      };

      // ✅ CONTACT / MESSAGES TABLE (phonenumber added)
      messages: {
        Row: {
          id: number;
          name: string;
          email: string;
          phonenumber: string | null;
          message: string;
          created_at: string;
          read: boolean;
        };
        Insert: {
          id?: number;
          name: string;
          email: string;
          phonenumber?: string | null;
          message: string;
          created_at?: string;
          read: boolean;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          phonenumber?: string | null;
          message?: string;
          created_at?: string;
          read?: boolean;
        };
        Relationships: [];
      };

      // ✅ TESTIMONIALS TABLE (no rating, no avatar)
      testimonials: {
        Row: {
          id: number;
          name: string;
          role: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          role: string;
          text: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          role?: string;
          text?: string;
          created_at?: string;
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