import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import type { JobApplication, JobApplicationInsert, JobApplicationUpdate, ApplicationStatus, SortOption } from '../types/application';
import useAxiosAuth from './useAxiosAuth';
import axios from 'axios';
import { supabase } from '../lib/supabase';

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
            const response = await axiosAuth.post('/job-application', {
                ...application,
            });

            if (response.status !== 201) throw new Error('Failed to fetch applications');

            if (application.cv_used) {
                const { data } = await supabase.auth.getSession();
                const token = data.session?.access_token;

                if (!token) throw new Error('No auth token found');

                const form = new FormData();
                form.append('cv', application.cv_used);
                const upload_response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/job-application/${response.data.id}/cv`, form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    },
                }
                );

                if (upload_response.status > 299) throw new Error('Failed to upload CV');
            }
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
            const response = await axiosAuth.put(`/job-application/${id}`, {
                ...updates,
            });

            if (response.status < 200 || response.status > 299) throw new Error('Failed to update application');

            if (updates.cv_used) {
                const { data } = await supabase.auth.getSession();
                const token = data.session?.access_token;

                if (!token) throw new Error('No auth token found');

                const form = new FormData();
                form.append('cv', updates.cv_used);
                const upload_response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/job-application/cv/${id}`, form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    },
                }
                );

                if (upload_response.status > 299) throw new Error('Failed to upload CV');
            }
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
