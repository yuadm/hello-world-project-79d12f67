-- Create table for tracking Known to Ofsted form submissions
CREATE TABLE public.ofsted_form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.childminder_applications(id),
  employee_id UUID REFERENCES public.employees(id),
  form_token TEXT NOT NULL UNIQUE,
  reference_id TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  date_of_birth DATE,
  role TEXT NOT NULL,
  ofsted_email TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  requester_role TEXT NOT NULL,
  require_child_info BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ofsted_form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all ofsted form submissions"
ON public.ofsted_form_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert ofsted form submissions"
ON public.ofsted_form_submissions
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update ofsted form submissions"
ON public.ofsted_form_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view own submission via token"
ON public.ofsted_form_submissions
FOR SELECT
USING (form_token IS NOT NULL);

CREATE POLICY "Public can update submission via token"
ON public.ofsted_form_submissions
FOR UPDATE
USING (form_token IS NOT NULL);

-- Create trigger for updated_at
CREATE TRIGGER update_ofsted_form_submissions_updated_at
BEFORE UPDATE ON public.ofsted_form_submissions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();