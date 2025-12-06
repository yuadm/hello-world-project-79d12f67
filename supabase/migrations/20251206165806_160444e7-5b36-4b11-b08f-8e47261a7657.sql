-- Grant table-level permissions to anon and authenticated roles
GRANT SELECT, INSERT ON public.childminder_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.childminder_applications TO authenticated;

-- Grant permissions on compliance tables as well
GRANT SELECT, INSERT ON public.compliance_household_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.compliance_household_members TO authenticated;

GRANT SELECT, INSERT ON public.compliance_assistants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.compliance_assistants TO authenticated;

-- Grant usage on sequences for UUID generation
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;