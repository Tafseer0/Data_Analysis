import { CompactFileUpload } from "@/components/file-upload";
import { BarChart3, Calendar, Globe, Users, X } from "lucide-react";
import type { FilterState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string[]) => void;
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
          {/* Months Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-40 justify-between" data-testid="filter-months-trigger">
                  {filters.months.length === 0 ? "All Months" : `${filters.months.length} selected`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuCheckboxItem
                  checked={filters.months.length === 0}
                  onCheckedChange={() => onFilterChange("months", [])}
                >
                  All Months
                </DropdownMenuCheckboxItem>
                {months.map((month) => (
                  <DropdownMenuCheckboxItem
                    key={month}
                    checked={filters.months.includes(month)}
                    onCheckedChange={(checked) => {
                      const updated = checked
                        ? [...filters.months, month]
                        : filters.months.filter(m => m !== month);
                      onFilterChange("months", updated);
                    }}
                  >
                    {month}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {filters.months.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {filters.months.slice(0, 2).map((month) => (
                  <Badge key={month} variant="secondary" className="text-xs">
                    {month}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => onFilterChange("months", filters.months.filter(m => m !== month))}
                    />
                  </Badge>
                ))}
                {filters.months.length > 2 && <Badge variant="secondary" className="text-xs">+{filters.months.length - 2}</Badge>}
              </div>
            )}
          </div>

          {/* Markets Filter */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-40 justify-between" data-testid="filter-markets-trigger">
                  {filters.markets.length === 0 ? "All Markets" : `${filters.markets.length} selected`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuCheckboxItem
                  checked={filters.markets.length === 0}
                  onCheckedChange={() => onFilterChange("markets", [])}
                >
                  All Markets
                </DropdownMenuCheckboxItem>
                {markets.map((market) => (
                  <DropdownMenuCheckboxItem
                    key={market}
                    checked={filters.markets.includes(market)}
                    onCheckedChange={(checked) => {
                      const updated = checked
                        ? [...filters.markets, market]
                        : filters.markets.filter(m => m !== market);
                      onFilterChange("markets", updated);
                    }}
                  >
                    {market}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {filters.markets.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {filters.markets.slice(0, 2).map((market) => (
                  <Badge key={market} variant="secondary" className="text-xs">
                    {market}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => onFilterChange("markets", filters.markets.filter(m => m !== market))}
                    />
                  </Badge>
                ))}
                {filters.markets.length > 2 && <Badge variant="secondary" className="text-xs">+{filters.markets.length - 2}</Badge>}
              </div>
            )}
          </div>

          {/* Content Owners Filter */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-48 justify-between" data-testid="filter-owners-trigger">
                  {filters.contentOwners.length === 0 ? "All Owners" : `${filters.contentOwners.length} selected`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 max-h-60 overflow-y-auto">
                <DropdownMenuCheckboxItem
                  checked={filters.contentOwners.length === 0}
                  onCheckedChange={() => onFilterChange("contentOwners", [])}
                >
                  All Content Owners
                </DropdownMenuCheckboxItem>
                {contentOwners.map((owner) => (
                  <DropdownMenuCheckboxItem
                    key={owner}
                    checked={filters.contentOwners.includes(owner)}
                    onCheckedChange={(checked) => {
                      const updated = checked
                        ? [...filters.contentOwners, owner]
                        : filters.contentOwners.filter(o => o !== owner);
                      onFilterChange("contentOwners", updated);
                    }}
                  >
                    {owner}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {filters.contentOwners.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {filters.contentOwners.slice(0, 1).map((owner) => (
                  <Badge key={owner} variant="secondary" className="text-xs max-w-32 truncate">
                    {owner}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer flex-shrink-0"
                      onClick={() => onFilterChange("contentOwners", filters.contentOwners.filter(o => o !== owner))}
                    />
                  </Badge>
                ))}
                {filters.contentOwners.length > 1 && <Badge variant="secondary" className="text-xs">+{filters.contentOwners.length - 1}</Badge>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
