import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NavLink } from "@/components/NavLink";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/admin');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles' as any)
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roles) {
      toast({
        title: "Access Denied",
        description: "You do not have admin privileges.",
        variant: "destructive",
      });
      navigate('/admin');
      return;
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "Successfully logged out of admin portal.",
    });
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl shadow-apple-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <h1 className="text-2xl font-semibold tracking-tight">ChildMinderPro</h1>
              <nav className="flex gap-2">
                <NavLink
                  to="/admin/dashboard"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-muted/50"
                  activeClassName="bg-primary text-primary-foreground shadow-apple-sm"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/admin/applications"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-muted/50"
                  activeClassName="bg-primary text-primary-foreground shadow-apple-sm"
                >
                  Applications
                </NavLink>
                <NavLink
                  to="/admin/employees"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-muted/50"
                  activeClassName="bg-primary text-primary-foreground shadow-apple-sm"
                >
                  Employees
                </NavLink>
              </nav>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="rounded-xl transition-all duration-200 hover:bg-muted/50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 animate-fade-up">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
