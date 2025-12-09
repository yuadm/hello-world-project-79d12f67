import { AssistantFormData } from "@/types/assistant";
import { RKRadio, RKTextarea, RKSectionTitle } from "@/components/apply/rk";

interface Props {
  formData: AssistantFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssistantFormData>>;
  validationErrors?: Record<string, string>;
}

export function AssistantFormSection5({ formData, setFormData, validationErrors = {} }: Props) {
  return (
    <div>
      <RKSectionTitle 
        title="5. Health Declaration"
        description="We need to understand if you have any health conditions that might affect your ability to care for children safely."
      />

      <div className="space-y-6">
        <RKRadio
          name="healthCondition"
          legend="Do you have any health conditions that might affect your ability to care for children?"
          hint="This includes physical or mental health conditions"
          required
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
          ]}
          value={formData.healthCondition}
          onChange={(value) => setFormData(prev => ({ ...prev, healthCondition: value }))}
          error={validationErrors.healthCondition}
        />

        {formData.healthCondition === "Yes" && (
          <RKTextarea
            id="healthConditionDetails"
            label="Please provide details"
            hint="Include how you manage the condition and any support you may need"
            required
            value={formData.healthConditionDetails}
            onChange={(e) => setFormData(prev => ({ ...prev, healthConditionDetails: e.target.value }))}
            rows={4}
          />
        )}

        <RKRadio
          name="smoker"
          legend="Do you smoke?"
          hint="This includes cigarettes, vaping, or any other tobacco products"
          required
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
          ]}
          value={formData.smoker}
          onChange={(value) => setFormData(prev => ({ ...prev, smoker: value }))}
          error={validationErrors.smoker}
        />
      </div>
    </div>
  );
}
