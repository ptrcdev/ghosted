import { Briefcase } from 'lucide-react';
import { Button } from '../ui/button';
import { ApplicationCard } from './ApplicationCard';
import type { JobApplication } from '../../types/application';

interface ApplicationListProps {
  applications: JobApplication[];
  filteredApplications: JobApplication[];
  isLoading: boolean;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => Promise<boolean>;
  onAddNew: () => void;
  onView: (application: JobApplication) => void;
}

export function ApplicationList({
  applications,
  filteredApplications,
  isLoading,
  onEdit,
  onDelete,
  onAddNew,
  onView,
}: ApplicationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-card/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Briefcase className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">No applications yet</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Start tracking your job applications to stay organized and never miss an opportunity.
        </p>
        <Button onClick={onAddNew} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Add Your First Application
        </Button>
      </div>
    );
  }

  if (filteredApplications.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Briefcase className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">No applications found</h2>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
        <Button onClick={onAddNew} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Add New Application
        </Button>
      </div>
    );
  }


  return (
    <div className="space-y-4">
      {filteredApplications.length ? filteredApplications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onView}
        />
      )) : applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onView}
        />
      ))}
    </div>
  );
}
