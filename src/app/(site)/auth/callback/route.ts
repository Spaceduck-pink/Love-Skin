import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase-server";
import { sendWelcomeEmail } from "@/lib/email";

// Google redirects the browser here with ?code= after consent — this has
// to be a real Route Handler (not a Server Action) since it's a plain
// browser GET request, not a form submission. redirectTo is a plain,
// query-string-free URL (see signInWithGoogle in auth-actions.ts), so the
// post-login destination travels via the auth_next cookie instead.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const cookieStore = await cookies();
  const next = cookieStore.get("auth_next")?.value || "/";
  cookieStore.delete("auth_next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await sendWelcomeEmailOnce(supabase, data.user);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/`);
}

// The profiles row already exists by the time this runs (created by the
// handle_new_user DB trigger), so a not-yet-sent flag is what distinguishes
// a brand-new sign-up from someone simply signing back in later.
async function sendWelcomeEmailOnce(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: { id: string; email?: string } | null,
) {
  if (!user?.email) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, welcome_email_sent")
    .eq("id", user.id)
    .single();

  if (!profile || profile.welcome_email_sent) return;

  try {
    await sendWelcomeEmail(user.email, profile.first_name);
  } catch (err) {
    console.error("Failed to send welcome email:", err);
    return;
  }

  await supabase.from("profiles").update({ welcome_email_sent: true }).eq("id", user.id);
}
