import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { MoreHorizontal, Pencil, Trash2, MapPin, DollarSign, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { STATUS_OPTIONS, type JobApplication } from '../../types/application';
import { cn } from '../../lib/utils';

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => Promise<boolean>;
  onClick: (application: JobApplication) => void;
}

export function ApplicationCard({ application, onEdit, onDelete, onClick }: ApplicationCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusConfig = STATUS_OPTIONS.find((s) => s.value === application.status);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(application.id);
    setIsDeleting(false);
    setShowDeleteDialog(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, a, [role="menuitem"]')) {
      return;
    }
    onClick(application);
  };

  return (
    <>
      <Card 
        className="bg-card border-border hover:border-primary/30 transition-colors cursor-pointer"
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{application.company}</h3>
              </div>
              <p className="text-sm text-muted-foreground truncate">{application.job_title}</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={cn('border', statusConfig?.color)}>
                {statusConfig?.label}
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem onClick={() => onEdit(application)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(application.applied_at), 'MMM d, yyyy')}
            </div>
            {application.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {application.location}
              </div>
            )}
            {application.salary_range && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {application.salary_range}
              </div>
            )}
            {application.cv_used && (
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                CV
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your application for {application.job_title} at{' '}
              {application.company}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
