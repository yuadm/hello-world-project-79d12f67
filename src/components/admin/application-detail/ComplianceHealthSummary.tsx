import { AppleCard } from "@/components/admin/AppleCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ComplianceHealthSummaryProps {
  applicationId: string;
  householdCompliance: {
    total: number;
    compliant: number;
    pending: number;
    overdue: number;
  };
  assistantCompliance: {
    total: number;
    compliant: number;
    pending: number;
    overdue: number;
  };
}

export const ComplianceHealthSummary = ({
  applicationId,
  householdCompliance,
  assistantCompliance,
}: ComplianceHealthSummaryProps) => {
  const navigate = useNavigate();
  
  const totalMembers = householdCompliance.total + assistantCompliance.total;
  const totalCompliant = householdCompliance.compliant + assistantCompliance.compliant;
  const totalPending = householdCompliance.pending + assistantCompliance.pending;
  const totalOverdue = householdCompliance.overdue + assistantCompliance.overdue;
  
  const complianceScore = totalMembers > 0 ? Math.round((totalCompliant / totalMembers) * 100) : 100;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-amber-600";
    return "text-destructive";
  };

  return (
    <AppleCard className="p-8">
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight mb-1">
            Compliance Health
          </h2>
          <p className="text-sm text-muted-foreground">
            Overview of DBS and compliance status
          </p>
        </div>
        
        <div className="text-right">
          <div className={`text-4xl font-bold tracking-tight ${getScoreColor(complianceScore)}`}>
            {complianceScore}%
          </div>
          <div className="text-xs text-muted-foreground">Overall Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-muted/30 p-4">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Household Members
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold tracking-tight">
              {householdCompliance.compliant}/{householdCompliance.total}
            </span>
            <Badge variant="secondary" className="text-xs">
              {householdCompliance.pending} pending
            </Badge>
          </div>
        </div>

        <div className="rounded-xl bg-muted/30 p-4">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Assistants
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold tracking-tight">
              {assistantCompliance.compliant}/{assistantCompliance.total}
            </span>
            <Badge variant="secondary" className="text-xs">
              {assistantCompliance.pending} pending
            </Badge>
          </div>
        </div>
      </div>

      {totalOverdue > 0 && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm mb-1">Critical Alert</div>
              <div className="text-sm text-muted-foreground">
                {totalOverdue} member{totalOverdue !== 1 ? "s" : ""} with overdue DBS checks
              </div>
            </div>
          </div>
        </div>
      )}

      <Button 
        onClick={() => navigate(`/admin/applications/${applicationId}/compliance`)}
        className="w-full rounded-xl gap-2"
        variant="outline"
      >
        Manage Compliance
        <ExternalLink className="h-4 w-4" />
      </Button>
    </AppleCard>
  );
};
