import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // POC: just log it. In prod, fan out to CRM (HubSpot, Salesforce) + Slack.
  const formData = await req.formData().catch(() => null);
  if (formData) {
    console.log("[contact]", Object.fromEntries(formData.entries()));
  }
  return NextResponse.redirect(new URL("/contact?sent=1", req.url), { status: 303 });
}
