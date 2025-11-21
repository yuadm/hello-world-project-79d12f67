import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { GovUKInput } from "./GovUKInput";
import { GovUKRadio } from "./GovUKRadio";
import { GovUKTextarea } from "./GovUKTextarea";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section8Suitability = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  const healthCondition = watch("healthCondition");
  const disqualified = watch("disqualified");
  const socialServices = watch("socialServices");
  const otherCircumstances = watch("otherCircumstances");
  const hasDBS = watch("hasDBS");
  const dbsEnhanced = watch("dbsEnhanced");
  const dbsUpdate = watch("dbsUpdate");
  const offenceHistory = watch("offenceHistory");

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-foreground">8. Suitability & Vetting</h2>

      <GovUKRadio
        legend="Do you have any current or previous medical conditions that may impact your ability to work as a childminder?"
        hint="This includes significant mental health conditions, neurological conditions, or physical impairments."
        required
        name="healthCondition"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={healthCondition || "No"}
        onChange={(value) => setValue("healthCondition", value as "Yes" | "No")}
      />

      {healthCondition === "Yes" && (
        <GovUKTextarea
          label="Please provide details"
          hint="Include details of the condition, any treatment or medication, and how you manage it."
          required
          rows={5}
          {...register("healthConditionDetails")}
        />
      )}

      <GovUKRadio
        legend="Is anyone who lives or works at the premises a smoker?"
        required
        name="smoker"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={watch("smoker") || "No"}
        onChange={(value) => setValue("smoker", value as "Yes" | "No")}
      />

      <h3 className="text-xl font-bold border-t pt-6">Suitability Declaration</h3>

      <GovUKRadio
        legend="Are you disqualified under the Childcare Act 2006?"
        required
        name="disqualified"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={disqualified || "No"}
        onChange={(value) => setValue("disqualified", value as "Yes" | "No")}
      />

      <GovUKRadio
        legend="Have you ever been involved with social services in connection with your own children?"
        required
        name="socialServices"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={socialServices || "No"}
        onChange={(value) => setValue("socialServices", value as "Yes" | "No")}
      />

      {socialServices === "Yes" && (
        <GovUKTextarea
          label="Please provide details"
          hint="Include dates, the local authority involved, and the outcome."
          required
          rows={5}
          {...register("socialServicesDetails")}
        />
      )}

      <GovUKRadio
        legend="Are you aware of any other circumstances that might affect your suitability to care for children?"
        required
        name="otherCircumstances"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={otherCircumstances || "No"}
        onChange={(value) => setValue("otherCircumstances", value as "Yes" | "No")}
      />

      {otherCircumstances === "Yes" && (
        <GovUKTextarea
          label="Please provide details"
          required
          rows={4}
          {...register("otherCircumstancesDetails")}
        />
      )}

      <h3 className="text-xl font-bold border-t pt-6">DBS & Vetting</h3>

      <GovUKRadio
        legend="Do you currently hold an Enhanced DBS certificate dated within the last 3 years?"
        required
        name="hasDBS"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={hasDBS || "No"}
        onChange={(value) => setValue("hasDBS", value as "Yes" | "No")}
      />

      {hasDBS === "Yes" && (
        <div className="space-y-6">
          <GovUKInput
            label="DBS certificate number (12 digits)"
            required
            widthClass="10"
            maxLength={12}
            {...register("dbsNumber")}
          />

          <GovUKRadio
            legend="Is the certificate an Enhanced check with barred lists for a home-based role?"
            required
            name="dbsEnhanced"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            value={dbsEnhanced || ""}
            onChange={(value) => setValue("dbsEnhanced", value as "Yes" | "No")}
          />

          <GovUKRadio
            legend="Are you subscribed to the DBS Update Service?"
            required
            name="dbsUpdate"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            value={dbsUpdate || ""}
            onChange={(value) => setValue("dbsUpdate", value as "Yes" | "No")}
          />
        </div>
      )}

      <GovUKRadio
        legend="Have you ever received a reprimand or final warning, been given a caution for, or been convicted of, any criminal offences?"
        hint="You must declare everything, no matter how long ago it occurred."
        required
        name="offenceHistory"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={offenceHistory || "No"}
        onChange={(value) => setValue("offenceHistory", value as "Yes" | "No")}
      />
    </div>
  );
};
