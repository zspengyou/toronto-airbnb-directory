import type {
  DateRange,
  EventKind,
  EventProvider,
  NormalizedEvent,
  Subscription,
} from "../types";

const TM_BASE = "https://app.ticketmaster.com/discovery/v2";
const SOURCE = "ticketmaster";

// Ticketmaster page size. Deep paging is capped at (size * page) < 1000, so
// size=100 allows up to 10 pages / 1000 events — ample for a team's season.
const PAGE_SIZE = 100;
const MAX_PAGES = 10;

// --- Minimal shape of the Discovery API /events response we rely on. ---

interface TmDateStart {
  localDate?: string;
  localTime?: string;
  dateTime?: string; // UTC ISO 8601
}

interface TmVenue {
  id?: string;
  name?: string;
}

interface TmClassification {
  segment?: { name?: string };
}

interface TmEvent {
  id: string;
  name: string;
  url?: string;
  dates?: { start?: TmDateStart };
  classifications?: TmClassification[];
  _embedded?: { venues?: TmVenue[] };
}

interface TmEventsResponse {
  _embedded?: { events?: TmEvent[] };
  page?: { number?: number; totalPages?: number };
}

function requireApiKey(): string {
  const key = process.env.TICKETMASTER_API_KEY;
  if (!key) {
    throw new Error("Missing required environment variable: TICKETMASTER_API_KEY");
  }
  return key;
}

/** Ticketmaster wants `YYYY-MM-DDTHH:mm:ssZ` (no milliseconds). */
function toTmDateTime(iso: string): string {
  return new Date(iso).toISOString().replace(/\.\d{3}Z$/, "Z");
}

function mapKind(event: TmEvent, fallback: EventKind): EventKind {
  const segment = event.classifications?.[0]?.segment?.name?.toLowerCase();
  if (segment === "sports") return "sports";
  if (segment === "music") return "concert";
  return fallback;
}

function mapEvent(event: TmEvent, subscription: Subscription): NormalizedEvent {
  const start = event.dates?.start;
  const localDate = start?.localDate ?? "";
  // Prefer the exact UTC instant; fall back to midnight of the local date when
  // the event has no published start time.
  const startDateTime = start?.dateTime ?? (localDate ? `${localDate}T00:00:00Z` : "");
  const venue = event._embedded?.venues?.[0];

  return {
    eventId: `${SOURCE}#${event.id}`,
    source: SOURCE,
    seriesId: subscription.id,
    seriesLabel: subscription.label,
    title: event.name,
    venueName: venue?.name ?? subscription.venue.name,
    venueId: venue?.id,
    startDateTime,
    localDate,
    kind: mapKind(event, subscription.kind),
    url: event.url,
    capacity: subscription.venue.capacity,
  };
}

async function fetchPage(
  subscription: Subscription,
  range: DateRange,
  page: number,
): Promise<TmEventsResponse> {
  const params = new URLSearchParams({
    apikey: requireApiKey(),
    startDateTime: toTmDateTime(range.start),
    endDateTime: toTmDateTime(range.end),
    size: String(PAGE_SIZE),
    page: String(page),
    sort: "date,asc",
  });
  if (subscription.query.attractionId) {
    params.set("attractionId", subscription.query.attractionId);
  }
  if (subscription.query.venueId) {
    params.set("venueId", subscription.query.venueId);
  }

  const res = await fetch(`${TM_BASE}/events.json?${params.toString()}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Ticketmaster API ${res.status}: ${body}`);
  }
  return (await res.json()) as TmEventsResponse;
}

export const ticketmasterProvider: EventProvider = {
  id: "ticketmaster",

  async fetchEvents(subscription, range) {
    // A subscription with no resolved ids would match every event in the date
    // window — refuse rather than flood the table.
    if (!subscription.query.attractionId && !subscription.query.venueId) {
      throw new Error(
        `Subscription "${subscription.id}" has no attractionId or venueId — ` +
          `resolve them with scripts/discover-ticketmaster-ids.ts`,
      );
    }

    const events: NormalizedEvent[] = [];
    for (let page = 0; page < MAX_PAGES; page++) {
      const data = await fetchPage(subscription, range, page);
      const pageEvents = data._embedded?.events ?? [];
      for (const event of pageEvents) {
        events.push(mapEvent(event, subscription));
      }

      const totalPages = data.page?.totalPages ?? 1;
      if (pageEvents.length === 0 || page >= totalPages - 1) break;
    }
    return events;
  },
};
