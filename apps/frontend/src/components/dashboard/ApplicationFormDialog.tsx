import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { STATUS_OPTIONS, type JobApplication, type JobApplicationInsert } from '../../types/application';
import { CVFileUpload } from './CVFileUpload';

interface ApplicationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: JobApplication | null;
  onSubmit: (data: JobApplicationInsert) => Promise<boolean>;
}

export function ApplicationFormDialog({
  open,
  onOpenChange,
  application,
  onSubmit,
}: ApplicationFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<JobApplicationInsert>({
    company: '',
    job_title: '',
    status: 'applied',
    applied_at: format(new Date(), 'yyyy-MM-dd'),
    applied_through: '',
    salary_range: '',
    location: '',
    link: '',
    cv_used: null
  });

  const [appliedDate, setAppliedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (application) {
      setFormData({
        company: application.company,
        job_title: application.job_title,
        status: application.status,
        applied_at: application.applied_at,
        salary_range: application.salary_range || '',
        applied_through: application.applied_through,
        location: application.location || '',
        link: application.link || '',
        cv_used: application.cv_used || null
      });
      setAppliedDate(new Date(application.applied_at));
    } else {
      setFormData({
        company: '',
        job_title: '',
        status: 'applied',
        applied_at: format(new Date(), 'yyyy-MM-dd'),
        applied_through: '',
        salary_range: '',
        location: '',
        link: '',
        cv_used: null
      });
      setAppliedDate(new Date());
    }
  }, [application, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await onSubmit({
      ...formData,
      applied_at: appliedDate ? format(appliedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      applied_through: formData.applied_through || null,
      salary_range: formData.salary_range || null,
      location: formData.location || null,
      link: formData.link || null,
      cv_used: application && application.cv_used !== (formData.cv_used instanceof File ? (formData.cv_used as File).name : formData.cv_used)  ? formData.cv_used : null,
    });

    setIsSubmitting(false);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {application ? 'Edit Application' : 'Add New Application'}
          </DialogTitle>
          <DialogDescription>
            {application ? 'Update the details of your job application.' : 'Track a new job application.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title *</Label>
              <Input
                id="job_title"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                required
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Applied Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal bg-background border-border',
                      !appliedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {appliedDate ? format(appliedDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                  <Calendar
                    mode="single"
                    selected={appliedDate}
                    onSelect={setAppliedDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Remote, New York"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_range">Salary Range</Label>
              <Input
                id="salary_range"
                value={formData.salary_range || ''}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                placeholder="e.g., $80k - $100k"
                className="bg-background border-border"
              />
            </div>

             <div className="space-y-2">
              <Label htmlFor="applied_through">Applied Through</Label>
              <Input
                id="applied_through"
                value={formData.applied_through || ''}
                onChange={(e) => setFormData({ ...formData, applied_through: e.target.value })}
                placeholder="e.g., Linkedin"
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Job URL</Label>
            <Input
              id="link"
              type="url"
              value={formData.link || ''}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://..."
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label>CV / Resume</Label>
            <CVFileUpload
              currentFile={formData.cv_used || null}
              onUploadComplete={(file) => setFormData({ ...formData, cv_used: file || null })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : application ? 'Save Changes' : 'Add Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
