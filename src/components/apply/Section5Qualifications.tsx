import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { RKRadio, RKInput, RKSectionTitle, RKInfoBox } from "./rk";
import { ChevronDown, ChevronUp, Check, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

interface TrainingSectionProps {
  title: string;
  completed: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const TrainingSection = ({ title, completed, isExpanded, onToggle, children }: TrainingSectionProps) => {
  const getStatus = () => {
    if (completed === "Yes") return { icon: Check, className: "completed", label: "Completed" };
    if (completed === "No") return { icon: AlertCircle, className: "pending", label: "Required" };
    return { icon: Clock, className: "not-started", label: "Not started" };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <div className="rk-training-section">
      <button type="button" className="rk-training-header w-full" onClick={onToggle}>
        <h4>{title}</h4>
        <div className="flex items-center gap-3">
          <span className={`rk-training-status ${status.className}`}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </span>
          {isExpanded ? <ChevronUp className="h-4 w-4 text-rk-text-light" /> : <ChevronDown className="h-4 w-4 text-rk-text-light" />}
        </div>
      </button>
      {isExpanded && <div className="rk-training-content">{children}</div>}
    </div>
  );
};

export const Section5Qualifications = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  const ageGroups = watch("ageGroups") || [];
  const firstAidCompleted = watch("firstAid.completed");
  const firstAidCompletionDate = watch("firstAid.completionDate");

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    firstAid: true,
    safeguarding: false,
    foodHygiene: false,
    eyfs: false,
    level2: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate if first aid is older than 3 years
  const isFirstAidExpired = (): boolean => {
    if (!firstAidCompletionDate) return false;
    const completionDate = new Date(firstAidCompletionDate);
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    return completionDate < threeYearsAgo;
  };

  const requires0to5 = ageGroups.includes("0-5");
  const requires5to7 = ageGroups.includes("5-7");
  const requires8plus = ageGroups.includes("8+");

  const firstAidLabel = requires0to5
    ? "Paediatric First Aid (PFA)"
    : "Appropriate First Aid";
  const firstAidQuestion = requires0to5
    ? "Have you completed a 12-hour Paediatric First Aid course?"
    : "Have you completed an appropriate first aid qualification?";

  return (
    <div className="space-y-8">
      <RKSectionTitle 
        title="Qualifications & Training"
        description="Tell us about your relevant qualifications and training."
      />

      <RKInfoBox type="info" title="Required Training Based on Your Age Groups">
        <ul className="list-disc list-inside text-sm space-y-1">
          {requires0to5 && <li>Paediatric First Aid (12-hour course) - Required</li>}
          {(requires5to7 || requires8plus) && !requires0to5 && <li>Appropriate First Aid - Required</li>}
          {(requires0to5 || requires5to7) && <li>Safeguarding Training - Required</li>}
          <li>Food Hygiene Certificate - Recommended</li>
          {requires5to7 && <li>EYFS/Childminding Course - Required</li>}
          {requires8plus && <li>Level 2 Qualification - Required</li>}
        </ul>
      </RKInfoBox>

      {/* First Aid */}
      <TrainingSection
        title={firstAidLabel}
        completed={firstAidCompleted || ""}
        isExpanded={expandedSections.firstAid}
        onToggle={() => toggleSection("firstAid")}
      >
        <div className="space-y-4">
          <RKRadio
            legend={firstAidQuestion}
            required
            name="firstAid.completed"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            value={firstAidCompleted || ""}
            onChange={(value) => setValue("firstAid.completed", value as "Yes" | "No")}
          />

          {firstAidCompleted === "Yes" && (
            <div className="space-y-4 p-4 bg-rk-gray-50 rounded-lg">
              <RKInput
                label="Training provider"
                required
                {...register("firstAid.provider")}
              />
              <div className="rk-address-grid">
                <RKInput
                  label="Completion date"
                  type="date"
                  required
                  {...register("firstAid.completionDate")}
                />
                <RKInput
                  label="Certificate number"
                  {...register("firstAid.certificateNumber")}
                />
              </div>

              {isFirstAidExpired() && (
                <RKInfoBox type="warning">
                  Your first aid certificate is more than 3 years old. You will need to renew it before your registration can be approved.
                </RKInfoBox>
              )}
            </div>
          )}

          {firstAidCompleted === "No" && (
            <RKInfoBox type="error">
              You must complete {requires0to5 ? "a 12-hour Paediatric First Aid course" : "an appropriate first aid qualification"} before your registration can be approved.
            </RKInfoBox>
          )}
        </div>
      </TrainingSection>

      {/* Safeguarding */}
      {(requires0to5 || requires5to7) && (
        <TrainingSection
          title="Safeguarding Training"
          completed={watch("safeguarding.completed") || ""}
          isExpanded={expandedSections.safeguarding}
          onToggle={() => toggleSection("safeguarding")}
        >
          <div className="space-y-4">
            <RKRadio
              legend="Have you completed safeguarding children training?"
              required
              name="safeguarding.completed"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              value={watch("safeguarding.completed") || ""}
              onChange={(value) => setValue("safeguarding.completed", value as "Yes" | "No")}
            />

            {watch("safeguarding.completed") === "Yes" && (
              <div className="space-y-4 p-4 bg-rk-gray-50 rounded-lg">
                <RKInput label="Training provider" {...register("safeguarding.provider")} />
                <RKInput label="Completion date" type="date" widthClass="10" {...register("safeguarding.completionDate")} />
              </div>
            )}
          </div>
        </TrainingSection>
      )}

      {/* Food Hygiene - New Section */}
      <TrainingSection
        title="Food Hygiene Certificate"
        completed={watch("foodHygiene.completed") || ""}
        isExpanded={expandedSections.foodHygiene}
        onToggle={() => toggleSection("foodHygiene")}
      >
        <div className="space-y-4">
          <RKRadio
            legend="Do you have a Food Hygiene Certificate (Level 2 or higher)?"
            name="foodHygiene.completed"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            value={watch("foodHygiene.completed") || ""}
            onChange={(value) => setValue("foodHygiene.completed", value as "Yes" | "No")}
          />

          {watch("foodHygiene.completed") === "Yes" && (
            <div className="space-y-4 p-4 bg-rk-gray-50 rounded-lg">
              <RKInput label="Training provider" {...register("foodHygiene.provider")} />
              <RKInput label="Completion date" type="date" widthClass="10" {...register("foodHygiene.completionDate")} />
            </div>
          )}

          {watch("foodHygiene.completed") === "No" && (
            <RKInfoBox type="info">
              While not mandatory, a Food Hygiene Certificate is highly recommended if you will be preparing food for children.
            </RKInfoBox>
          )}
        </div>
      </TrainingSection>

      {/* EYFS/Childminding Course */}
      {requires5to7 && (
        <TrainingSection
          title="EYFS/Childminding Course"
          completed={watch("eyfsChildminding.completed") || ""}
          isExpanded={expandedSections.eyfs}
          onToggle={() => toggleSection("eyfs")}
        >
          <div className="space-y-4">
            <RKRadio
              legend="Have you completed an EYFS or childminding-specific course?"
              required
              name="eyfsChildminding.completed"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              value={watch("eyfsChildminding.completed") || ""}
              onChange={(value) => setValue("eyfsChildminding.completed", value as "Yes" | "No")}
            />

            {watch("eyfsChildminding.completed") === "Yes" && (
              <div className="space-y-4 p-4 bg-rk-gray-50 rounded-lg">
                <RKInput label="Training provider" {...register("eyfsChildminding.provider")} />
                <RKInput label="Completion date" type="date" widthClass="10" {...register("eyfsChildminding.completionDate")} />
              </div>
            )}
          </div>
        </TrainingSection>
      )}

      {/* Level 2 Qualification */}
      {requires8plus && (
        <TrainingSection
          title="Level 2 Qualification"
          completed={watch("level2Qual.completed") || ""}
          isExpanded={expandedSections.level2}
          onToggle={() => toggleSection("level2")}
        >
          <div className="space-y-4">
            <RKRadio
              legend="Do you hold a Level 2 qualification in childcare or education?"
              required
              name="level2Qual.completed"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              value={watch("level2Qual.completed") || ""}
              onChange={(value) => setValue("level2Qual.completed", value as "Yes" | "No")}
            />

            {watch("level2Qual.completed") === "Yes" && (
              <div className="space-y-4 p-4 bg-rk-gray-50 rounded-lg">
                <RKInput label="Qualification name" {...register("level2Qual.provider")} />
                <RKInput label="Completion date" type="date" widthClass="10" {...register("level2Qual.completionDate")} />
              </div>
            )}
          </div>
        </TrainingSection>
      )}
    </div>
  );
};
