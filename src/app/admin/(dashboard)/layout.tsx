import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";

export const metadata = {
  title: "Admin",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabasePublicEnv()) {
    return (
      <main className="min-h-screen bg-rose-bg px-4 py-16 flex items-center justify-center">
        <div className="max-w-lg rounded-[2rem] bg-cream border border-rose-soft/40 shadow-cozy p-8 text-center">
          <h1 className="font-display text-3xl text-cocoa mb-3">Supabase nicht konfiguriert</h1>
          <p className="text-cocoa-light leading-relaxed">
            Bitte setze <code>NEXT_PUBLIC_SUPABASE_URL</code> und <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in deiner Umgebung, um den Admin-Bereich zu nutzen.
          </p>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/admin/login");
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail || user.email.toLowerCase() !== adminEmail) {
    return (
      <main className="min-h-screen bg-rose-bg px-4 py-16 flex items-center justify-center">
        <div className="max-w-lg rounded-[2rem] bg-cream border border-rose-soft/40 shadow-cozy p-8 text-center">
          <h1 className="font-display text-3xl text-cocoa mb-3">Kein Zugriff</h1>
          <p className="text-cocoa-light leading-relaxed mb-6">
            Dieses Konto ist nicht als Cozy Cloud Administrator berechtigt.
          </p>
          <form action="/api/admin/logout" method="post">
            <button className="rounded-full bg-rose-soft-deep px-6 py-3 font-display font-semibold text-cocoa">
              Abmelden
            </button>
          </form>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
