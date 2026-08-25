import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase-server";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  let firstName: string | null = null;
  let username: string | null = null;
  let avatarUrl: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, first_name, username, avatar_url")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
    firstName = profile?.first_name ?? null;
    username = profile?.username ?? null;
    avatarUrl = profile?.avatar_url ?? null;
  }

  return (
    <>
      <Header
        isSignedIn={!!user}
        isAdmin={isAdmin}
        firstName={firstName}
        username={username}
        avatarUrl={avatarUrl}
      />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
