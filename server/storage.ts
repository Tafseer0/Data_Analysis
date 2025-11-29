import type { WorkbookAnalysis, SheetData, SheetRecord, SheetAbbreviation } from "@shared/schema";
import { SHEET_MAPPINGS, SHEET_FULL_NAMES } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getWorkbookData(): Promise<WorkbookAnalysis | null>;
  setWorkbookData(data: WorkbookAnalysis): Promise<void>;
  clearWorkbookData(): Promise<void>;
}

export class MemStorage implements IStorage {
  private workbookData: WorkbookAnalysis | null = null;

  async getWorkbookData(): Promise<WorkbookAnalysis | null> {
    return this.workbookData;
  }

  async setWorkbookData(data: WorkbookAnalysis): Promise<void> {
    this.workbookData = data;
  }

  async clearWorkbookData(): Promise<void> {
    this.workbookData = null;
  }
}

export const storage = new MemStorage();
