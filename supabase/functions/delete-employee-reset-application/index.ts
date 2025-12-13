import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { employeeId } = await req.json();

    if (!employeeId) {
      return new Response(
        JSON.stringify({ error: 'Employee ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting deletion process for employee: ${employeeId}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First, fetch the employee to get the application_id
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('id, application_id, first_name, last_name')
      .eq('id', employeeId)
      .single();

    if (employeeError || !employee) {
      console.error('Error fetching employee:', employeeError);
      return new Response(
        JSON.stringify({ error: 'Employee not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const applicationId = employee.application_id;
    const deletionLog: Record<string, number> = {};

    console.log(`Employee found: ${employee.first_name} ${employee.last_name}, Application ID: ${applicationId}`);

    // Delete in order to respect foreign key constraints
    // 1. Delete compliance_household_forms (depends on compliance_household_members)
    const { data: deletedHouseholdForms, error: householdFormsError } = await supabase
      .from('compliance_household_forms')
      .delete()
      .eq('employee_id', employeeId)
      .select('id');
    
    if (householdFormsError) console.error('Error deleting household forms:', householdFormsError);
    deletionLog.compliance_household_forms = deletedHouseholdForms?.length || 0;
    console.log(`Deleted ${deletionLog.compliance_household_forms} household forms`);

    // 2. Delete compliance_assistant_forms (depends on compliance_assistants)
    const { data: deletedAssistantForms, error: assistantFormsError } = await supabase
      .from('compliance_assistant_forms')
      .delete()
      .eq('employee_id', employeeId)
      .select('id');
    
    if (assistantFormsError) console.error('Error deleting assistant forms:', assistantFormsError);
    deletionLog.compliance_assistant_forms = deletedAssistantForms?.length || 0;
    console.log(`Deleted ${deletionLog.compliance_assistant_forms} assistant forms`);

    // 3. Delete cochildminder_applications (depends on compliance_cochildminders)
    const { data: deletedCochildminderApps, error: cochildminderAppsError } = await supabase
      .from('cochildminder_applications')
      .delete()
      .eq('employee_id', employeeId)
      .select('id');
    
    if (cochildminderAppsError) console.error('Error deleting cochildminder applications:', cochildminderAppsError);
    deletionLog.cochildminder_applications = deletedCochildminderApps?.length || 0;
    console.log(`Deleted ${deletionLog.cochildminder_applications} cochildminder applications`);

    // 4. Delete compliance_household_members
    const { data: deletedHouseholdMembers, error: householdMembersError } = await supabase
      .from('compliance_household_members')
      .delete()
      .eq('employee_id', employeeId)
      .select('id');
    
    if (householdMembersError) console.error('Error deleting household members:', householdMembersError);
    deletionLog.compliance_household_members = deletedHouseholdMembers?.length || 0;
    console.log(`Deleted ${deletionLog.compliance_household_members} household members`);

    // 5. Delete compliance_assistants
    const { data: deletedAssistants, error: assistantsError } = await supabase
      .from('compliance_assistants')
      .delete()
      .eq('employee_id', employeeId)
      .select('id');
    
    if (assistantsError) console.error('Error deleting assistants:', assistantsError);
    deletionLog.compliance_assistants = deletedAssistants?.length || 0;
    console.log(`Deleted ${deletionLog.compliance_assistants} assistants`);

    // 6. Delete compliance_cochildminders
    const { data: deletedCochildminders, error: cochildmindersError } = await supabase
      .from('compliance_cochildminders')
      .delete()
      .eq('employee_id', employeeId)
      .select('id');
    
    if (cochildmindersError) console.error('Error deleting cochildminders:', cochildmindersError);
    deletionLog.compliance_cochildminders = deletedCochildminders?.length || 0;
    console.log(`Deleted ${deletionLog.compliance_cochildminders} cochildminders`);

    // 7. Delete reference_requests
    const { data: deletedReferences, error: referencesError } = await supabase
      .from('reference_requests')
      .delete()
      .eq('employee_id', employeeId)
      .select('id');
    
    if (referencesError) console.error('Error deleting reference requests:', referencesError);
    deletionLog.reference_requests = deletedReferences?.length || 0;
    console.log(`Deleted ${deletionLog.reference_requests} reference requests`);

    // 8. Delete ofsted_form_submissions
    const { data: deletedOfsted, error: ofstedError } = await supabase
      .from('ofsted_form_submissions')
      .delete()
      .eq('employee_id', employeeId)
      .select('id');
    
    if (ofstedError) console.error('Error deleting ofsted submissions:', ofstedError);
    deletionLog.ofsted_form_submissions = deletedOfsted?.length || 0;
    console.log(`Deleted ${deletionLog.ofsted_form_submissions} ofsted submissions`);

    // 9. Delete la_form_submissions
    const { data: deletedLA, error: laError } = await supabase
      .from('la_form_submissions')
      .delete()
      .eq('employee_id', employeeId)
      .select('id');
    
    if (laError) console.error('Error deleting LA submissions:', laError);
    deletionLog.la_form_submissions = deletedLA?.length || 0;
    console.log(`Deleted ${deletionLog.la_form_submissions} LA submissions`);

    // 10. Delete the employee record
    const { error: deleteEmployeeError } = await supabase
      .from('employees')
      .delete()
      .eq('id', employeeId);
    
    if (deleteEmployeeError) {
      console.error('Error deleting employee:', deleteEmployeeError);
      return new Response(
        JSON.stringify({ error: 'Failed to delete employee record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    deletionLog.employees = 1;
    console.log('Employee record deleted');

    // 11. Reset the application status to pending and re-create compliance records
    const recreatedCounts = {
      household_members: 0,
      assistants: 0,
      cochildminders: 0,
    };

    if (applicationId) {
      const { error: updateAppError } = await supabase
        .from('childminder_applications')
        .update({ status: 'pending' })
        .eq('id', applicationId);
      
      if (updateAppError) {
        console.error('Error resetting application status:', updateAppError);
      } else {
        console.log(`Application ${applicationId} status reset to pending`);
      }

      // Fetch the application data to re-create compliance records
      const { data: application, error: appFetchError } = await supabase
        .from('childminder_applications')
        .select('people_in_household, cochildminders, number_of_assistants')
        .eq('id', applicationId)
        .single();

      if (appFetchError) {
        console.error('Failed to fetch application for re-creating compliance records:', appFetchError.message);
      } else if (application) {
        // Re-create household members from people_in_household
        const peopleInHousehold = application.people_in_household as any;
        if (peopleInHousehold) {
          const householdMembersToInsert: any[] = [];

          // Process adults
          const adults = peopleInHousehold.adults || [];
          for (const adult of adults) {
            if (adult.fullName && adult.dob) {
              householdMembersToInsert.push({
                application_id: applicationId,
                full_name: adult.fullName,
                date_of_birth: adult.dob,
                relationship: adult.relationship || null,
                email: adult.email || null,
                member_type: 'adult',
                dbs_status: 'not_requested',
                compliance_status: 'pending',
              });
            }
          }

          // Process children
          const children = peopleInHousehold.children || [];
          for (const child of children) {
            if (child.fullName && child.dob) {
              householdMembersToInsert.push({
                application_id: applicationId,
                full_name: child.fullName,
                date_of_birth: child.dob,
                relationship: child.relationship || null,
                email: child.email || null,
                member_type: 'child',
                dbs_status: 'not_requested',
                compliance_status: 'pending',
              });
            }
          }

          // Process assistants from peopleInHousehold.assistants array
          const assistantsData = peopleInHousehold.assistants || [];
          if (assistantsData.length > 0) {
            const assistantsToInsert: any[] = [];
            for (const assistant of assistantsData) {
              if (assistant.firstName && assistant.lastName && assistant.dob) {
                assistantsToInsert.push({
                  application_id: applicationId,
                  first_name: assistant.firstName,
                  last_name: assistant.lastName,
                  date_of_birth: assistant.dob,
                  email: assistant.email || null,
                  phone: assistant.phone || null,
                  role: assistant.role || 'Assistant',
                  dbs_status: 'not_requested',
                  form_status: 'not_sent',
                  compliance_status: 'pending',
                });
              }
            }

            if (assistantsToInsert.length > 0) {
              const { data: insertedAssistants, error: insertAssistantsError } = await supabase
                .from('compliance_assistants')
                .insert(assistantsToInsert)
                .select('id');

              if (insertAssistantsError) {
                console.error('Failed to re-create assistants:', insertAssistantsError.message);
              } else {
                recreatedCounts.assistants = insertedAssistants?.length || 0;
                console.log(`Re-created ${recreatedCounts.assistants} assistants`);
              }
            }
          }

          if (householdMembersToInsert.length > 0) {
            const { data: insertedMembers, error: insertMembersError } = await supabase
              .from('compliance_household_members')
              .insert(householdMembersToInsert)
              .select('id');

            if (insertMembersError) {
              console.error('Failed to re-create household members:', insertMembersError.message);
            } else {
              recreatedCounts.household_members = insertedMembers?.length || 0;
              console.log(`Re-created ${recreatedCounts.household_members} household members`);
            }
          }
        }

        // Re-create co-childminders from cochildminders array
        const cochildminders = application.cochildminders as any[];
        if (cochildminders && cochildminders.length > 0) {
          const cochildmindersToInsert: any[] = [];
          for (const ccm of cochildminders) {
            if (ccm.firstName && ccm.lastName && ccm.dob) {
              cochildmindersToInsert.push({
                application_id: applicationId,
                first_name: ccm.firstName,
                last_name: ccm.lastName,
                date_of_birth: ccm.dob,
                email: ccm.email || null,
                phone: ccm.phone || null,
                dbs_status: 'not_requested',
                form_status: 'not_sent',
                compliance_status: 'pending',
              });
            }
          }

          if (cochildmindersToInsert.length > 0) {
            const { data: insertedCcm, error: insertCcmError } = await supabase
              .from('compliance_cochildminders')
              .insert(cochildmindersToInsert)
              .select('id');

            if (insertCcmError) {
              console.error('Failed to re-create co-childminders:', insertCcmError.message);
            } else {
              recreatedCounts.cochildminders = insertedCcm?.length || 0;
              console.log(`Re-created ${recreatedCounts.cochildminders} co-childminders`);
            }
          }
        }

        console.log('Re-created compliance records:', JSON.stringify(recreatedCounts, null, 2));
      }
    }

    console.log('Deletion complete. Summary:', deletionLog);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Employee deleted, application reset to pending, and compliance records re-created',
        deletionLog,
        recreatedCounts,
        applicationId
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
