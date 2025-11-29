import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { parseExcelFile } from "./excel-parser";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
      "application/octet-stream",
    ];
    const allowedExtensions = [".xlsx", ".xls", ".csv"];
    
    const hasValidExtension = allowedExtensions.some(ext => 
      file.originalname.toLowerCase().endsWith(ext)
    );
    
    if (allowedMimes.includes(file.mimetype) || hasValidExtension) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Please upload an Excel file (.xlsx, .xls) or CSV file."));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const workbookData = parseExcelFile(req.file.buffer);
      
      if (workbookData.sheets.every(s => s.totalUrls === 0)) {
        return res.status(400).json({ 
          message: "No valid data found in the uploaded file. Please ensure your Excel file contains sheets named 'Unauthorized Search Result', 'Ads Tutorials- Social Media', 'Password Sharing-Social Med.', or 'Password Sharing-Marketplace'." 
        });
      }

      await storage.setWorkbookData(workbookData);
      
      return res.json({ 
        success: true, 
        message: "File processed successfully",
        summary: {
          totalUrls: workbookData.totalUrls,
          activeCount: workbookData.activeCount,
          removedCount: workbookData.removedCount,
          sheetsFound: workbookData.sheets.filter(s => s.totalUrls > 0).map(s => s.abbreviation),
        }
      });
    } catch (error) {
      console.error("Error processing file:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Error processing file" 
      });
    }
  });

  app.get("/api/workbook", async (_req: Request, res: Response) => {
    try {
      const workbookData = await storage.getWorkbookData();
      
      if (!workbookData) {
        return res.status(404).json({ message: "No workbook data available. Please upload a file first." });
      }
      
      return res.json(workbookData);
    } catch (error) {
      console.error("Error fetching workbook data:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Error fetching workbook data" 
      });
    }
  });

  app.delete("/api/workbook", async (_req: Request, res: Response) => {
    try {
      await storage.clearWorkbookData();
      return res.json({ success: true, message: "Workbook data cleared" });
    } catch (error) {
      console.error("Error clearing workbook data:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Error clearing workbook data" 
      });
    }
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File is too large. Maximum size is 200MB." });
      }
      return res.status(400).json({ message: err.message });
    }
    
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    return res.status(500).json({ message: "An unexpected error occurred" });
  });

  return httpServer;
}
