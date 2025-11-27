import { AppleCard } from "@/components/admin/AppleCard";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertCircle } from "lucide-react";

interface DBSVettingCardProps {
  hasDBS: string;
  dbsNumber?: string;
  dbsEnhanced?: string;
  dbsUpdate?: string;
  offenceHistory: string;
}

export const DBSVettingCard = ({
  hasDBS,
  dbsNumber,
  dbsEnhanced,
  dbsUpdate,
  offenceHistory,
}: DBSVettingCardProps) => {
  return (
    <AppleCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">DBS & Vetting</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">
            DBS Certificate
          </div>
          <Badge variant={hasDBS === "Yes" ? "default" : "secondary"}>
            {hasDBS === "Yes" ? "Has DBS" : "No DBS"}
          </Badge>
        </div>

        {hasDBS === "Yes" && (
          <>
            {dbsNumber && (
              <div className="rounded-lg bg-muted/30 p-3">
                <div className="text-xs text-muted-foreground mb-1">Certificate Number</div>
                <div className="text-sm font-medium font-mono">{dbsNumber}</div>
              </div>
            )}

            <div className="flex gap-2">
              {dbsEnhanced === "Yes" && (
                <Badge variant="outline" className="text-xs">
                  Enhanced
                </Badge>
              )}
              {dbsUpdate === "Yes" && (
                <Badge variant="outline" className="text-xs">
                  Update Service
                </Badge>
              )}
            </div>
          </>
        )}

        {offenceHistory === "Yes" && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs font-medium text-amber-900 dark:text-amber-100">
                Offence history declared
              </div>
            </div>
          </div>
        )}
      </div>
    </AppleCard>
  );
};
