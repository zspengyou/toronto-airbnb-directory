import { NextResponse } from "next/server";
import { collectEvents } from "@/lib/events/collector";

// Always run fresh; never cache the collector route.
export const dynamic = "force-dynamic";
// Collector makes a handful of sequential HTTP + DynamoDB calls; give it room.
export const maxDuration = 60;

/**
 * Vercel Cron target. Vercel automatically attaches
 * `Authorization: Bearer ${CRON_SECRET}` to scheduled invocations when the
 * CRON_SECRET env var is set, so we verify it to reject public callers.
 * For manual/local runs, pass the same header yourself.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await collectEvents();
    console.log("[events] collection run complete", JSON.stringify(result));
    return NextResponse.json(result);
  } catch (err) {
    console.error("[events] collection run failed", err);
    return NextResponse.json(
      { error: "Collection failed", detail: String(err) },
      { status: 500 },
    );
  }
}
