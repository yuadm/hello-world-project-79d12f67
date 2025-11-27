import { AppleCard } from "@/components/admin/AppleCard";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Mail, Phone } from "lucide-react";

interface Assistant {
  firstName: string;
  lastName: string;
  dob: string;
  role: string;
  email: string;
  phone: string;
}

interface AssistantsCardProps {
  assistants: Assistant[];
}

export const AssistantsCard = ({ assistants }: AssistantsCardProps) => {
  const AssistantItem = ({ assistant }: { assistant: Assistant }) => (
    <div className="rounded-lg bg-muted/30 p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="font-medium text-sm">
          {assistant.firstName} {assistant.lastName}
        </div>
        <Badge variant="outline" className="text-xs flex-shrink-0">
          {assistant.role || "Assistant"}
        </Badge>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <div>DOB: {assistant.dob}</div>
        {assistant.email && (
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {assistant.email}
          </div>
        )}
        {assistant.phone && (
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {assistant.phone}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AppleCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">Assistants</h3>
        </div>
        <Badge variant="secondary">{assistants?.length || 0}</Badge>
      </div>
      
      {!assistants || assistants.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No assistants listed</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assistants.map((assistant, idx) => (
            <AssistantItem key={idx} assistant={assistant} />
          ))}
        </div>
      )}
    </AppleCard>
  );
};
