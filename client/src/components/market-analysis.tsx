import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe, TrendingUp, TrendingDown, Link2, Filter } from "lucide-react";
import type { SheetData, MarketData, SheetAbbreviation } from "@shared/schema";
import { calculateMarketData, filterRecords } from "@/lib/excel-utils";

interface MarketAnalysisProps {
  sheets: SheetData[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  allCountries: string[];
}

export function MarketAnalysis({ 
  sheets, 
  selectedCountry, 
  onCountryChange, 
  allCountries 
}: MarketAnalysisProps) {
  const [activeSheet, setActiveSheet] = useState<SheetAbbreviation>("USR");

  const currentSheet = sheets.find(s => s.abbreviation === activeSheet);
  
  const filteredRecords = currentSheet 
    ? filterRecords(
        currentSheet.records,
        [],
        selectedCountry === "all" ? [] : [selectedCountry],
        []
      )
    : [];
  
  const marketData = calculateMarketData(filteredRecords);
  
  const sheetTotalUrls = filteredRecords.length;
  const sheetActiveCount = marketData.reduce((sum, m) => sum + m.activeCount, 0);
  const sheetRemovedCount = marketData.reduce((sum, m) => sum + m.removedCount, 0);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 border border-green-100 dark:border-green-900/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-green-900 dark:text-green-100">Market Scanned Analysis</h2>
            <p className="text-sm text-green-700 dark:text-green-300">Breakdown by country and region</p>
          </div>
        </div>
      </div>

      <Tabs value={activeSheet} onValueChange={(v) => setActiveSheet(v as SheetAbbreviation)} className="mb-6">
        <TabsList className="grid w-full grid-cols-4 bg-green-100 dark:bg-green-900/40">
          {(["USR", "ATSM", "PSSM", "PSMP"] as SheetAbbreviation[]).map((abbr) => (
            <TabsTrigger 
              key={abbr} 
              value={abbr}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-green-800 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-100"
              data-testid={`tab-market-${abbr.toLowerCase()}`}
            >
              {abbr}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white/80 dark:bg-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-800 flex items-center justify-center">
              <Link2 className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">Sheet Total URLs</p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200" data-testid="text-market-total-urls">
                {sheetTotalUrls.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
            </div>
            <div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Total Active</p>
              <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200" data-testid="text-market-active">
                {sheetActiveCount.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">Total Removed</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300" data-testid="text-market-removed">
                {sheetRemovedCount.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">Filter by Country</span>
        </div>
        <Select value={selectedCountry} onValueChange={onCountryChange}>
          <SelectTrigger 
            className="w-full sm:w-64 mt-2 bg-white dark:bg-green-900/40 border-green-200 dark:border-green-700"
            data-testid="select-market-country"
          >
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {allCountries.map((country) => (
              <SelectItem key={country} value={country}>{country}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-white/80 dark:bg-green-900/30 border-green-200 dark:border-green-800 overflow-hidden">
        <ScrollArea className="max-h-96">
          <Table>
            <TableHeader className="bg-green-50 dark:bg-green-900/50 sticky top-0">
              <TableRow>
                <TableHead className="text-green-700 dark:text-green-300 font-semibold min-w-32">Market Scanned</TableHead>
                <TableHead className="text-green-700 dark:text-green-300 font-semibold text-center min-w-28">Active</TableHead>
                <TableHead className="text-green-700 dark:text-green-300 font-semibold text-center min-w-28">Removed</TableHead>
                <TableHead className="text-green-700 dark:text-green-300 font-semibold text-right min-w-32">Ratio</TableHead>
                <TableHead className="text-green-700 dark:text-green-300 font-semibold text-right min-w-28">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No market data available
                  </TableCell>
                </TableRow>
              ) : (
                marketData
                  .sort((a, b) => b.totalUrls - a.totalUrls)
                  .map((market, idx) => {
                    const activePercent = market.totalUrls > 0 ? (market.activeCount / market.totalUrls) * 100 : 0;
                    const removedPercent = 100 - activePercent;
                    return (
                      <TableRow key={`${market.market}-${idx}`} data-testid={`row-market-${idx}`} className="hover:bg-green-50/50 dark:hover:bg-green-900/20">
                        <TableCell className="font-medium text-green-900 dark:text-green-100">{market.market}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700 text-xs">
                              {market.activeCount.toLocaleString()}
                            </Badge>
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">{activePercent.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Badge variant="outline" className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700 text-xs">
                              {market.removedCount.toLocaleString()}
                            </Badge>
                            <span className="text-xs text-red-600 dark:text-red-400 font-medium">{removedPercent.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end pr-2">
                            <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-400"
                                style={{ width: `${activePercent}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-green-700 dark:text-green-300 w-8 text-right">
                              {activePercent.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-green-900 dark:text-green-100">{market.totalUrls.toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}
