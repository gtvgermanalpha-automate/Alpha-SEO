/**
 * Public lead forms (contact + audit) post directly to Formspree — no backend,
 * no database, nothing host-specific. This replaced Netlify Forms when the site
 * moved to Vercel.
 *
 * The endpoint is read from NEXT_PUBLIC_FORMSPREE_ENDPOINT so the owner can point
 * it at their own Formspree form from the Vercel dashboard without a code change;
 * it falls back to the project's existing form. ⚠ Confirm this endpoint is yours
 * before relying on it — submissions go wherever it points. Changing the env var
 * needs a redeploy (NEXT_PUBLIC_* values are inlined at build time).
 *
 * Both forms share one endpoint and are told apart by the `_subject` line they
 * send (Formspree uses it as the email subject). Formspree also honours two
 * "magic" fields automatically: `email` (used as the reply-to) and `_gotcha`
 * (a honeypot — a hidden field real users leave blank; bots that fill it are
 * silently dropped).
 */
export const FORMSPREE_ENDPOINT =
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT?.trim() || "https://formspree.io/f/xaqvnaap";

/**
 * POST already-assembled form fields to Formspree over AJAX (so the page never
 * reloads). The `Accept: application/json` header makes Formspree return JSON
 * instead of redirecting. Resolves `true` when the submission is accepted.
 */
export async function submitToFormspree(body: URLSearchParams): Promise<boolean> {
  const res = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });
  return res.ok;
}
