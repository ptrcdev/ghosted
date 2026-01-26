import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import useAxiosAuth from "../hooks/useAxiosAuth";
import type { JobApplication, JobApplicationInsert } from "../types/application";
import { ApplicationFilters } from "../components/dashboard/ApplicationFilters";
import { ApplicationList } from "../components/dashboard/ApplicationList";
import { ApplicationFormDialog } from "../components/dashboard/ApplicationFormDialog";
import { ApplicationViewDialog } from "../components/dashboard/ApplicationViewDialog";
import { useJobApplications } from "../hooks/useJobApplications";

const Dashboard = () => {
  const {
    applications,
    filteredApplications,
    isLoading,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    createApplication,
    updateApplication,
    deleteApplication,
  } = useJobApplications();

  const [user, setUser] = useState<User | null>(null);
  const [isMounting, setIsMounting] = useState<boolean>(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [viewingApplication, setViewingApplication] = useState<JobApplication | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const axiosAuth = useAxiosAuth();

  const handleAddNew = () => {
    setEditingApplication(null);
    setIsFormOpen(true);
  };

  const handleEdit = (application: JobApplication) => {
    setEditingApplication(application);
    setIsFormOpen(true);
  };

  const handleView = (application: JobApplication) => {
    setViewingApplication(application);
    setIsViewOpen(true);
  };

  const handleFormSubmit = async (data: JobApplicationInsert) => {
    if (editingApplication) {
      return await updateApplication(editingApplication.id, data);
    }
    return await createApplication(data);
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (!mounted) return;

        if (error) {
          // If this happens, the session is busted. Your route guard *should* prevent this.
          toast({
            title: "Session error",
            description: "Please sign in again.",
            variant: "destructive",
          });
          navigate("/login", { replace: true });
          return;
        }

        setUser(data.user);
      } finally {
        if (mounted) setIsMounting(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [navigate, toast]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosAuth.get("/");

        if (!response) throw new Error("No data returned");

        console.log(response);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    if (user) fetchApplications();
  }, [user])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });

    navigate("/", { replace: true });
  };

  const fullName =
    (user?.user_metadata as { full_name?: string } | undefined)?.full_name?.trim();

  if (isMounting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">J</span>
            </div>
            <span className="text-xl font-bold text-foreground">JobTrackr</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-border"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Welcome back {fullName}!
              </h1>
              <p className="text-muted-foreground">
                Track and manage your job applications from one place.
              </p>
            </div>
            <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </div>

          {applications.length > 0 && (
            <div className="mb-6">
              <ApplicationFilters
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sortOption={sortOption}
                onSortOptionChange={setSortOption}
              />
            </div>
          )}

          <ApplicationList
            applications={applications}
            filteredApplications={filteredApplications}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={deleteApplication}
            onAddNew={handleAddNew}
            onView={handleView}
          />
        </motion.div>
      </main>

      <ApplicationFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        application={editingApplication}
        onSubmit={handleFormSubmit}
      />

      <ApplicationViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        application={viewingApplication}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default Dashboard;
