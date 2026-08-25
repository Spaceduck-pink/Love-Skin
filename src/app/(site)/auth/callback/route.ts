import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// Google redirects the browser here with ?code= after consent — this has
// to be a real Route Handler (not a Server Action) since it's a plain
// browser GET request, not a form submission.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/`);
}
