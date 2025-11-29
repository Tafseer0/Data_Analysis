import type { SheetData, SheetRecord, WorkbookAnalysis, MarketData, ContentOwnerData, SheetAbbreviation } from "@shared/schema";
import { SHEET_MAPPINGS, SHEET_FULL_NAMES } from "@shared/schema";

const STATUS_ACTIVE_KEYWORDS = ["active", "up", "live", "online", "available", "approved"];
const STATUS_REMOVED_KEYWORDS = ["removed", "down", "offline", "deleted", "taken down", "unavailable", "pending"];

export function normalizeStatus(status: string): "active" | "removed" | "unknown" {
  const lower = status.toLowerCase().trim();
  if (STATUS_ACTIVE_KEYWORDS.some(k => lower.includes(k))) return "active";
  if (STATUS_REMOVED_KEYWORDS.some(k => lower.includes(k))) return "removed";
  return "unknown";
}

export function findColumnIndex(headers: string[], keywords: string[]): number {
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i]?.toLowerCase().trim() || "";
    if (keywords.some(k => header.includes(k))) return i;
  }
  return -1;
}

export function detectColumns(headers: string[]): {
  statusIdx: number;
  marketIdx: number;
  monthIdx: number;
  contentOwnerIdx: number;
  urlIdx: number;
} {
  return {
    statusIdx: findColumnIndex(headers, ["status", "state"]),
    marketIdx: findColumnIndex(headers, ["market", "country", "region", "location"]),
    monthIdx: findColumnIndex(headers, ["month", "date", "period"]),
    contentOwnerIdx: findColumnIndex(headers, ["content owner", "owner", "content_owner", "contentowner"]),
    urlIdx: findColumnIndex(headers, ["url", "link", "address"]),
  };
}

export function calculateMarketData(records: SheetRecord[]): MarketData[] {
  const marketMap = new Map<string, { active: number; removed: number }>();
  
  records.forEach(record => {
    const market = record.market || "Unknown";
    if (!marketMap.has(market)) {
      marketMap.set(market, { active: 0, removed: 0 });
    }
    const data = marketMap.get(market)!;
    const status = normalizeStatus(record.status);
    if (status === "active") data.active++;
    else if (status === "removed") data.removed++;
  });

  return Array.from(marketMap.entries())
    .map(([market, data]) => ({
      market,
      activeCount: data.active,
      removedCount: data.removed,
      totalUrls: data.active + data.removed,
    }))
    .sort((a, b) => b.totalUrls - a.totalUrls);
}

export function calculateContentOwners(records: SheetRecord[]): ContentOwnerData[] {
  const ownerMap = new Map<string, number>();
  let total = 0;

  records.forEach(record => {
    const owner = record.contentOwner || "Unknown";
    ownerMap.set(owner, (ownerMap.get(owner) || 0) + 1);
    total++;
  });

  return Array.from(ownerMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function filterRecords(
  records: SheetRecord[],
  months: string[],
  markets: string[],
  contentOwners: string[]
): SheetRecord[] {
  return records.filter(record => {
    if (months.length > 0 && record.month && !months.includes(record.month)) return false;
    if (markets.length > 0 && record.market && !markets.includes(record.market)) return false;
    if (contentOwners.length > 0 && record.contentOwner && !contentOwners.includes(record.contentOwner)) return false;
    return true;
  });
}

export function calculateSheetStats(records: SheetRecord[]): { active: number; removed: number } {
  let active = 0;
  let removed = 0;
  
  records.forEach(record => {
    const status = normalizeStatus(record.status);
    if (status === "active") active++;
    else if (status === "removed") removed++;
  });

  return { active, removed };
}

export function getRemovalRate(removed: number, total: number): number {
  if (total === 0) return 0;
  return (removed / total) * 100;
}

export function getProgressBarColor(rate: number): string {
  if (rate >= 80) return "bg-green-500";
  if (rate >= 60) return "bg-emerald-500";
  if (rate >= 40) return "bg-yellow-500";
  if (rate >= 20) return "bg-orange-500";
  return "bg-red-500";
}

export function getUniqueValues(records: SheetRecord[], field: keyof SheetRecord): string[] {
  const values = new Set<string>();
  records.forEach(record => {
    const value = record[field];
    if (value && typeof value === "string") {
      values.add(value);
    }
  });
  return Array.from(values).sort();
}
