"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      setStatus("error");
      setMessage(data.message ?? "Sign-in failed.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center">
      <div className="border border-line bg-white p-8">
        <h1 className="font-display text-2xl font-extrabold text-ink">Sign in</h1>
        <p className="mt-2 text-sm text-muted">Enter the admin password to manage site content.</p>

        {!configured && (
          <div className="mt-5 border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">CMS not configured</p>
            <p className="mt-1">
              Set <code className="font-mono">ADMIN_PASSWORD</code> and{" "}
              <code className="font-mono">ADMIN_SESSION_SECRET</code> in the environment (Netlify or{" "}
              <code className="font-mono">.env.local</code>), then reload. See{" "}
              <code className="font-mono">ADMIN.md</code>.
            </p>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6">
          <label
            htmlFor="password"
            className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!configured || status === "submitting"}
            className="w-full rounded-none border border-line bg-white px-4 py-3 text-sm text-ink focus:border-bronze focus-visible:outline-none focus:ring-1 focus:ring-bronze disabled:bg-neutral-50"
          />
          {status === "error" && <p className="mt-2 text-xs font-medium text-red-700">{message}</p>}
          <button
            type="submit"
            disabled={!configured || status === "submitting" || password.length === 0}
            className="mt-5 w-full bg-ink px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
