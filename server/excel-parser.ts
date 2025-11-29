import * as XLSX from "xlsx";
import type { SheetData, SheetRecord, SheetAbbreviation, WorkbookAnalysis } from "@shared/schema";
import { SHEET_MAPPINGS, SHEET_FULL_NAMES } from "@shared/schema";

const STATUS_ACTIVE_KEYWORDS = ["active", "up", "live", "online", "available", "approved"];
const STATUS_REMOVED_KEYWORDS = ["removed", "down", "offline", "deleted", "taken down", "unavailable", "pending"];

function normalizeStatus(status: string): "active" | "removed" | "unknown" {
  if (!status) return "unknown";
  const lower = status.toLowerCase().trim();
  if (STATUS_ACTIVE_KEYWORDS.some(k => lower.includes(k))) return "active";
  if (STATUS_REMOVED_KEYWORDS.some(k => lower.includes(k))) return "removed";
  return "unknown";
}

function findColumnIndex(headers: string[], keywords: string[]): number {
  for (let i = 0; i < headers.length; i++) {
    const header = (headers[i] || "").toString().toLowerCase().trim();
    if (keywords.some(k => header.includes(k))) return i;
  }
  return -1;
}

function detectColumns(headers: string[], abbreviation?: string): {
  statusIdx: number;
  marketIdx: number;
  monthIdx: number;
  contentOwnerIdx: number;
  urlIdx: number;
  withIdx: number;
  googleStatusIdx: number;
  bingStatusIdx: number;
  yandexStatusIdx: number;
} {
  // For PSSM and PSMP, prioritize "URL Status" column detection
  let statusKeywords = ["status", "state", "result"];
  if (abbreviation === "PSSM" || abbreviation === "PSMP") {
    statusKeywords = ["url status", "status"];
  }

  return {
    statusIdx: findColumnIndex(headers, statusKeywords),
    marketIdx: findColumnIndex(headers, ["market", "country", "region", "location", "geo"]),
    monthIdx: findColumnIndex(headers, ["month", "date", "period", "time"]),
    contentOwnerIdx: findColumnIndex(headers, ["content owner", "owner", "content_owner", "contentowner", "rights holder", "rightsholder"]),
    urlIdx: findColumnIndex(headers, ["url", "link", "address", "uri"]),
    withIdx: findColumnIndex(headers, ["with", "associated", "linked"]),
    googleStatusIdx: findColumnIndex(headers, ["url status google"]),
    bingStatusIdx: findColumnIndex(headers, ["url status bing"]),
    yandexStatusIdx: findColumnIndex(headers, ["url status yandex"]),
  };
}

function getSheetAbbreviation(sheetName: string): SheetAbbreviation | null {
  const normalized = sheetName.trim();
  const lowerName = normalized.toLowerCase();
  
  // Direct exact match or high confidence substring match
  const sheetLower = lowerName.toLowerCase();
  if (sheetLower.includes("unauthorized search") || sheetLower === "usr" || sheetLower.includes("a.")) return "USR";
  if (sheetLower.includes("ads tutorial") || sheetLower === "atsm" || sheetLower.includes("b1")) return "ATSM";
  if (sheetLower.includes("password sharing-social") || sheetLower.includes("password sharing - social") || sheetLower === "pssm" || sheetLower.includes("c1")) return "PSSM";
  if (sheetLower.includes("password sharing-marketplace") || sheetLower.includes("password sharing - marketplace") || sheetLower === "psmp" || sheetLower.includes("c2")) return "PSMP";

  // Fallback for variations
  if (lowerName.includes("password") && lowerName.includes("social")) return "PSSM";
  if (lowerName.includes("password") && lowerName.includes("market")) return "PSMP";

  return null;
}

interface ProcessSheetResult {
  sheetData: SheetData;
  months: string[];
  markets: string[];
  contentOwners: string[];
}

