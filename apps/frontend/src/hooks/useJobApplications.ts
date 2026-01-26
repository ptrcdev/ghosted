import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import type { JobApplication, JobApplicationInsert, JobApplicationUpdate, ApplicationStatus, SortOption } from '../types/application';
import useAxiosAuth from './useAxiosAuth';

export function useJobApplications() {
    const axiosAuth = useAxiosAuth();
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
    const [sortOption, setSortOption] = useState<SortOption>('applied_at_desc');
    const { toast } = useToast();

    const fetchApplications = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axiosAuth.get('/job-application');

            if (response.status !== 200) throw new Error('Failed to fetch applications');

            setApplications(response.data);
            setFilteredApplications(response.data);

            if (statusFilter !== 'all') {
                setFilteredApplications(applications.filter(app => app.status === statusFilter));
            }

            // Apply sorting
            switch (sortOption) {
                case 'applied_at_desc':
                    setFilteredApplications(prev => [...prev].sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()));
                    break;
                case 'applied_at_asc':
                    setFilteredApplications(prev => [...prev].sort((a, b) => new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime()));
                    break;
                case 'updated_at_desc':
                    setFilteredApplications(prev => [...prev].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
                    break;
                case 'company_name_asc':
                    setFilteredApplications(prev => [...prev].sort((a, b) => a.company.localeCompare(b.company)));
                    break;
                case 'company_name_desc':
                    setFilteredApplications(prev => [...prev].sort((a, b) => b.company.localeCompare(a.company)));
                    break;
            }
        } catch (error: any) {
            toast({
                title: 'Error fetching applications',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, sortOption, toast]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const createApplication = async (application: JobApplicationInsert) => {
        try {
            // const { data: { user } } = await supabase.auth.getUser();
            // if (!user) throw new Error('Not authenticated');

            // const { error } = await supabase
            //     .from('job_applications')
            //     .insert({ ...application, user_id: user.id });

            // if (error) throw error;

            // toast({
            //     title: 'Application added',
            //     description: 'Your job application has been saved.',
            // });

            // fetchApplications();
            // return true;
            const response = await axiosAuth.post('/job-application', {
                ...application,
            });

            if (response.status !== 201) throw new Error('Failed to fetch applications');
            fetchApplications();
            return true;
        } catch (error: any) {
            toast({
                title: 'Error adding application',
                description: error.message,
                variant: 'destructive',
            });
            return false;
        }
    };

    const updateApplication = async (id: string, updates: JobApplicationUpdate) => {
        try {
            // const { error } = await supabase
            //     .from('job_applications')
            //     .update(updates)
            //     .eq('id', id);

            // if (error) throw error;

            // toast({
            //     title: 'Application updated',
            //     description: 'Your changes have been saved.',
            // });

            // fetchApplications();
            // return true;

            const response = await axiosAuth.put(`/job-application/${id}`, {
                ...updates,
            });

            if (response.status < 200 || response.status > 299) throw new Error('Failed to update application');

            fetchApplications();
            return true;

        } catch (error: any) {
            toast({
                title: 'Error updating application',
                description: error.message,
                variant: 'destructive',
            });
            return false;
        }
    };

    const deleteApplication = async (id: string) => {
        try {
            // const { error } = await supabase
            //     .from('job_applications')
            //     .delete()
            //     .eq('id', id);

            // if (error) throw error;

            // toast({
            //     title: 'Application deleted',
            //     description: 'The application has been removed.',
            // });

            // fetchApplications();
            // return true;

            const response = await axiosAuth.delete(`/job-application/${id}`);

            if (response.status !== 200) throw new Error('Failed to delete application');

            fetchApplications();
            return true;
        } catch (error: any) {
            toast({
                title: 'Error deleting application',
                description: error.message,
                variant: 'destructive',
            });
            return false;
        }
    };

    return {
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
        refetch: fetchApplications,
    };
}
