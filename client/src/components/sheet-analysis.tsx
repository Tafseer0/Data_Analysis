import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet } from "lucide-react";
import type { SheetData, SheetAbbreviation } from "@shared/schema";
import { SHEET_FULL_NAMES } from "@shared/schema";

interface SheetCardProps {
  sheet: SheetData;
}

function SheetCard({ sheet }: SheetCardProps) {
  const getSheetColor = (abbr: SheetAbbreviation): string => {
    switch (abbr) {
      case "USR": return "from-blue-500 to-blue-600";
      case "ATSM": return "from-indigo-500 to-indigo-600";
      case "PSSM": return "from-violet-500 to-violet-600";
      case "PSMP": return "from-purple-500 to-purple-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <Card className="overflow-hidden" data-testid={`card-sheet-${sheet.abbreviation.toLowerCase()}`}>
      <div className={`h-2 bg-gradient-to-r ${getSheetColor(sheet.abbreviation)}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${getSheetColor(sheet.abbreviation)} flex items-center justify-center`}>
              <FileSpreadsheet className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{sheet.abbreviation}</CardTitle>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs font-medium">
            {sheet.totalUrls.toLocaleString()} URLs
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {SHEET_FULL_NAMES[sheet.abbreviation]}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-3">
          <div className="flex-1 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Active</p>
            <p className="text-xl font-bold text-green-700 dark:text-green-300" data-testid={`text-active-${sheet.abbreviation.toLowerCase()}`}>
              {sheet.activeCount.toLocaleString()}
            </p>
          </div>
          <div className="flex-1 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900">
            <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Removed</p>
            <p className="text-xl font-bold text-red-700 dark:text-red-300" data-testid={`text-removed-${sheet.abbreviation.toLowerCase()}`}>
              {sheet.removedCount.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SheetAnalysisProps {
  sheets: SheetData[];
}

export function SheetAnalysis({ sheets }: SheetAnalysisProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Sheet-wise Analysis</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sheets.map((sheet) => (
          <SheetCard key={sheet.abbreviation} sheet={sheet} />
        ))}
      </div>
    </div>
  );
}