function processSheet(
  worksheet: XLSX.WorkSheet,
  abbreviation: SheetAbbreviation
): ProcessSheetResult | null {
  const jsonData = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1 });
  
  if (jsonData.length < 2) {
    return {
      sheetData: {
        abbreviation,
        fullName: SHEET_FULL_NAMES[abbreviation],
        records: [],
        totalUrls: 0,
        activeCount: 0,
        removedCount: 0,
      },
      months: [],
      markets: [],
      contentOwners: [],
    };
  }

  const headers = (jsonData[0] as unknown[]).map(h => String(h || ""));
  const columns = detectColumns(headers, abbreviation);

  const records: SheetRecord[] = [];
  const monthsSet = new Set<string>();
  const marketsSet = new Set<string>();
  const contentOwnersSet = new Set<string>();
  
  let activeCount = 0;
  let removedCount = 0;

  const startRow = 1;

  for (let i = startRow; i < jsonData.length; i++) {
    const row = jsonData[i] as unknown[];
    if (!row || row.length === 0) continue;

    // Only skip completely empty rows
    const hasAnyData = row.some(cell => {
      const cellStr = String(cell || "").trim();
      return cellStr !== "" && cellStr !== "null" && cellStr !== "undefined";
    });
    if (!hasAnyData) continue;

    // Get values from detected columns, or use first few columns as fallback
    let statusRaw = columns.statusIdx >= 0 ? String(row[columns.statusIdx] || "") : "";
    let urlRaw = columns.urlIdx >= 0 ? String(row[columns.urlIdx] || "") : "";
    
    // For USR sheet, use Google/Bing/Yandex status columns if available
    if (abbreviation === "USR" && !statusRaw.trim()) {
      const googleStatus = columns.googleStatusIdx >= 0 ? String(row[columns.googleStatusIdx] || "").trim() : "";
      const bingStatus = columns.bingStatusIdx >= 0 ? String(row[columns.bingStatusIdx] || "").trim() : "";
      const yandexStatus = columns.yandexStatusIdx >= 0 ? String(row[columns.yandexStatusIdx] || "").trim() : "";
      
      // Use the first available status from Google, Bing, or Yandex
      statusRaw = googleStatus || bingStatus || yandexStatus;
    }
    
    // If we can't find important columns, try first few columns
    if (!statusRaw && columns.statusIdx === -1 && row[0]) {
      statusRaw = String(row[0]);
    }
    if (!urlRaw && columns.urlIdx === -1 && row[1]) {
      urlRaw = String(row[1]);
    }

    const marketRaw = columns.marketIdx >= 0 ? String(row[columns.marketIdx] || "") : "";
    const monthRaw = columns.monthIdx >= 0 ? String(row[columns.monthIdx] || "") : "";
    const contentOwnerRaw = columns.contentOwnerIdx >= 0 ? String(row[columns.contentOwnerIdx] || "") : "";

    // Skip rows that have neither status nor URL
    if (!statusRaw.trim() && !urlRaw.trim()) continue;

    const status = statusRaw.trim() || "Unknown";
    const normalizedStatus = normalizeStatus(status);

    if (normalizedStatus === "active") activeCount++;
    else if (normalizedStatus === "removed") removedCount++;

    const market = marketRaw.trim() || "Unknown";
    const month = monthRaw.trim() || "";
    const contentOwner = contentOwnerRaw.trim() || "Unknown";

    if (month) monthsSet.add(month);
    if (market && market !== "Unknown") marketsSet.add(market);
    if (contentOwner && contentOwner !== "Unknown") contentOwnersSet.add(contentOwner);

    records.push({
      url: urlRaw.trim(),
      status,
      market,
      month,
      contentOwner,
    });
  }

  const sheetData: SheetData = {
    abbreviation,
    fullName: SHEET_FULL_NAMES[abbreviation],
    records,
    totalUrls: records.length,
    activeCount,
    removedCount,
  };

  return {
    sheetData,
    months: Array.from(monthsSet),
    markets: Array.from(marketsSet),
    contentOwners: Array.from(contentOwnersSet),
  };
}

export function parseExcelFile(buffer: Buffer): WorkbookAnalysis {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  
  const targetSheets: Map<SheetAbbreviation, SheetData> = new Map();
  const allMonths = new Set<string>();
  const allMarkets = new Set<string>();
  const allContentOwners = new Set<string>();

  for (const sheetName of workbook.SheetNames) {
    const abbreviation = getSheetAbbreviation(sheetName);
    if (!abbreviation) continue;

    if (targetSheets.has(abbreviation)) continue;

    const worksheet = workbook.Sheets[sheetName];
    const result = processSheet(worksheet, abbreviation);
    
    if (result) {
      targetSheets.set(abbreviation, result.sheetData);
      
      result.months.forEach(m => allMonths.add(m));
      result.markets.forEach(m => allMarkets.add(m));
      result.contentOwners.forEach(o => allContentOwners.add(o));
    }
  }

  const sheets: SheetData[] = [];
  const sheetOrder: SheetAbbreviation[] = ["USR", "ATSM", "PSSM", "PSMP"];
  
  for (const abbr of sheetOrder) {
    const existingSheet = targetSheets.get(abbr);
    if (existingSheet) {
      sheets.push(existingSheet);
    } else {
      sheets.push({
        abbreviation: abbr,
        fullName: SHEET_FULL_NAMES[abbr],
        records: [],
        totalUrls: 0,
        activeCount: 0,
        removedCount: 0,
      });
    }
  }

  const totalUrls = sheets.reduce((sum, s) => sum + s.totalUrls, 0);
  const activeCount = sheets.reduce((sum, s) => sum + s.activeCount, 0);
  const removedCount = sheets.reduce((sum, s) => sum + s.removedCount, 0);
  const removalRate = totalUrls > 0 ? (removedCount / totalUrls) * 100 : 0;

  const usrSheet = sheets.find(s => s.abbreviation === "USR");
  const atsmSheet = sheets.find(s => s.abbreviation === "ATSM");
  const pssmSheet = sheets.find(s => s.abbreviation === "PSSM");
  const psmpSheet = sheets.find(s => s.abbreviation === "PSMP");

  const usrAtsmCount = (usrSheet?.totalUrls || 0) + (atsmSheet?.totalUrls || 0);
  const pssmPsmpCount = (pssmSheet?.totalUrls || 0) + (psmpSheet?.totalUrls || 0);

  return {
    sheets,
    totalUrls,
    activeCount,
    removedCount,
    removalRate,
    usrAtsmCount,
    pssmPsmpCount,
    months: Array.from(allMonths).sort(),
    markets: Array.from(allMarkets).sort(),
    contentOwners: Array.from(allContentOwners).sort(),
  };
}
