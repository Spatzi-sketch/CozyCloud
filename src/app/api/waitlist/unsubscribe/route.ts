import { NextResponse } from "next/server";
import { unsubscribeWaitlistToken } from "@/lib/waitlist";
import { getSiteUrl } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || "";
  const siteUrl = getSiteUrl();

  const result = await unsubscribeWaitlistToken(token);
  const redirect = new URL("/warteliste/abgemeldet", siteUrl);
  if (result.ok) {
    redirect.searchParams.set("status", result.already ? "already" : "success");
    redirect.searchParams.set("product", result.productName);
  } else {
    redirect.searchParams.set("status", result.error);
  }

  return NextResponse.redirect(redirect);
}
