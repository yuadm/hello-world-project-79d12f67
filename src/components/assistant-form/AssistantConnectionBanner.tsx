import { CheckCircle2, Link } from "lucide-react";

interface AssistantConnectionBannerProps {
  applicantName: string;
  applicantAddress: any;
  assistantName: string;
}

export const AssistantConnectionBanner = ({ 
  applicantName, 
  applicantAddress,
  assistantName 
}: AssistantConnectionBannerProps) => {
  return (
    <div className="bg-gradient-to-r from-rk-primary/5 via-rk-primary/10 to-rk-primary/5 border border-rk-primary/20 rounded-2xl p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-rk-primary/10 flex items-center justify-center flex-shrink-0">
          <Link className="w-6 h-6 text-rk-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-rk-primary" />
            <h3 className="text-lg font-semibold text-rk-text">Secure Link Verified</h3>
          </div>
          <p className="text-rk-text-light mb-3">
            This form is connected to the registration of:
          </p>
          <div className="bg-white/80 rounded-xl p-4 border border-rk-border">
            <p className="font-semibold text-rk-text text-lg">{applicantName}</p>
            {applicantAddress && (
              <p className="text-sm text-rk-text-light mt-1">
                {applicantAddress.line1}, {applicantAddress.town}, {applicantAddress.postcode}
              </p>
            )}
          </div>
          <p className="text-xs text-rk-text-light mt-3">
            If this information is incorrect, please contact the childminder who invited you to cancel this request and send a new invitation.
          </p>
        </div>
      </div>
    </div>
  );
};
