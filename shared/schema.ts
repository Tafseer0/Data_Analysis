import { z } from "zod";

export const SHEET_MAPPINGS = {
  "Unauthorized Search Result": "USR",
  "Ads Tutorials- Social Media": "ATSM",
  "Password Sharing-Social Med.": "PSSM",
  "Password Sharing-Marketplace": "PSMP",
} as const;

export const SHEET_FULL_NAMES = {
  USR: "Unauthorized Search Result",
  ATSM: "Ads Tutorials- Social Media",
  PSSM: "Password Sharing-Social Med.",
  PSMP: "Password Sharing-Marketplace",
} as const;

export type SheetAbbreviation = keyof typeof SHEET_FULL_NAMES;

export const sheetRecordSchema = z.object({
  url: z.string().optional(),
  status: z.string(),
  market: z.string().optional(),
  month: z.string().optional(),
  contentOwner: z.string().optional(),
});

export type SheetRecord = z.infer<typeof sheetRecordSchema>;

export const sheetDataSchema = z.object({
  abbreviation: z.enum(["USR", "ATSM", "PSSM", "PSMP"]),
  fullName: z.string(),
  records: z.array(sheetRecordSchema),
  totalUrls: z.number(),
  activeCount: z.number(),
  removedCount: z.number(),
});

export type SheetData = z.infer<typeof sheetDataSchema>;

export const marketDataSchema = z.object({
  market: z.string(),
  activeCount: z.number(),
  removedCount: z.number(),
  totalUrls: z.number(),
});

export type MarketData = z.infer<typeof marketDataSchema>;

export const contentOwnerDataSchema = z.object({
  name: z.string(),
  count: z.number(),
  percentage: z.number(),
});

export type ContentOwnerData = z.infer<typeof contentOwnerDataSchema>;

export const workbookAnalysisSchema = z.object({
  sheets: z.array(sheetDataSchema),
  totalUrls: z.number(),
  activeCount: z.number(),
  removedCount: z.number(),
  removalRate: z.number(),
  usrAtsmCount: z.number(),
  pssmPsmpCount: z.number(),
  months: z.array(z.string()),
  markets: z.array(z.string()),
  contentOwners: z.array(z.string()),
});

export type WorkbookAnalysis = z.infer<typeof workbookAnalysisSchema>;

export const filterStateSchema = z.object({
  months: z.array(z.string()),
  markets: z.array(z.string()),
  contentOwners: z.array(z.string()),
});

export type FilterState = z.infer<typeof filterStateSchema>;

export const users = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
});

export const insertUserSchema = users.pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof users>;
