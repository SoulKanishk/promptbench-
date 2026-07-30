import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

async function getStatus() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const checks = [
    { name: "App build", ok: true, detail: "Next.js server component rendered" },
  ];

  if (url && anonKey) {
    try {
      const supabase = createClient(url, anonKey);
      const start = Date.now();
      const { error } = await supabase.from("prompts").select("id").limit(1);
      const ms = Date.now() - start;
      checks.push({
        name: "Supabase connection",
        ok: !error,
        detail: error ? error.message : `Responded in ${ms}ms`,
      });
    } catch (e) {
      checks.push({
        name: "Supabase connection",
        ok: false,
        detail: e instanceof Error ? e.message : "Unknown error",
      });
    }
  } else {
    checks.push({
      name: "Supabase connection",
      ok: true,
      detail: "Demo mode — no Supabase env vars set, running on localStorage",
    });
  }

  checks.push({
    name: "Groq API",
    ok: true,
    detail: "Called client-side with a user-supplied key, never stored server-side",
  });

  return checks;
}

export default async function HealthPage() {
  const checks = await getStatus();
  const allOk = checks.every((c) => c.ok);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-4 py-16 text-paper">
      <div className="w-full max-w-md rounded-lg border border-ink-line bg-ink-raised p-6">
        <div className="mb-5 flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${allOk ? "bg-add" : "bg-del"}`}
          />
          <h1 className="font-mono text-sm uppercase tracking-widest text-paper-dim">
            System status
          </h1>
        </div>
        <ul className="space-y-3">
          {checks.map((c) => (
            <li key={c.name} className="flex items-start gap-3">
              <span
                className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                  c.ok ? "bg-add" : "bg-del"
                }`}
              />
              <div>
                <p className="font-mono text-sm text-paper">{c.name}</p>
                <p className="font-mono text-xs text-paper-dim">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        <Link
          href="/"
          className="mt-6 inline-block font-mono text-xs text-amber hover:underline"
        >
          ← back to workspace
        </Link>
      </div>
    </main>
  );
}
