import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import UserRow from "./UserRow";
import styles from "../table.module.css";

export const metadata: Metadata = {
  title: "Users — Admin",
  robots: { index: false, follow: false },
};

async function getUsers() {
  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("id, first_name, last_name, role, created_at")
    .order("created_at", { ascending: false });

  if (profilesError) {
    console.error("Failed to load profiles:", profilesError.message);
    return [];
  }

  // profiles doesn't store email, so pull it from Supabase Auth and merge.
  const emailById = new Map<string, string>();
  const perPage = 200;
  for (let page = 1; ; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error("Failed to load auth users:", error.message);
      break;
    }
    for (const authUser of data.users) {
      emailById.set(authUser.id, authUser.email ?? "");
    }
    if (data.users.length < perPage) break;
  }

  return profiles.map((profile) => ({
    ...profile,
    email: emailById.get(profile.id) ?? "",
  }));
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  return (
    <section>
      <div className={styles.header}>
        <h1 className={styles.title}>Users</h1>
        <span className={styles.count}>
          {users.length} {users.length === 1 ? "user" : "users"}
        </span>
      </div>

      {users.length === 0 ? (
        <p className={styles.empty}>No users yet.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} isSelf={user.id === currentUser?.id} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
