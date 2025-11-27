import { AppleCard } from "@/components/admin/AppleCard";
import { Users, Mail } from "lucide-react";

interface ReferencesCardProps {
  reference1Name: string;
  reference1Relationship: string;
  reference1Contact: string;
  reference2Name: string;
  reference2Relationship: string;
  reference2Contact: string;
}

export const ReferencesCard = ({
  reference1Name,
  reference1Relationship,
  reference1Contact,
  reference2Name,
  reference2Relationship,
  reference2Contact,
}: ReferencesCardProps) => {
  const ReferenceItem = ({ name, relationship, contact }: { name: string; relationship: string; contact: string }) => (
    <div className="rounded-lg bg-muted/30 p-4">
      <div className="font-medium mb-2">{name || "N/A"}</div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <div>Relationship: {relationship || "N/A"}</div>
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3" />
          {contact || "N/A"}
        </div>
      </div>
    </div>
  );

  return (
    <AppleCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">References</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">Reference 1</div>
          <ReferenceItem
            name={reference1Name}
            relationship={reference1Relationship}
            contact={reference1Contact}
          />
        </div>

        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">Reference 2</div>
          <ReferenceItem
            name={reference2Name}
            relationship={reference2Relationship}
            contact={reference2Contact}
          />
        </div>
      </div>
    </AppleCard>
  );
};
