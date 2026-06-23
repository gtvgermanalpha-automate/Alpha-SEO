/**
 * Minimal GitHub Contents API client used by the CMS to read and commit the
 * `src/content/*.json` files. A commit to the configured branch triggers a
 * Vercel deploy, which is how CMS edits go live.
 *
 * Uses plain `fetch` (no SDK) so there are no extra dependencies.
 * Required env vars: GITHUB_TOKEN, GITHUB_REPO ("owner/name"). Optional: GITHUB_BRANCH (default "main").
 */

const API_BASE = "https://api.github.com";

type GitHubConfig = { token: string; repo: string; branch: string };

function getConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return null;
  return { token, repo, branch: process.env.GITHUB_BRANCH || "main" };
}

/** Whether commits can be made (token + repo present). */
export function githubConfigured(): boolean {
  return getConfig() !== null;
}

/**
 * The branch CMS edits are SAVED to (the "draft" branch). Saves commit here, NOT
 * to the production branch, so a save never triggers a deploy. Publishing merges
 * this branch into the production branch (one deploy). Override with
 * GITHUB_DRAFT_BRANCH; defaults to "cms-draft".
 */
export function getDraftBranch(): string {
  return process.env.GITHUB_DRAFT_BRANCH || "cms-draft";
}

/** The production branch Vercel deploys (where Publish lands edits). */
export function getProdBranch(): string {
  return getConfig()?.branch ?? "main";
}

/** Encode a repo-relative path without escaping the slashes. */
function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

function decodeBase64(b64: string): string {
  const clean = b64.replace(/\s/g, "");
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  const config = getConfig();
  if (!config) throw new Error("GitHub is not configured (set GITHUB_TOKEN and GITHUB_REPO).");
  return fetch(`${API_BASE}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "alpha-cms",
      ...(init?.headers ?? {}),
    },
  });
}

/** Fetch and JSON-parse a file from the repo (from `branch`, default production). Returns the parsed data + blob sha. */
export async function getJsonFile<T = unknown>(filePath: string, branch?: string): Promise<{ data: T; sha: string }> {
  const config = getConfig();
  if (!config) throw new Error("GitHub is not configured.");
  const ref = branch ?? config.branch;
  const res = await request(
    `/repos/${config.repo}/contents/${encodePath(filePath)}?ref=${encodeURIComponent(ref)}`,
  );
  if (!res.ok) {
    throw new Error(`GitHub GET ${filePath} failed (${res.status}): ${await res.text()}`);
  }
  const json = (await res.json()) as { content?: string; sha?: string };
  if (typeof json.content !== "string" || typeof json.sha !== "string") {
    throw new Error(`GitHub GET ${filePath} returned no file content (is it a directory?).`);
  }
  return { data: JSON.parse(decodeBase64(json.content)) as T, sha: json.sha };
}

/**
 * Commit `data` (pretty-printed JSON) to `filePath` on the configured branch.
 * `sha` must be the current blob sha (from getJsonFile) to update in place.
 */
export async function putJsonFile(
  filePath: string,
  data: unknown,
  sha: string | null | undefined,
  message: string,
  branch?: string,
): Promise<{ blobSha: string | undefined; commitSha: string | undefined }> {
  const config = getConfig();
  if (!config) throw new Error("GitHub is not configured.");
  const body: Record<string, unknown> = {
    message,
    content: encodeBase64(JSON.stringify(data, null, 2) + "\n"),
    branch: branch ?? config.branch,
  };
  if (sha) body.sha = sha; // omit on create
  const res = await request(`/repos/${config.repo}/contents/${encodePath(filePath)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`GitHub PUT ${filePath} failed (${res.status}): ${await res.text()}`);
  }
  const json = (await res.json()) as { content?: { sha?: string }; commit?: { sha?: string } };
  return { blobSha: json.content?.sha, commitSha: json.commit?.sha };
}

