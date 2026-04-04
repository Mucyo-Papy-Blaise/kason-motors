import { getSupabaseServiceRoleClient } from "../src/lib/supabase-server";
import type { Database } from "@/types/database";
import "dotenv/config";

const getRequiredEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const adminEmail = getRequiredEnv("SUPABASE_ADMIN_EMAIL");
const adminPassword = getRequiredEnv("SUPABASE_ADMIN_PASSWORD");
const adminFullName = getRequiredEnv("SUPABASE_ADMIN_FULL_NAME");

const seedAdmin = async () => {
  const supabase = getSupabaseServiceRoleClient();
  const { data: usersData, error: usersError } =
    await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

  if (usersError) {
    throw new Error(`Unable to list auth users: ${usersError.message}`);
  }

  let authUser = usersData.users.find((user: any) => user.email === adminEmail);

  if (!authUser) {
    const { data: createdUser, error: createError } =
      await supabase.auth.admin.createUser({
        email: adminEmail,
        email_confirm: true,
        password: adminPassword,
        user_metadata: {
          full_name: adminFullName,
        },
      });

    if (createError || !createdUser.user) {
      throw new Error(
        `Unable to create admin user: ${createError?.message ?? "Unknown error"}`,
      );
    }

    authUser = createdUser.user;
  } else {
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authUser.id,
      {
        email_confirm: true,
        password: adminPassword,
        user_metadata: {
          ...(authUser.user_metadata ?? {}),
          full_name: adminFullName,
        },
      },
    );

    if (updateError) {
      throw new Error(`Unable to update admin user: ${updateError.message}`);
    }
  }

  const profile: Database["public"]["Tables"]["profiles"]["Insert"] = {
    email: adminEmail,
    full_name: adminFullName,
    id: authUser.id,
    role: "admin",
  };

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(profile, { onConflict: "id" });

  if (profileError) {
    throw new Error(`Unable to upsert admin profile: ${profileError.message}`);
  }

  console.log(`Seeded admin account for ${adminEmail}`);
};

seedAdmin().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown seed failure";

  console.error(message);
  process.exit(1);
});
