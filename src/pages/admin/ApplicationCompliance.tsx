import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DBSComplianceSection } from "@/components/admin/DBSComplianceSection";
import { AssistantComplianceSection } from "@/components/admin/AssistantComplianceSection";
import { Shimmer } from "@/components/ui/shimmer";

interface DBApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
}

const ApplicationCompliance = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dbApplication, setDbApplication] = useState<DBApplication | null>(null);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('childminder_applications' as any)
        .select('id, first_name, last_name, email, status')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Not Found",
          description: "Application not found",
          variant: "destructive",
        });
        navigate('/admin/applications');
        return;
      }

      setDbApplication(data as unknown as DBApplication);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 space-y-6">
          <Shimmer variant="card" className="h-32" />
          <Shimmer variant="card" className="h-96" />
        </div>
      </AdminLayout>
    );
  }

  if (!dbApplication) {
    return null;
  }

  const applicantName = `${dbApplication.first_name} ${dbApplication.last_name}`;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/admin/applications/${id}`)}
              className="gap-2 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Application
            </Button>
            <h1 className="text-3xl font-semibold tracking-tight">
              Compliance Management
            </h1>
            <p className="text-muted-foreground mt-1">{applicantName}</p>
          </div>
        </div>

        {/* Compliance Tabs */}
        <div className="rounded-2xl bg-card shadow-apple-sm border-0 p-6">
          <Tabs defaultValue="household" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="household">Household Members</TabsTrigger>
              <TabsTrigger value="assistants">Assistants</TabsTrigger>
            </TabsList>

            <TabsContent value="household" className="space-y-6">
              <DBSComplianceSection
                applicationId={id!}
                applicantEmail={dbApplication.email}
                applicantName={applicantName}
              />
            </TabsContent>

            <TabsContent value="assistants" className="space-y-6">
              <AssistantComplianceSection
                applicationId={id!}
                applicantEmail={dbApplication.email}
                applicantName={applicantName}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ApplicationCompliance;
