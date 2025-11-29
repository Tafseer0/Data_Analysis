import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompactFileUpload } from "@/components/file-upload";
import { BarChart3, Calendar, Globe, Users } from "lucide-react";
import type { FilterState } from "@shared/schema";

interface DashboardHeaderProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  months: string[];
  markets: string[];
  contentOwners: string[];
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export function DashboardHeader({
  filters,
  onFilterChange,
  months,
  markets,
  contentOwners,
  onFileUpload,
  isUploading,
}: DashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Workbook Analysis Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Comprehensive analysis of your Excel workbook data
              </p>
            </div>
          </div>
          <CompactFileUpload onFileUpload={onFileUpload} isUploading={isUploading} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={filters.month} onValueChange={(v) => onFilterChange("month", v)}>
              <SelectTrigger className="w-40" data-testid="select-filter-month">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select value={filters.market} onValueChange={(v) => onFilterChange("market", v)}>
              <SelectTrigger className="w-40" data-testid="select-filter-market">
                <SelectValue placeholder="All Markets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                {markets.map((market) => (
                  <SelectItem key={market} value={market}>{market}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Select value={filters.contentOwner} onValueChange={(v) => onFilterChange("contentOwner", v)}>
              <SelectTrigger className="w-48" data-testid="select-filter-content-owner">
                <SelectValue placeholder="All Content Owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Content Owners</SelectItem>
                {contentOwners.map((owner) => (
                  <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
