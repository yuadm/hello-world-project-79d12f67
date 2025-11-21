import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { GovUKRadio } from "./GovUKRadio";
import { GovUKInput } from "./GovUKInput";
import { useState } from "react";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section4Service = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  const ageGroups = watch("ageGroups") || [];
  const workWithOthers = watch("workWithOthers");
  const numberOfAssistants = watch("numberOfAssistants") || 1;

  const toggleAgeGroup = (ageGroup: string) => {
    if (ageGroups.includes(ageGroup)) {
      setValue("ageGroups", ageGroups.filter((g) => g !== ageGroup));
    } else {
      setValue("ageGroups", [...ageGroups, ageGroup]);
    }
  };

  const totalAdults = workWithOthers === "Yes" ? 1 + (numberOfAssistants || 0) : 1;
  const maxUnder1 = totalAdults * 1;
  const maxUnder5 = totalAdults * 3;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-foreground">4. Your Childminding Service</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">
          Which age groups will you care for?<span className="text-[hsl(var(--govuk-red))] ml-1">*</span>
        </h3>
        <div className="space-y-3">
          {[
            { value: "0-5", label: "Children aged 0-5 years (Early Years Foundation Stage)" },
            { value: "5-7", label: "Children aged 5-7 years" },
            { value: "8+", label: "Children aged 8 years and over" },
          ].map((option) => (
            <div key={option.value} className="flex items-center relative pl-10">
              <input
                type="checkbox"
                id={`ageGroup-${option.value}`}
                checked={ageGroups.includes(option.value)}
                onChange={() => toggleAgeGroup(option.value)}
                className="absolute left-0 top-0 w-6 h-6 cursor-pointer appearance-none border-2 border-[hsl(var(--govuk-black))] checked:before:content-['✔'] checked:before:block checked:before:text-center checked:before:text-xl checked:before:leading-5 checked:before:text-[hsl(var(--govuk-black))] focus:outline-none focus:ring-[3px] focus:ring-[hsl(var(--govuk-focus-yellow))] focus:ring-offset-0"
              />
              <label htmlFor={`ageGroup-${option.value}`} className="text-base cursor-pointer">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <GovUKRadio
        legend="Will you work with any assistants or co-childminders?"
        required
        name="workWithOthers"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={workWithOthers || "No"}
        onChange={(value) => setValue("workWithOthers", value as "Yes" | "No")}
      />

      {workWithOthers === "Yes" && (
        <GovUKInput
          label="How many assistants/co-childminders?"
          type="number"
          required
          widthClass="10"
          min="1"
          {...register("numberOfAssistants", { valueAsNumber: true })}
        />
      )}

      <div className="p-4 border-l-[10px] border-[hsl(var(--govuk-blue))] bg-[hsl(var(--govuk-inset-blue-bg))]">
        <h3 className="text-base font-bold mb-2">Proposed Capacity Guidance</h3>
        <p className="text-sm mb-2">
          Standard childminder ratios (subject to Ofsted approval):
        </p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Maximum {maxUnder1} children under 1 year</li>
          <li>Maximum {maxUnder5} children under 5 years (including those under 1)</li>
          <li>Maximum 6 children under 8 years in total</li>
          <li>
            You are working with {totalAdults} adult{totalAdults > 1 ? "s" : ""}
          </li>
        </ul>
      </div>

      <h3 className="text-xl font-bold">Proposed Numbers of Children</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GovUKInput
          label="Children under 1 year"
          type="number"
          widthClass="10"
          min="0"
          max={maxUnder1}
          {...register("proposedUnder1", { valueAsNumber: true })}
        />
        <GovUKInput
          label="Children aged 1-5 years"
          type="number"
          widthClass="10"
          min="0"
          {...register("proposedUnder5", { valueAsNumber: true })}
        />
        <GovUKInput
          label="Children aged 5-8 years"
          type="number"
          widthClass="10"
          min="0"
          {...register("proposed5to8", { valueAsNumber: true })}
        />
        <GovUKInput
          label="Children aged 8+ years"
          type="number"
          widthClass="10"
          min="0"
          {...register("proposed8plus", { valueAsNumber: true })}
        />
      </div>
    </div>
  );
};
