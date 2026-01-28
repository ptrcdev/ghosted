import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { CreateApplicationDto } from '../job_application/dtos/create-application.dto';
import { UpdateApplicationDto } from '../job_application/dtos/update-application.dto';

@Injectable()
export class DbService {
    private logger = new Logger(DbService.name);

    private client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

    get admin() {
        return this.client;
    }

    async getUserById(id: string) {
        this.logger.log(`Getting user by id: ${id}`);

        const { data, error } = await this.client.from('users').select('*').eq('id', id);
        if (error) throw new Error(error.message);
        return data[0];
    }

    async jobApplicationsForUser(userId: string) {
        this.logger.log(`Getting job applications for user: ${userId}`);
        const { data, error } = await this.client.from('applications').select('*').eq('user_id', userId);

        if (error) throw new Error(error.message);
        return data;
    }

    async getJobById(id: string) {
        this.logger.log(`Getting job application by id: ${id}`);

        const { data, error } = await this.client.from('applications').select('*').eq('id', id);
        if (error) throw new Error(error.message);
        return data[0];
    }


    async createApplication(jobApplicationData: CreateApplicationDto) {
        this.logger.log(`Creating job application for user: ${jobApplicationData.user_id} for company ${jobApplicationData.company} and title ${jobApplicationData.job_title}`);

        const { data, error } = await this.client.from('applications').insert([
            { ...jobApplicationData, status_uplied_at: new Date() }
        ]).select();

        if (error) throw new Error(error.message);
        return data[0];
    }


    async updateApplication(applicationId: string, applicationData: UpdateApplicationDto): Promise<boolean> {
        this.logger.log(`Updating job application by id: ${applicationId}`);

        // TODO: optimize this
        const application = await this.getJobById(applicationId);
        const { data, error } = await this.client.from('applications').update({ ...applicationData, cv_used: application.cv_used, status_updated_at: applicationData.status !== application.staus ? new Date() : application.status_updated_at }).eq('id', applicationId).select();

        if (error) throw new Error(error.message);
        return true;
    }

    async updateApplicationCvPath(applicationId: string, cv_used: string): Promise<boolean> {

        this.logger.log(`Updating job application cv path by id: ${applicationId}`);

        const { data, error } = await this.client.from('applications').update({ cv_used }).eq('id', applicationId);

        if (error) throw new Error(error.message);

        return true;
    }


    async deleteApplication(applicationId: string) {
        this.logger.log(`Deleting job application by id: ${applicationId}`);

        const { data, error } = await this.client.from('applications').delete().eq('id', applicationId);
        if (error) throw new Error(error.message);
        return true;
    }

    async getStatsForUser(user_id: string) {
        const { data, error } = await this.client.from('applications').select('*').eq('user_id', user_id);
        if (error) throw new Error(error.message);
        const stats = [
            { label: 'Total', value: data.length, color: "text-primary" },
            { label: 'Interview', value: data.filter(d => d.status === 'interview').length, color: 'text-blue-400' },
            { label: 'Screening', value: data.filter(d => d.status === 'screening').length, color: 'text-yellow-400' },
            { label: 'Offer', value: data.filter(d => d.status === 'offer').length, color: 'text-green-400' },
            { label: 'Rejected', value: data.filter(d => d.status === 'rejected').length, color: 'text-red-400' },
            { label: 'Ghosted', value: data.filter(d => d.status === 'ghosted').length, color: 'text-gray-400' },
        ];

        this.logger.log(`Successfully fetched stats for user: ${user_id}`)

        return stats;
    }

}