import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ExternalLink, MapPin, DollarSign, Calendar, FileText, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { STATUS_OPTIONS, type JobApplication } from '../../types/application';
import { cn } from '../../lib/utils';

interface ApplicationViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: JobApplication | null;
  onEdit: (application: JobApplication) => void;
}

export function ApplicationViewDialog({
  open,
  onOpenChange,
  application,
  onEdit,
}: ApplicationViewDialogProps) {
  if (!application) return null;

  const statusConfig = STATUS_OPTIONS.find((s) => s.value === application.status);

  const handleEdit = () => {
    onOpenChange(false);
    onEdit(application);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-foreground text-xl">
                {application.company}
              </DialogTitle>
              <p className="text-muted-foreground mt-1">{application.job_title}</p>
            </div>
            <Badge className={cn('border shrink-0', statusConfig?.color)}>
              {statusConfig?.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Applied On</p>
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {format(new Date(application.applied_at), 'MMMM d, yyyy')}
              </div>
            </div>

            {application.location && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Location</p>
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {application.location}
                </div>
              </div>
            )}

            {application.salary_range && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Salary Range</p>
                <div className="flex items-center gap-2 text-foreground">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  {application.salary_range}
                </div>
              </div>
            )}

            {application.cv_used && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">CV/Resume</p>
                <div className="flex items-center gap-2 text-foreground">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {application.cv_used}
                </div>
              </div>
            )}
          </div>

          {application.link && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Job Posting</p>
              <a
                href={application.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                View Job Posting
              </a>
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Last updated: {format(new Date(application.updated_at), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
