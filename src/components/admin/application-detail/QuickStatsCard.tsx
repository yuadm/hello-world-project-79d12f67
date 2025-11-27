import { AppleCard } from "@/components/admin/AppleCard";
import { Badge } from "@/components/ui/badge";
import { Calendar, Briefcase, AlertCircle } from "lucide-react";

interface QuickStatsCardProps {
  addressHistoryYears: number;
  employmentGaps?: string;
  hasGaps: boolean;
}

export const QuickStatsCard = ({
  addressHistoryYears,
  employmentGaps,
  hasGaps,
}: QuickStatsCardProps) => {
  return (
    <AppleCard className="p-6">
      <h3 className="text-lg font-semibold tracking-tight mb-4">Quick Stats</h3>
      
      <div className="space-y-4">
        <div className="rounded-lg bg-primary/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Address History</span>
          </div>
          <div className="text-2xl font-bold tracking-tight">
            {addressHistoryYears} years
          </div>
        </div>

        {hasGaps && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-amber-900 dark:text-amber-100 mb-1">
                  Gaps Identified
                </div>
                {employmentGaps && (
                  <div className="text-xs text-amber-700 dark:text-amber-200">
                    {employmentGaps}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!hasGaps && (
          <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-900 dark:text-green-100">
                Complete History
              </span>
            </div>
          </div>
        )}
      </div>
    </AppleCard>
  );
};
