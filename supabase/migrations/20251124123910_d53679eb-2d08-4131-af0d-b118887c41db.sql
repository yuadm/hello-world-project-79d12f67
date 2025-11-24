-- Prevent status changes for applications that have been converted to employees
CREATE OR REPLACE FUNCTION prevent_approved_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if an employee exists for this application
  IF EXISTS (
    SELECT 1 FROM employees WHERE application_id = NEW.id
  ) AND OLD.status = 'approved' AND NEW.status != 'approved' THEN
    RAISE EXCEPTION 'Cannot change status of application that has been converted to employee';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to prevent inappropriate status changes
CREATE TRIGGER check_approved_status_change
BEFORE UPDATE ON childminder_applications
FOR EACH ROW
EXECUTE FUNCTION prevent_approved_status_change();