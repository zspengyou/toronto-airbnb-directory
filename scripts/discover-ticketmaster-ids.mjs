// Resolve Ticketmaster attraction (team/performer) and venue IDs for a new
// subscription, then paste them into lib/events/subscriptions.ts.
//
// Usage:
//   TICKETMASTER_API_KEY=xxx node scripts/discover-ticketmaster-ids.mjs "Toronto Maple Leafs" "Scotiabank Arena"
//
// Each argument is searched as both an attraction and a venue keyword; pick the
// id whose name/city matches what you want.

const KEY = process.env.TICKETMASTER_API_KEY;
if (!KEY) {
  console.error("Set TICKETMASTER_API_KEY in the environment first.");
  process.exit(1);
}

const BASE = "https://app.ticketmaster.com/discovery/v2";
const keywords = process.argv.slice(2);
if (keywords.length === 0) {
  console.error('Pass one or more keywords, e.g. "Toronto Blue Jays" "Rogers Centre"');
  process.exit(1);
}

async function search(kind, keyword) {
  const url = `${BASE}/${kind}.json?apikey=${KEY}&keyword=${encodeURIComponent(keyword)}&countryCode=CA`;
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`  ${kind} "${keyword}" -> HTTP ${res.status}`);
    return;
  }
  const json = await res.json();
  const items = json._embedded?.[kind] ?? [];
  console.log(`\n${kind} matching "${keyword}" (${items.length}):`);
  for (const item of items.slice(0, 6)) {
    const city = item.city?.name || item._embedded?.venues?.[0]?.city?.name || "";
    console.log(`  id=${item.id}  name="${item.name}"${city ? `  [${city}]` : ""}`);
  }
}

for (const keyword of keywords) {
  await search("attractions", keyword);
  await search("venues", keyword);
}
