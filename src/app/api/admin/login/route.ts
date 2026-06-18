import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_TTL_SECONDS,
  checkPassword,
  createSessionToken,
  isConfigured,
} from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "not_configured", message: "CMS auth is not configured on the server." },
      { status: 503 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password;
  } catch {
    // fall through to invalid
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "invalid", message: "Incorrect password." }, { status: 401 });
  }

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return response;
}
