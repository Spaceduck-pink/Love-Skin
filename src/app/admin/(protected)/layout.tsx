import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AdminNav from "./AdminNav";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <main id="main-content" className={styles.shell}>
      <div className="container">
        <AdminNav />
      </div>
      <div className={`container ${styles.content}`}>{children}</div>
    </main>
  );
}
