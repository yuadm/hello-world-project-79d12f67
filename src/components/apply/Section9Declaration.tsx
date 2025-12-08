import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { RKInput, RKSectionTitle, RKCheckbox } from "./rk";
import { Shield } from "lucide-react";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section9Declaration = ({ form }: Props) => {
  const { register, watch, setValue } = form;

  const consentItems = [
    {
      key: "consent1",
      label: "I consent to Ready Kids sharing my personal information with the local authority children's services department for the purposes of safeguarding and child protection checks.",
    },
    {
      key: "consent2", 
      label: "I understand that the local authority may hold information relevant to my suitability to work with children.",
    },
    {
      key: "consent3",
      label: "I consent to Ready Kids requesting and receiving any such information from the local authority.",
    },
    {
      key: "consent4",
      label: "I understand that this information will be used as part of the assessment of my suitability to be registered as a childminder.",
    },
    {
      key: "consent5",
      label: "I confirm that all information provided in this application is true and complete to the best of my knowledge, and I will notify Ready Kids immediately of any changes to my circumstances.",
    },
  ];

  return (
    <div className="space-y-8">
      <RKSectionTitle 
        title="Local Authority Consent & Declaration" 
        description="Please read and confirm the following consent statements." 
      />

      {/* Consent Banner */}
      <div className="rk-consent-banner">
        <div className="icon-wrapper">
          <Shield />
        </div>
        <h3>Local Authority Information Sharing</h3>
        <p>
          As part of the registration process, we are required to check with your local authority 
          whether they hold any information relevant to your suitability to care for children. 
          This is a standard safeguarding check and your consent is required to proceed.
        </p>
      </div>

      {/* Consent Items */}
      <div className="space-y-2">
        {consentItems.map((item, index) => (
          <div key={item.key} className="rk-consent-item">
            <span className="number">{index + 1}</span>
            <RKCheckbox
              name={item.key}
              label={item.label}
              required
              checked={watch(item.key as keyof ChildminderApplication) as boolean || false}
              onChange={(checked) => setValue(item.key as keyof ChildminderApplication, checked as never)}
            />
          </div>
        ))}
      </div>

      {/* Signature Section */}
      <div className="rk-signature-section">
        <h4>Electronic Signature</h4>
        <div className="rk-signature-grid">
          <RKInput 
            label="Signature (type your full name)" 
            hint="This serves as your electronic signature"
            required 
            {...register("signatureFullName")} 
          />
          <RKInput 
            label="Full name (PRINT)" 
            required 
            {...register("declarationPrintName")} 
          />
          <RKInput 
            label="Date" 
            type="date" 
            required 
            {...register("signatureDate")} 
          />
        </div>
      </div>
    </div>
  );
};
