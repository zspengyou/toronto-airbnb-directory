import { CalendarDays } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queryEventsInRange } from "@/lib/events/store";
import type { NormalizedEvent } from "@/lib/events/types";

// Read live from DynamoDB on each request; this is a small, low-traffic page.
export const dynamic = "force-dynamic";

const WINDOW_DAYS = 90;

/** Format a YYYY-MM-DD local date as "Sat, Jul 4" (no timezone math). */
function formatDate(localDate: string): string {
  if (!localDate) return "";
  const [year, month, day] = localDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Format the UTC start instant as a Toronto-local time, e.g. "7:07 PM". */
function formatTime(startDateTime: string): string {
  if (!startDateTime) return "TBD";
  const date = new Date(startDateTime);
  if (Number.isNaN(date.getTime())) return "TBD";
  return date.toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Toronto",
  });
}

async function loadEvents(): Promise<{ events: NormalizedEvent[]; error?: string }> {
  const now = new Date();
  const end = new Date(now.getTime() + WINDOW_DAYS * 24 * 60 * 60 * 1000);
  try {
    const events = await queryEventsInRange({
      start: now.toISOString(),
      end: end.toISOString(),
    });
    return { events };
  } catch (err) {
    console.error("[events] page failed to load events", err);
    return { events: [], error: String(err) };
  }
}

export default async function EventsPage() {
  const { events, error } = await loadEvents();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-2 flex items-center gap-2">
        <CalendarDays className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Upcoming Toronto Events</h1>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Major events near the listings over the next {WINDOW_DAYS} days, for manual
        pricing decisions. Capacity is the venue&apos;s seating (approximate), not
        attendance.
      </p>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm">
          Could not load events. Check that the events store is configured.
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-md border p-4 text-sm text-muted-foreground">
          No events found yet. Once the daily collector runs (or you trigger it
          manually), upcoming events will appear here.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Series</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead className="text-right">Capacity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.eventId}>
                <TableCell className="font-medium">{formatDate(event.localDate)}</TableCell>
                <TableCell>{formatTime(event.startDateTime)}</TableCell>
                <TableCell className="whitespace-normal">
                  {event.url ? (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      {event.title}
                    </a>
                  ) : (
                    event.title
                  )}
                </TableCell>
                <TableCell>{event.seriesLabel}</TableCell>
                <TableCell>{event.venueName}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {event.capacity ? event.capacity.toLocaleString("en-CA") : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
