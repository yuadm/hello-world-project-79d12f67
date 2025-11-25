import { Badge } from "@/components/ui/badge";

interface ConnectionBannerProps {
  applicantName?: string;
  applicantAddress?: any;
  memberName?: string;
}

export function ConnectionBanner({ applicantName, applicantAddress, memberName }: ConnectionBannerProps) {
  return (
    <div className="border-[3px] border-[hsl(var(--govuk-blue))] bg-[hsl(var(--govuk-inset-blue-bg))] p-5 mb-8 no-print">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-base font-bold text-[hsl(var(--govuk-black))] mb-2">
            🔒 Connected to Childminder Registration
          </p>
          <p className="text-sm text-[hsl(var(--govuk-text-secondary))] mb-1">
            {applicantName && (
              <>
                <strong className="text-[hsl(var(--govuk-black))]">{applicantName}</strong>
                {applicantAddress && (
                  <span className="ml-1">
                    - {applicantAddress.line1}, {applicantAddress.town}
                  </span>
                )}
              </>
            )}
          </p>
          {memberName && (
            <p className="text-sm text-[hsl(var(--govuk-black))] mt-2">
              This form is for: <strong>{memberName}</strong>
            </p>
          )}
        </div>
        <Badge className="bg-[hsl(var(--govuk-green))] text-white hover:bg-[hsl(var(--govuk-green-hover))] px-4 py-2 text-sm font-bold whitespace-nowrap">
          ✓ Secure Link Verified
        </Badge>
      </div>
      <div className="mt-4 pt-4 border-t border-[hsl(var(--govuk-grey-border))]">
        <p className="text-xs text-[hsl(var(--govuk-text-secondary))]">
          <strong>Important:</strong> This information is set by the childminder who added you to their application. 
          If it is incorrect, you must ask them to cancel this request and send a new, correct invitation.
        </p>
      </div>
    </div>
  );
}
