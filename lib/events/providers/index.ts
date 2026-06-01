import type { EventProvider, ProviderId } from "../types";
import { ticketmasterProvider } from "./ticketmaster";

// Registry of event-source adapters. Add a new website by implementing
// EventProvider and registering it here (and adding its id to ProviderId).
export const PROVIDERS: Record<ProviderId, EventProvider> = {
  ticketmaster: ticketmasterProvider,
};

export function getProvider(id: ProviderId): EventProvider {
  const provider = PROVIDERS[id];
  if (!provider) {
    throw new Error(`Unknown event provider: ${id}`);
  }
  return provider;
}