/** Current blob sha for a path on `branch` (default production), or null if the file doesn't exist yet. */
export async function getFileSha(filePath: string, branch?: string): Promise<string | null> {
  const config = getConfig();
  if (!config) throw new Error("GitHub is not configured.");
  const ref = branch ?? config.branch;
  const res = await request(
    `/repos/${config.repo}/contents/${encodePath(filePath)}?ref=${encodeURIComponent(ref)}`,
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET sha ${filePath} failed (${res.status}): ${await res.text()}`);
  const json = (await res.json()) as { sha?: string };
  return typeof json.sha === "string" ? json.sha : null;
}

/** Commit a file from already-base64-encoded content (text or binary, e.g. an upload). */
export async function putRawFile(
  filePath: string,
  base64Content: string,
  message: string,
  sha?: string | null,
  branch?: string,
): Promise<{ commitSha: string | undefined; path: string }> {
  const config = getConfig();
  if (!config) throw new Error("GitHub is not configured.");
  const body: Record<string, unknown> = { message, content: base64Content, branch: branch ?? config.branch };
  if (sha) body.sha = sha;
  const res = await request(`/repos/${config.repo}/contents/${encodePath(filePath)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub PUT ${filePath} failed (${res.status}): ${await res.text()}`);
  const json = (await res.json()) as { commit?: { sha?: string } };
  return { commitSha: json.commit?.sha, path: filePath };
}

/* ─────────────────────────── Draft / publish workflow ───────────────────────────
 * CMS edits commit to the DRAFT branch (getDraftBranch), leaving the production
 * branch untouched — so a save never triggers a deploy. "Publish" merges the draft
 * branch into the production branch, the one action that triggers a Vercel deploy.
 * Uses the Git Data + Merges APIs over the same authenticated `request()` helper.
 */

/** Head commit sha of a branch, or null if the branch doesn't exist. */
export async function getBranchSha(branch: string): Promise<string | null> {
  const config = getConfig();
  if (!config) throw new Error("GitHub is not configured.");
  const res = await request(`/repos/${config.repo}/git/ref/heads/${encodePath(branch)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub get ref ${branch} failed (${res.status}): ${await res.text()}`);
  const json = (await res.json()) as { object?: { sha?: string } };
  return json.object?.sha ?? null;
}

/** Whether a branch exists. */
export async function branchExists(branch: string): Promise<boolean> {
  return (await getBranchSha(branch)) !== null;
}

/** Create the draft branch from the production-branch head if it doesn't exist yet. */
export async function ensureDraftBranch(): Promise<void> {
  const config = getConfig();
  if (!config) throw new Error("GitHub is not configured.");
  const draft = getDraftBranch();
  if (await branchExists(draft)) return;
  const baseSha = await getBranchSha(config.branch);
  if (!baseSha) throw new Error(`Production branch "${config.branch}" not found.`);
  const res = await request(`/repos/${config.repo}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${draft}`, sha: baseSha }),
  });
  // 201 created; 422 if it already exists (lost a race) — both fine.
  if (!res.ok && res.status !== 422) {
    throw new Error(`GitHub create draft branch failed (${res.status}): ${await res.text()}`);
  }
}

export type DraftStatus = { pending: number; files: string[]; aheadBy: number; draftExists: boolean };

/** Compare the draft branch to production: which files differ (= unpublished changes). */
export async function getDraftStatus(): Promise<DraftStatus> {
  const config = getConfig();
  if (!config) throw new Error("GitHub is not configured.");
  const draft = getDraftBranch();
  const draftSha = await getBranchSha(draft);
  if (!draftSha) return { pending: 0, files: [], aheadBy: 0, draftExists: false };
  const res = await request(
    `/repos/${config.repo}/compare/${encodeURIComponent(config.branch)}...${encodeURIComponent(draft)}`,
  );
  if (!res.ok) throw new Error(`GitHub compare failed (${res.status}): ${await res.text()}`);
  const json = (await res.json()) as { ahead_by?: number; files?: { filename: string }[] };
  const files = (json.files ?? []).map((f) => f.filename);
  return { pending: files.length, files, aheadBy: json.ahead_by ?? 0, draftExists: true };
}

/**
 * Force the draft branch back to the production head — discards unpublished edits,
 * and re-syncs the draft after a publish. Safe no-op if the draft branch is absent.
 */
export async function resetDraftToProd(): Promise<void> {
  const config = getConfig();
  if (!config) throw new Error("GitHub is not configured.");
  const draft = getDraftBranch();
  if (!(await branchExists(draft))) return;
  const prodSha = await getBranchSha(config.branch);
  if (!prodSha) throw new Error(`Production branch "${config.branch}" not found.`);
  const res = await request(`/repos/${config.repo}/git/refs/heads/${encodePath(draft)}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: prodSha, force: true }),
  });
  if (!res.ok) throw new Error(`GitHub reset draft failed (${res.status}): ${await res.text()}`);
}

/**
 * Publish: merge the draft branch into production (triggers a Vercel deploy), then
 * re-sync the draft to the new production head. Returns { merged:false } when there
 * was nothing to publish. Throws "conflict: …" if the branches diverged.
 */
export async function publishDraft(message: string): Promise<{ merged: boolean; commitSha?: string }> {
  const config = getConfig();
  if (!config) throw new Error("GitHub is not configured.");
  const draft = getDraftBranch();
  const status = await getDraftStatus();
  if (!status.draftExists || status.aheadBy === 0) return { merged: false };
  const res = await request(`/repos/${config.repo}/merges`, {
    method: "POST",
    body: JSON.stringify({ base: config.branch, head: draft, commit_message: message }),
  });
  if (res.status === 409) {
    throw new Error("conflict: the live site changed since these edits — discard or reload, then re-save.");
  }
  if (res.status === 204) return { merged: false }; // production already contains the draft
  if (!res.ok) throw new Error(`GitHub merge failed (${res.status}): ${await res.text()}`);
  const json = (await res.json()) as { sha?: string };
  await resetDraftToProd();
  return { merged: true, commitSha: json.sha };
}
