import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { GovUKInput } from "./GovUKInput";
import { GovUKRadio } from "./GovUKRadio";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section9Declaration = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  const ageGroups = watch("ageGroups") || [];
  const paymentAmount = ageGroups.includes("0-5") || ageGroups.includes("5-7") ? "£200" : "£100";

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-foreground">9. Declaration & Payment</h2>

      <h3 className="text-xl font-bold">Final Declarations</h3>

      <div className="space-y-4">
        {[
          { name: "declarationAccuracy", label: "I confirm that all information provided is accurate and complete to the best of my knowledge" },
          { name: "declarationChangeNotification", label: "I will notify Ready Kids immediately of any changes to my circumstances, household, or suitability" },
          { name: "declarationInspectionCooperation", label: "I agree to cooperate with Ofsted inspections and comply with all regulatory requirements" },
          { name: "declarationInformationSharing", label: "I consent to information being shared with Ofsted, local authorities, and other relevant bodies as required" },
          { name: "declarationDataProcessing", label: "I consent to Ready Kids processing my personal data in accordance with GDPR and their privacy policy" },
        ].map((declaration) => (
          <div key={declaration.name} className="flex items-start space-x-3 p-4 border border-border rounded">
            <input
              type="checkbox"
              id={declaration.name}
              {...register(declaration.name as keyof ChildminderApplication)}
              className="mt-1 w-6 h-6 cursor-pointer appearance-none border-2 border-[hsl(var(--govuk-black))] checked:before:content-['✔'] checked:before:block checked:before:text-center checked:before:text-xl checked:before:leading-5"
            />
            <label htmlFor={declaration.name} className="text-base cursor-pointer">
              {declaration.label} <span className="text-[hsl(var(--govuk-red))] font-bold">*</span>
            </label>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold border-t pt-6">Electronic Signature</h3>

      <GovUKInput
        label="Full legal name"
        hint="This serves as your electronic signature. It must match your name exactly as provided in Section 1."
        required
        {...register("signatureFullName")}
      />

      <GovUKInput
        label="Date"
        type="date"
        required
        widthClass="10"
        {...register("signatureDate")}
      />

      <h3 className="text-xl font-bold border-t pt-6">Payment</h3>

      <div className="p-4 border-l-[10px] border-[hsl(var(--govuk-blue))] bg-[hsl(var(--govuk-inset-blue-bg))]">
        <p className="text-base font-bold mb-2">Application Fee: {paymentAmount}</p>
        <p className="text-sm">Based on the age groups you selected, your registration fee is {paymentAmount}.</p>
      </div>

      <GovUKRadio
        legend="Payment method"
        required
        name="paymentMethod"
        options={[
          { value: "Card", label: "Debit/Credit Card" },
          { value: "Bank Transfer", label: "Bank Transfer" },
          { value: "Invoice", label: "Invoice (for organizations)" },
        ]}
        value={watch("paymentMethod") || ""}
        onChange={(value) => setValue("paymentMethod", value)}
      />
    </div>
  );
};
