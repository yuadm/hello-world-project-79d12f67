import { AssistantFormData } from "@/types/assistant";
import { RKInput, RKRadio, RKTextarea, RKSectionTitle, RKInfoBox } from "@/components/apply/rk";

interface Props {
  formData: AssistantFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssistantFormData>>;
  validationErrors?: Record<string, string>;
}

export function AssistantFormSection4({ formData, setFormData, validationErrors = {} }: Props) {
  return (
    <div>
      <RKSectionTitle 
        title="4. Vetting & Suitability"
        description="This section covers mandatory background checks required for anyone working in a childminding setting."
      />

      <div className="space-y-8">
        {/* Previous Registrations */}
        <div className="space-y-4">
          <h3 className="rk-subsection-title">Previous Registrations</h3>
          
          <RKRadio
            name="prevReg"
            legend="Have you ever been registered with Ofsted, a childminder agency, or any other regulatory body for childcare?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.prevReg}
            onChange={(value) => setFormData(prev => ({ ...prev, prevReg: value }))}
            error={validationErrors.prevReg}
          />

          {formData.prevReg === "Yes" && (
            <RKTextarea
              id="prevRegInfo"
              label="Please provide details"
              hint="Include regulator name, registration number, dates, and current status"
              required
              value={formData.prevRegInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, prevRegInfo: e.target.value }))}
              rows={4}
            />
          )}
        </div>

        {/* DBS Section */}
        <div className="space-y-4">
          <h3 className="rk-subsection-title">DBS (Disclosure and Barring Service)</h3>
          
          <RKRadio
            name="hasDBS"
            legend="Do you have a DBS Enhanced Certificate for the Children's and Adults' Barred Lists?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.hasDBS}
            onChange={(value) => setFormData(prev => ({ ...prev, hasDBS: value }))}
            error={validationErrors.hasDBS}
          />

          {formData.hasDBS === "Yes" && (
            <div className="space-y-4">
              <RKInput
                id="dbsNumber"
                label="DBS certificate number"
                hint="This is a 12-digit number on your certificate"
                required
                value={formData.dbsNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, dbsNumber: e.target.value }))}
                error={validationErrors.dbsNumber}
              />

              <RKRadio
                name="dbsUpdate"
                legend="Are you registered with the DBS Update Service?"
                required
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" }
                ]}
                value={formData.dbsUpdate}
                onChange={(value) => setFormData(prev => ({ ...prev, dbsUpdate: value }))}
                error={validationErrors.dbsUpdate}
              />
            </div>
          )}

          {formData.hasDBS === "No" && (
            <RKInfoBox type="info">
              Don't worry if you don't have a DBS certificate yet. Your employer will arrange for a new DBS check to be carried out.
            </RKInfoBox>
          )}
        </div>

        {/* Criminal History */}
        <div className="space-y-4">
          <h3 className="rk-subsection-title">Criminal History & Suitability</h3>
          
          <RKRadio
            name="offenceHistory"
            legend="Have you ever been convicted of any criminal offence, received a police caution, reprimand, or warning?"
            hint="Include spent and unspent convictions"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.offenceHistory}
            onChange={(value) => setFormData(prev => ({ ...prev, offenceHistory: value }))}
            error={validationErrors.offenceHistory}
          />

          {formData.offenceHistory === "Yes" && (
            <RKTextarea
              id="offenceDetails"
              label="Please provide full details"
              hint="Include dates, offences, and outcomes"
              required
              value={formData.offenceDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, offenceDetails: e.target.value }))}
              rows={4}
            />
          )}

          <RKRadio
            name="disqualified"
            legend="Have you ever been disqualified from working with children or subject to any safeguarding orders?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.disqualified}
            onChange={(value) => setFormData(prev => ({ ...prev, disqualified: value }))}
            error={validationErrors.disqualified}
          />

          <RKRadio
            name="socialServices"
            legend="Have you or any member of your household been investigated or had action taken by social services in relation to child protection?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.socialServices}
            onChange={(value) => setFormData(prev => ({ ...prev, socialServices: value }))}
            error={validationErrors.socialServices}
          />

          {formData.socialServices === "Yes" && (
            <RKTextarea
              id="socialServicesInfo"
              label="Please provide full details"
              required
              value={formData.socialServicesInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, socialServicesInfo: e.target.value }))}
              rows={4}
            />
          )}
        </div>
      </div>
    </div>
  );
}
