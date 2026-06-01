import { SUBSCRIPTIONS } from "./subscriptions";
import { getProvider } from "./providers";
import { upsertEvent } from "./store";
import type { DateRange } from "./types";

const DEFAULT_WINDOW_DAYS = 120;

export interface SeriesResult {
  seriesId: string;
  fetched: number;
  upserted: number;
  error?: string;
}

export interface CollectorResult {
  windowDays: number;
  totalUpserted: number;
  perSeries: SeriesResult[];
}

/**
 * Pull every subscribed series for a forward window and upsert into DynamoDB.
 * Each series is isolated in its own try/catch so one failing source (bad ids,
 * provider outage) never aborts the rest of the run.
 */
export async function collectEvents(windowDays = DEFAULT_WINDOW_DAYS): Promise<CollectorResult> {
  const now = new Date();
  const end = new Date(now.getTime() + windowDays * 24 * 60 * 60 * 1000);
  const range: DateRange = { start: now.toISOString(), end: end.toISOString() };

  const perSeries: SeriesResult[] = [];
  let totalUpserted = 0;

  for (const subscription of SUBSCRIPTIONS) {
    try {
      const provider = getProvider(subscription.provider);
      const events = await provider.fetchEvents(subscription, range);
      let upserted = 0;
      for (const event of events) {
        await upsertEvent(event);
        upserted++;
      }
      totalUpserted += upserted;
      perSeries.push({ seriesId: subscription.id, fetched: events.length, upserted });
    } catch (err) {
      perSeries.push({
        seriesId: subscription.id,
        fetched: 0,
        upserted: 0,
        error: String(err),
      });
      console.error(`[events] collection failed for "${subscription.id}":`, err);
    }
  }

  return { windowDays, totalUpserted, perSeries };
}
