import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncAuthUsersToAllowed() {
  try {
    console.log("Fetching authenticated users from auth.users...");

    const { data: authData, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError) throw authError;

    const authUsers = authData.users;
    if (!authUsers || authUsers.length === 0) {
      console.log("No authenticated users found.");
      return;
    }

    const formattedRecords = authUsers.map((user) => {
      const meta = user.user_metadata || {};
      const fullName = meta.full_name || meta.name || user.email.split("@")[0];
      const nameParts = fullName.trim().split(" ");
      const firstName = meta.given_name || nameParts[0] || "";
      const lastName = meta.family_name || nameParts.slice(1).join(" ") || "";

      return {
        id: user.id,
        email: user.email.toLowerCase().trim(),
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        avatar_url: meta.avatar_url || meta.picture || "",
        role: "user",
      };
    });

    console.log(
      `Syncing ${formattedRecords.length} user(s) to allowed_users table...`,
    );

    const { data, error } = await supabase
      .from("allowed_users")
      .upsert(formattedRecords, { onConflict: "email" })
      .select();

    if (error) {
      console.error("Error inserting into allowed_users:", error.message);
    } else {
      console.log("Successfully synced users:");
      console.table(data);
    }
  } catch (err) {
    console.error("Execution failed:", err.message);
  }
}

syncAuthUsersToAllowed();
