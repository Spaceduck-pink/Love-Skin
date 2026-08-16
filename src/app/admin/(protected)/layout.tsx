import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/admin-auth";
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
  const isAuthed = await verifyAdminSession();
  if (!isAuthed) {
    redirect("/admin/login");
  }

  return (
    <div className={styles.shell}>
      <div className="container">
        <AdminNav />
      </div>
      <div className={`container ${styles.content}`}>{children}</div>
    </div>
  );
}
