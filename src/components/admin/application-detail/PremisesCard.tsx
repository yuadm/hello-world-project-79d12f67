import { AppleCard } from "@/components/admin/AppleCard";
import { Home, Trees, Dog, CheckCircle2, XCircle } from "lucide-react";

interface PremisesCardProps {
  ownership: string;
  outdoorSpace: string;
  pets: string;
  petsDetails?: string;
}

export const PremisesCard = ({
  ownership,
  outdoorSpace,
  pets,
  petsDetails,
}: PremisesCardProps) => {
  return (
    <AppleCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Home className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">Premises</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Ownership
          </div>
          <div className="text-sm font-medium">{ownership || "N/A"}</div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
          <div className="flex items-center gap-2">
            <Trees className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Outdoor Space</span>
          </div>
          {outdoorSpace === "Yes" ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
            <div className="flex items-center gap-2">
              <Dog className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Pets</span>
            </div>
            {pets === "Yes" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          
          {pets === "Yes" && petsDetails && (
            <div className="mt-2 text-xs text-muted-foreground p-3 rounded-lg bg-muted/20">
              {petsDetails}
            </div>
          )}
        </div>
      </div>
    </AppleCard>
  );
};
