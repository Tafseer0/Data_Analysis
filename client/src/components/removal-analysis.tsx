import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CirclePercent, TrendingDown, Link2, Calculator, TrendingUp } from "lucide-react";
import type { SheetData, SheetAbbreviation } from "@shared/schema";
import { getRemovalRate } from "@/lib/excel-utils";

interface RemovalCardProps {
  sheet: SheetData;
}

function RemovalCard({ sheet }: RemovalCardProps) {
  const removalRate = getRemovalRate(sheet.removedCount, sheet.totalUrls);
  
  const getProgressColor = (rate: number): string => {
    if (rate >= 80) return "bg-green-500";
    if (rate >= 60) return "bg-emerald-500";
    if (rate >= 40) return "bg-yellow-500";
    if (rate >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  const getGradient = (rate: number): string => {
    if (rate >= 80) return "from-green-500 to-green-600";
    if (rate >= 60) return "from-emerald-500 to-emerald-600";
    if (rate >= 40) return "from-yellow-500 to-yellow-600";
    if (rate >= 20) return "from-orange-500 to-orange-600";
    return "from-red-500 to-red-600";
  };

  const getBgGradient = (rate: number): string => {
    if (rate >= 80) return "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800";
    if (rate >= 60) return "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800";
    if (rate >= 40) return "from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200 dark:border-yellow-800";
    if (rate >= 20) return "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-800";
    return "from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-red-200 dark:border-red-800";
  };

  return (
    <Card 
      className={`bg-gradient-to-br ${getBgGradient(removalRate)} overflow-hidden`}
      data-testid={`card-removal-${sheet.abbreviation.toLowerCase()}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{sheet.abbreviation}</CardTitle>
          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${getGradient(removalRate)} flex items-center justify-center`}>
            <CirclePercent className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-4xl font-bold" data-testid={`text-removal-rate-${sheet.abbreviation.toLowerCase()}`}>
            {removalRate.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">Removal Rate</p>
        </div>

        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressColor(removalRate)} transition-all duration-500 rounded-full`}
            style={{ width: `${removalRate}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-2 bg-white/50 dark:bg-black/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <TrendingDown className="h-3 w-3" />
              <span>Removed</span>
            </div>
            <p className="text-lg font-semibold" data-testid={`text-removal-removed-${sheet.abbreviation.toLowerCase()}`}>
              {sheet.removedCount.toLocaleString()}
            </p>
          </div>
          <div className="p-2 bg-white/50 dark:bg-black/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Link2 className="h-3 w-3" />
              <span>Total</span>
            </div>
            <p className="text-lg font-semibold" data-testid={`text-removal-total-${sheet.abbreviation.toLowerCase()}`}>
              {sheet.totalUrls.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-current/10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calculator className="h-3 w-3" />
            <span className="font-mono">
              ({sheet.removedCount} / {sheet.totalUrls}) x 100 = {removalRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RemovalAnalysisProps {
  sheets: SheetData[];
}

export function RemovalAnalysis({ sheets }: RemovalAnalysisProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-orange-600 dark:text-orange-400">Removal Percentage Analysis</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sheets.map((sheet) => (
          <RemovalCard key={sheet.abbreviation} sheet={sheet} />
        ))}
      </div>
    </div>
  );
}
