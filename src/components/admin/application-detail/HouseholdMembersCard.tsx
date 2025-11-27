import { AppleCard } from "@/components/admin/AppleCard";
import { Badge } from "@/components/ui/badge";
import { Users, Baby } from "lucide-react";

interface Person {
  fullName: string;
  relationship: string;
  dob: string;
}

interface HouseholdMembersCardProps {
  adults: Person[];
  children: Person[];
}

export const HouseholdMembersCard = ({ adults, children }: HouseholdMembersCardProps) => {
  const totalMembers = (adults?.length || 0) + (children?.length || 0);

  const MemberItem = ({ member, type }: { member: Person; type: "adult" | "child" }) => (
    <div className="flex items-start justify-between gap-3 rounded-lg bg-muted/30 p-3">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm mb-1">{member.fullName}</div>
        <div className="text-xs text-muted-foreground">
          {member.relationship} • DOB: {member.dob}
        </div>
      </div>
      <Badge variant="outline" className="text-xs flex-shrink-0">
        {type === "adult" ? "Adult" : "Child"}
      </Badge>
    </div>
  );

  return (
    <AppleCard className="p-6 col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">Household Members</h3>
        </div>
        <Badge variant="secondary">{totalMembers} total</Badge>
      </div>
      
      {totalMembers === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No household members listed</p>
        </div>
      ) : (
        <div className="space-y-3">
          {adults && adults.length > 0 && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Users className="h-3 w-3" />
                Adults ({adults.length})
              </div>
              <div className="space-y-2">
                {adults.map((adult, idx) => (
                  <MemberItem key={idx} member={adult} type="adult" />
                ))}
              </div>
            </div>
          )}

          {children && children.length > 0 && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Baby className="h-3 w-3" />
                Children ({children.length})
              </div>
              <div className="space-y-2">
                {children.map((child, idx) => (
                  <MemberItem key={idx} member={child} type="child" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AppleCard>
  );
};
