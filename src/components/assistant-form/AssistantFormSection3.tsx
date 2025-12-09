import { AssistantFormData } from "@/types/assistant";
import { RKInput, RKRadio, RKTextarea, RKSectionTitle, RKButton, RKRepeatingBlock } from "@/components/apply/rk";
import { Plus } from "lucide-react";

interface Props {
  formData: AssistantFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssistantFormData>>;
  validationErrors?: Record<string, string>;
}

export function AssistantFormSection3({ formData, setFormData, validationErrors = {} }: Props) {
  const addEmployment = () => {
    setFormData(prev => ({
      ...prev,
      employmentHistory: [...prev.employmentHistory, { employer: "", title: "", startDate: "", endDate: "" }]
    }));
  };

  const removeEmployment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      employmentHistory: prev.employmentHistory.filter((_, i) => i !== index)
    }));
  };

  const updateEmployment = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      employmentHistory: prev.employmentHistory.map((emp, i) =>
        i === index ? { ...emp, [field]: value } : emp
      )
    }));
  };

  return (
    <div>
      <RKSectionTitle 
        title="3. Professional History & Training"
        description="Provide a full history since leaving full-time education to help us understand your background and identify any safeguarding concerns."
      />

      <div className="space-y-8">
        {/* Employment History */}
        <div className="space-y-4">
          <h3 className="rk-subsection-title">Employment & Education History</h3>
          
          {formData.employmentHistory.map((emp, index) => (
            <RKRepeatingBlock
              key={index}
              title={`Role / Course ${index + 1}`}
              onRemove={() => removeEmployment(index)}
            >
              <RKInput
                id={`employer_${index}`}
                label="Employer / Education provider"
                required
                value={emp.employer}
                onChange={(e) => updateEmployment(index, "employer", e.target.value)}
                error={validationErrors[`employment_${index}_employer`]}
              />
              
              <RKInput
                id={`jobTitle_${index}`}
                label="Job title / Course"
                required
                value={emp.title}
                onChange={(e) => updateEmployment(index, "title", e.target.value)}
                error={validationErrors[`employment_${index}_title`]}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <RKInput
                  id={`empStartDate_${index}`}
                  label="Start date"
                  type="date"
                  required
                  value={emp.startDate}
                  onChange={(e) => updateEmployment(index, "startDate", e.target.value)}
                  error={validationErrors[`employment_${index}_startDate`]}
                />
                <RKInput
                  id={`empEndDate_${index}`}
                  label="End date"
                  type="date"
                  hint="Leave blank if current"
                  value={emp.endDate}
                  onChange={(e) => updateEmployment(index, "endDate", e.target.value)}
                />
              </div>
            </RKRepeatingBlock>
          ))}

          <RKButton variant="secondary" onClick={addEmployment}>
            <Plus className="h-4 w-4 mr-2" />
            Add employment or education
          </RKButton>

          <RKTextarea
            id="employmentGaps"
            label="Explanation for gaps (if any)"
            hint="Please explain any periods not covered by employment or education"
            value={formData.employmentGaps}
            onChange={(e) => setFormData(prev => ({ ...prev, employmentGaps: e.target.value }))}
            rows={3}
          />
        </div>

        {/* Training Declaration */}
        <div className="space-y-4">
          <h3 className="rk-subsection-title">Training Declaration</h3>
          <p className="text-sm text-gray-600 -mt-2">
            Your employer is responsible for ensuring you have valid training. Please declare what you have completed.
          </p>

          <RKRadio
            name="pfaCompleted"
            legend="Paediatric First Aid (PFA)"
            required
            options={[
              { value: "Yes", label: "Yes, I have a valid certificate" },
              { value: "No", label: "No / It has expired" }
            ]}
            value={formData.pfaCompleted}
            onChange={(value) => setFormData(prev => ({ ...prev, pfaCompleted: value }))}
            error={validationErrors.pfaCompleted}
          />

          <RKRadio
            name="safeguardingCompleted"
            legend="Safeguarding / Child Protection Training"
            required
            options={[
              { value: "Yes", label: "Yes, I have a valid certificate" },
              { value: "No", label: "No / It has expired" }
            ]}
            value={formData.safeguardingCompleted}
            onChange={(value) => setFormData(prev => ({ ...prev, safeguardingCompleted: value }))}
            error={validationErrors.safeguardingCompleted}
          />
        </div>
      </div>
    </div>
  );
}
