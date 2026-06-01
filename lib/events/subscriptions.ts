import type { Subscription } from "./types";

// Static venue capacities (approximate). Ticketmaster does not return
// attendance, so these are used later only as a coarse demand signal.
const ROGERS_CENTRE = { name: "Rogers Centre", capacity: 41_500 };
const SCOTIABANK_ARENA = { name: "Scotiabank Arena", capacity: 19_800 };

// The series the host tracks. Code-defined for v1.
//
// `attractionId` (the team) + `venueId` (its home arena) together filter
// Ticketmaster down to HOME games only. These ids are Ticketmaster-specific —
// resolve new ones with `scripts/discover-ticketmaster-ids.mjs`, then paste
// them in below. (Empty strings are placeholders that fetch nothing.)
export const SUBSCRIPTIONS: Subscription[] = [
  {
    id: "blue-jays-home",
    label: "Toronto Blue Jays (home)",
    provider: "ticketmaster",
    kind: "sports",
    query: { attractionId: "K8vZ91718W0", venueId: "KovZpa3Bbe" },
    venue: ROGERS_CENTRE,
  },
  {
    id: "raptors-home",
    label: "Toronto Raptors (home)",
    provider: "ticketmaster",
    kind: "sports",
    query: { attractionId: "K8vZ9171KC0", venueId: "KovZpZAFFE1A" },
    venue: SCOTIABANK_ARENA,
  },
];
