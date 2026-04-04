const getRequiredEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const getAuthTokenSecret = () => getRequiredEnv("AUTH_TOKEN_SECRET");

export const getSupabaseAnonKey = () =>
  getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const getSupabaseServiceRoleKey = () =>
  getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

export const getSupabaseUrl = () => getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
