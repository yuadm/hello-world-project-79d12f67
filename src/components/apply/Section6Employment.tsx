import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { RKInput, RKTextarea, RKButton, RKRadio, RKSectionTitle, RKInfoBox, RKCheckbox } from "./rk";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section6Employment = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  const employmentHistory = watch("employmentHistory") || [];
  const childVolunteered = watch("childVolunteered");

  const addEmployment = () => {
    setValue("employmentHistory", [
      ...employmentHistory,
      { employer: "", role: "", startDate: "", endDate: "", reasonForLeaving: "" },
    ]);
  };

  const removeEmployment = (index: number) => {
    setValue("employmentHistory", employmentHistory.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <RKSectionTitle 
        title="Employment History & References"
        description="Tell us about your work history and provide references."
      />

      <h3 className="rk-subsection-title">Employment/Education History</h3>
      <p className="text-sm text-rk-text-light -mt-2 mb-4">
        Please provide details of your employment or education for the last 5 years. We need a complete 5-year history.
      </p>

      {employmentHistory.length === 0 && (
        <RKInfoBox type="info">
          Click "Add employment/education entry" below to start providing your 5-year history.
        </RKInfoBox>
      )}

      {employmentHistory.map((_, index) => (
        <div
          key={index}
          className="p-5 bg-rk-bg-form border border-rk-border rounded-xl space-y-4"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-rk-text">Entry {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeEmployment(index)}
              className="text-rk-error hover:text-rk-error/80 flex items-center gap-1 text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
          <div className="rk-address-grid">
            <RKInput
              label="Employer/Institution"
              {...register(`employmentHistory.${index}.employer`)}
            />
            <RKInput label="Role/Course" {...register(`employmentHistory.${index}.role`)} />
            <RKInput
              label="Start date"
              type="date"
              {...register(`employmentHistory.${index}.startDate`)}
            />
            <RKInput
              label="End date"
              type="date"
              hint="Leave blank if current"
              {...register(`employmentHistory.${index}.endDate`)}
            />
          </div>
          <RKTextarea
            label="Reason for leaving"
            rows={2}
            {...register(`employmentHistory.${index}.reasonForLeaving`)}
          />
        </div>
      ))}

      <RKButton
        type="button"
        variant="secondary"
        onClick={addEmployment}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add employment/education entry
      </RKButton>

      <RKTextarea
        label="Explain any gaps in employment/education history"
        hint="If there are gaps in your 5-year history, please explain what you were doing during those periods."
        rows={4}
        {...register("employmentGaps")}
      />

      <RKRadio
        legend="Have you previously worked or volunteered with children?"
        required
        name="childVolunteered"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={childVolunteered || ""}
        onChange={(value) => setValue("childVolunteered", value as "Yes" | "No")}
      />

      {childVolunteered === "Yes" && (
        <RKCheckbox
          name="childVolunteeredConsent"
          label="I consent to Ready Kids contacting my previous employers/organizations"
          hint="We may need to verify your experience working with children."
          checked={watch("childVolunteeredConsent") || false}
          onChange={(checked) => setValue("childVolunteeredConsent", checked)}
        />
      )}

      <div className="rk-divider" />

      <h3 className="rk-subsection-title">References</h3>
      <p className="text-sm text-rk-text-light -mt-2 mb-4">
        Please provide two references who have known you for at least 2 years.
      </p>

      {/* Reference 1 */}
      <div className="p-5 bg-rk-bg-form border border-rk-border rounded-xl space-y-4">
        <h4 className="font-semibold text-rk-text">Reference 1</h4>
        <div className="rk-address-grid">
          <RKInput label="Full name" required {...register("reference1Name")} />
          <RKInput label="Relationship to you" required {...register("reference1Relationship")} />
        </div>
        <RKInput
          label="Contact details (email or phone)"
          required
          {...register("reference1Contact")}
        />
        <RKRadio
          legend="Is this a childcare-related reference?"
          required
          name="reference1Childcare"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          value={watch("reference1Childcare") || ""}
          onChange={(value) => setValue("reference1Childcare", value as "Yes" | "No")}
        />
      </div>

      {/* Reference 2 */}
      <div className="p-5 bg-rk-bg-form border border-rk-border rounded-xl space-y-4">
        <h4 className="font-semibold text-rk-text">Reference 2</h4>
        <div className="rk-address-grid">
          <RKInput label="Full name" required {...register("reference2Name")} />
          <RKInput label="Relationship to you" required {...register("reference2Relationship")} />
        </div>
        <RKInput
          label="Contact details (email or phone)"
          required
          {...register("reference2Contact")}
        />
        <RKRadio
          legend="Is this a childcare-related reference?"
          required
          name="reference2Childcare"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          value={watch("reference2Childcare") || ""}
          onChange={(value) => setValue("reference2Childcare", value as "Yes" | "No")}
        />
      </div>
    </div>
  );
};
