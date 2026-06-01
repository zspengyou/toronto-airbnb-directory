import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import type { DateRange, NormalizedEvent } from "./types";

// AWS credentials + region are read from the standard env vars
// (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_REGION) via the SDK's default
// provider chain — set them in the Vercel project settings.

const GSI1 = "gsi1";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

let cachedDoc: DynamoDBDocumentClient | null = null;

function docClient(): DynamoDBDocumentClient {
  if (cachedDoc) return cachedDoc;
  const client = new DynamoDBClient({ region: process.env.AWS_REGION ?? "us-east-1" });
  cachedDoc = DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true },
  });
  return cachedDoc;
}

/** yearMonth partition key, e.g. "2026-07" from an ISO 8601 datetime. */
function yearMonth(iso: string): string {
  return iso.slice(0, 7);
}

/** UTC months spanned by [start, end] inclusive, as "YYYY-MM" strings. */
function monthsBetween(startIso: string, endIso: string): string[] {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const months: string[] = [];
  let year = start.getUTCFullYear();
  let month = start.getUTCMonth(); // 0-based
  const endYear = end.getUTCFullYear();
  const endMonth = end.getUTCMonth();
  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push(`${year}-${String(month + 1).padStart(2, "0")}`);
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
  }
  return months;
}

/**
 * Idempotent upsert keyed by `eventId`. GSI1 keys are derived from the UTC
 * `startDateTime` (kept consistent with the range query, which also filters on
 * the UTC instant). `localDate` is stored separately for venue-local grouping.
 */
export async function upsertEvent(event: NormalizedEvent): Promise<void> {
  const item = {
    ...event,
    gsi1pk: yearMonth(event.startDateTime),
    gsi1sk: event.startDateTime,
    fetchedAt: new Date().toISOString(),
  };
  await docClient().send(new PutCommand({ TableName: requireEnv("EVENTS_TABLE_NAME"), Item: item }));
}

/**
 * Query events whose UTC start falls within `range`, across the GSI1 month
 * partitions the range spans. Results are sorted by start time ascending.
 */
export async function queryEventsInRange(range: DateRange): Promise<NormalizedEvent[]> {
  const table = requireEnv("EVENTS_TABLE_NAME");
  const results: NormalizedEvent[] = [];

  for (const month of monthsBetween(range.start, range.end)) {
    let lastKey: Record<string, unknown> | undefined;
    do {
      const res = await docClient().send(
        new QueryCommand({
          TableName: table,
          IndexName: GSI1,
          KeyConditionExpression: "gsi1pk = :ym AND gsi1sk BETWEEN :start AND :end",
          ExpressionAttributeValues: {
            ":ym": month,
            ":start": range.start,
            ":end": range.end,
          },
          ExclusiveStartKey: lastKey,
        }),
      );
      for (const item of res.Items ?? []) {
        results.push(item as NormalizedEvent);
      }
      lastKey = res.LastEvaluatedKey;
    } while (lastKey);
  }

  results.sort((a, b) => a.startDateTime.localeCompare(b.startDateTime));
  return results;
}
