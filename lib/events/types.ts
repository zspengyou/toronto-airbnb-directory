// Shared event-collection types.
//
// The design goal (see plan) is that the events page and any future pricing
// logic never care which website an event came from. Every provider maps its
// raw payload into a single `NormalizedEvent`. Adding a new website later means
// adding one provider adapter; adding a new series means adding one Subscription.

/** Identifier of an external event source (one per website/API adapter). */
export type ProviderId = "ticketmaster";

export type EventKind = "sports" | "concert" | "other";

/** Inclusive date window to fetch, as ISO 8601 strings (UTC). */
export interface DateRange {
  start: string;
  end: string;
}

/** Provider-specific query for one series (e.g. a team's home games). */
export interface SubscriptionQuery {
  /** Ticketmaster attraction (team / performer) id. */
  attractionId?: string;
  /** Ticketmaster venue id. Combine with attractionId to get home games only. */
  venueId?: string;
}

/**
 * A "series" the host wants to track (Blue Jays home games, Raptors home
 * games, …). Code-defined for v1; could move to the DB later.
 */
export interface Subscription {
  /** Stable slug, used as `seriesId` on every event it produces. */
  id: string;
  /** Human-readable label shown on the events page. */
  label: string;
  provider: ProviderId;
  /** Default event kind; a provider may override from richer classification. */
  kind: EventKind;
  query: SubscriptionQuery;
  /**
   * The venue this series plays at. `capacity` is a static approximation
   * (Ticketmaster does not return attendance) used later as a coarse demand
   * signal — not an exact attendance figure.
   */
  venue: { name: string; capacity?: number };
}

/** One event, normalized across all providers. */
export interface NormalizedEvent {
  /** `${source}#${providerEventId}` — DynamoDB PK; makes upserts idempotent. */
  eventId: string;
  /** Provider that produced this event (e.g. "ticketmaster"). */
  source: string;
  /** Subscription id that matched this event. */
  seriesId: string;
  /** Subscription label, denormalized for display. */
  seriesLabel: string;
  /** Event name from the provider (e.g. "Blue Jays vs Yankees"). */
  title: string;
  venueName: string;
  venueId?: string;
  /** ISO 8601 (UTC) start instant. */
  startDateTime: string;
  /** Calendar date in the venue's local time, YYYY-MM-DD. */
  localDate: string;
  kind: EventKind;
  /** Link back to the provider's event page. */
  url?: string;
  /** Static venue capacity copied from the subscription (approximate). */
  capacity?: number;
}

/** Adapter contract every event source implements. */
export interface EventProvider {
  id: ProviderId;
  fetchEvents(subscription: Subscription, range: DateRange): Promise<NormalizedEvent[]>;
}
