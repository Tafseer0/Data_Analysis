import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Crown, Trophy, Award, User, Circle } from "lucide-react";
import type { SheetData, ContentOwnerData, SheetAbbreviation } from "@shared/schema";
import { calculateContentOwners, filterRecords } from "@/lib/excel-utils";

interface ContentOwnerAnalysisProps {
  sheets: SheetData[];
  allContentOwners: ContentOwnerData[];
}

export function ContentOwnerAnalysis({ sheets, allContentOwners }: ContentOwnerAnalysisProps) {
  const totalOwners = allContentOwners.length;
  const topOwner = allContentOwners[0];
  const top5Owners = allContentOwners.slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Content Owner Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-3 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <Users className="h-7 w-7 text-white" />
            </div>
            <p className="text-sm font-medium text-white/90">Total Owners</p>
            <p className="text-4xl font-bold text-white mt-2" data-testid="text-total-owners">{totalOwners}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <Crown className="h-7 w-7 text-white" />
            </div>
            <p className="text-sm font-medium text-white/90">Top Owner</p>
            {topOwner ? (
              <>
                <p className="text-lg font-bold text-white mt-2 text-center truncate max-w-full" data-testid="text-top-owner-name">
                  {topOwner.name}
                </p>
                <Badge className="mt-2 bg-white/20 text-white border-0">
                  {topOwner.count.toLocaleString()} URLs
                </Badge>
              </>
            ) : (
              <p className="text-white/70 mt-2">No data</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-base">Top Content Owners</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {top5Owners.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No content owners found</p>
              ) : (
                top5Owners.map((owner, idx) => (
                  <div 
                    key={`${owner.name}-${idx}`} 
                    className="flex items-center gap-3 p-2 rounded-lg hover-elevate"
                    data-testid={`row-top-owner-${idx}`}
                  >
                    <div className={`
                      h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-white
                      ${idx === 0 ? "bg-amber-500" : idx === 1 ? "bg-gray-400" : idx === 2 ? "bg-amber-700" : "bg-gray-300 text-gray-700"}
                    `}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{owner.name}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {owner.count.toLocaleString()} URLs
                    </Badge>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {owner.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface DetailedContentOwnerProps {
  sheets: SheetData[];
}

export function DetailedContentOwnerBreakdown({ sheets }: DetailedContentOwnerProps) {
  const [activeSheet, setActiveSheet] = useState<SheetAbbreviation | "all">("all");

  const getContentOwners = (): ContentOwnerData[] => {
    if (activeSheet === "all") {
      const ownerMap = new Map<string, number>();
      let total = 0;
      
      sheets.forEach(sheet => {
        sheet.records.forEach(record => {
          const owner = record.contentOwner || "Unknown";
          ownerMap.set(owner, (ownerMap.get(owner) || 0) + 1);
          total++;
        });
      });

      return Array.from(ownerMap.entries())
        .map(([name, count]) => ({
          name,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count);
    }

    const sheet = sheets.find(s => s.abbreviation === activeSheet);
    if (!sheet) return [];
    return calculateContentOwners(sheet.records);
  };

  const contentOwners = getContentOwners();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Detailed Content Owner Breakdown</h2>
      
      <Tabs value={activeSheet} onValueChange={(v) => setActiveSheet(v as SheetAbbreviation | "all")} className="mb-4">
        <TabsList className="bg-purple-100 dark:bg-purple-900/40">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-100"
            data-testid="tab-owner-all"
          >
            All Sheets
          </TabsTrigger>
          {(["USR", "ATSM", "PSSM", "PSMP"] as SheetAbbreviation[]).map((abbr) => (
            <TabsTrigger 
              key={abbr} 
              value={abbr}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-100"
              data-testid={`tab-owner-${abbr.toLowerCase()}`}
            >
              {abbr}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <ScrollArea className="max-h-96">
          <Table>
            <TableHeader className="bg-purple-50 dark:bg-purple-900/30 sticky top-0">
              <TableRow>
                <TableHead className="text-purple-700 dark:text-purple-300 font-semibold">Content Owner</TableHead>
                <TableHead className="text-purple-700 dark:text-purple-300 font-semibold text-right">Count</TableHead>
                <TableHead className="text-purple-700 dark:text-purple-300 font-semibold text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentOwners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No content owner data available
                  </TableCell>
                </TableRow>
              ) : (
                contentOwners.map((owner, idx) => (
                  <TableRow key={`${owner.name}-${idx}`} data-testid={`row-owner-${idx}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Circle className="h-2 w-2 fill-purple-500 text-purple-500" />
                        <span className="font-medium">{owner.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                        {owner.count.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {owner.percentage.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}
