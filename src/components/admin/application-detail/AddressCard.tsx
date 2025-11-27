import { AppleCard } from "@/components/admin/AppleCard";
import { Home, Calendar } from "lucide-react";

interface AddressCardProps {
  address: {
    line1: string;
    line2?: string;
    town: string;
    postcode: string;
  };
  moveIn: string;
}

export const AddressCard = ({ address, moveIn }: AddressCardProps) => {
  return (
    <AppleCard className="p-6">
      <h3 className="text-lg font-semibold tracking-tight mb-4">Current Address</h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
            <Home className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium leading-relaxed">
              {address.line1}
              {address.line2 && <><br />{address.line2}</>}
              <br />{address.town}
              <br />{address.postcode}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-muted-foreground mb-0.5">
              Moved In
            </div>
            <div className="text-sm font-medium">{moveIn || "N/A"}</div>
          </div>
        </div>
      </div>
    </AppleCard>
  );
};
