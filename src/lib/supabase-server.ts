import { createClient } from "@supabase/supabase-js";

import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/env";
import type { Database } from "@/types/database";

const serverClientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
};

export const getSupabaseServerClient = () =>
  createClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    serverClientOptions,
  );

export const getSupabaseServiceRoleClient = () =>
  createClient<Database>(
    getSupabaseUrl(),
    getSupabaseServiceRoleKey(),
    serverClientOptions,
  );
