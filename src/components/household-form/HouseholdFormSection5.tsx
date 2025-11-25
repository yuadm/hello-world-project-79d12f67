import { HouseholdFormData } from "@/pages/HouseholdForm";
import { GovUKInput } from "@/components/apply/GovUKInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface Props {
  formData: HouseholdFormData;
  setFormData: React.Dispatch<React.SetStateAction<HouseholdFormData>>;
  validationErrors?: Record<string, string>;
}

export function HouseholdFormSection5({ formData, setFormData, validationErrors = {} }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">5. Declaration & Submission</h2>
      <p className="mb-6">
        Please review your answers carefully. By submitting this form, you are making a legal declaration.
      </p>

      <div className="space-y-6">
        {(validationErrors.consentChecks || validationErrors.declarationTruth || validationErrors.declarationNotify) && (
          <div className="flex items-center gap-2 text-[hsl(var(--govuk-red))] font-bold text-sm p-4 border-l-4 border-[hsl(var(--govuk-red))] bg-[hsl(var(--govuk-inset-red-bg))]">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>You must check all three boxes to proceed</span>
          </div>
        )}

        <div className="flex items-start space-x-3">
          <Checkbox
            id="consentChecks"
            checked={formData.consentChecks}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, consentChecks: checked as boolean })
            }
            className={validationErrors.consentChecks ? "border-[hsl(var(--govuk-red))] border-2" : ""}
          />
          <Label htmlFor="consentChecks" className="text-base leading-relaxed cursor-pointer">
            I consent to Ready Kids carrying out all necessary checks, including with the DBS and local authorities, to assess my suitability.
          </Label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="declarationTruth"
            checked={formData.declarationTruth}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, declarationTruth: checked as boolean })
            }
            className={validationErrors.declarationTruth ? "border-[hsl(var(--govuk-red))] border-2" : ""}
          />
          <Label htmlFor="declarationTruth" className="text-base leading-relaxed cursor-pointer">
            I declare that the information provided is true, accurate, and complete. I understand that providing false information is an offence and will result in refusal or cancellation of my suitability status.
          </Label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="declarationNotify"
            checked={formData.declarationNotify}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, declarationNotify: checked as boolean })
            }
            className={validationErrors.declarationNotify ? "border-[hsl(var(--govuk-red))] border-2" : ""}
          />
          <Label htmlFor="declarationNotify" className="text-base leading-relaxed cursor-pointer">
            I understand I must notify the childminder of any changes to this information, including any new cautions or convictions.
          </Label>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4">Electronic Signature</h3>
        
        <GovUKInput
          id="signatureFullName"
          label="Enter your full legal name to sign this form"
          required
          className="max-w-md"
          value={formData.signatureFullName}
          onChange={(e) => setFormData({ ...formData, signatureFullName: e.target.value })}
          error={validationErrors.signatureFullName}
        />

        <GovUKInput
          id="signatureDate"
          label="Date of signature"
          type="date"
          required
          className="max-w-md"
          value={formData.signatureDate}
          onChange={(e) => setFormData({ ...formData, signatureDate: e.target.value })}
        />
      </div>
    </div>
  );
}
