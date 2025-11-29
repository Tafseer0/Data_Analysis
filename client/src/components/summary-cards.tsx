import { Card, CardContent } from "@/components/ui/card";
import { Link2, TrendingUp, TrendingDown, Percent, FileText, ShieldCheck } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
  textColor?: string;
}

function SummaryCard({ title, value, subtitle, icon, gradient, textColor = "text-white" }: SummaryCardProps) {
  return (
    <Card className={`relative overflow-hidden ${gradient}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={`text-sm font-medium ${textColor} opacity-90`}>{title}</p>
            <p className={`text-3xl font-bold ${textColor}`} data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className={`text-xs ${textColor} opacity-75`}>{subtitle}</p>
            )}
          </div>
          <div className={`h-12 w-12 rounded-xl ${textColor === "text-white" ? "bg-white/20" : "bg-black/10"} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface OverallSummaryProps {
  totalUrls: number;
  activeCount: number;
  removedCount: number;
  removalRate: number;
  usrCount: number;
  atsmCount: number;
  pssmCount: number;
  psmpCount: number;
}

export function OverallSummary({
  totalUrls,
  activeCount,
  removedCount,
  removalRate,
  usrCount,
  atsmCount,
  pssmCount,
  psmpCount,
}: OverallSummaryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Overall Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total URLs"
            value={totalUrls}
            subtitle="Across all sheets"
            icon={<Link2 className="h-6 w-6 text-white" />}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"
          />
          <SummaryCard
            title="Active / Up"
            value={activeCount}
            subtitle="Currently live URLs"
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            gradient="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700"
          />
          <SummaryCard
            title="Removed / Down"
            value={removedCount}
            subtitle="Successfully taken down"
            icon={<TrendingDown className="h-6 w-6 text-white" />}
            gradient="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700"
          />
          <SummaryCard
            title="Removal Rate"
            value={`${removalRate.toFixed(1)}%`}
            subtitle="Success percentage"
            icon={<Percent className="h-6 w-6 text-white" />}
            gradient="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white opacity-90">USR</p>
                <p className="text-2xl font-bold text-white" data-testid="text-usr-count">{usrCount.toLocaleString()}</p>
                <p className="text-xs text-white opacity-75">
                  Unauthorized Search
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white opacity-90">ATSM</p>
                <p className="text-2xl font-bold text-white" data-testid="text-atsm-count">{atsmCount.toLocaleString()}</p>
                <p className="text-xs text-white opacity-75">
                  Ads Tutorials
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white opacity-90">PSSM</p>
                <p className="text-2xl font-bold text-white" data-testid="text-pssm-count">{pssmCount.toLocaleString()}</p>
                <p className="text-xs text-white opacity-75">
                  Password Sharing Social
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white opacity-90">PSMP</p>
                <p className="text-2xl font-bold text-white" data-testid="text-psmp-count">{psmpCount.toLocaleString()}</p>
                <p className="text-xs text-white opacity-75">
                  Password Sharing Marketplace
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
