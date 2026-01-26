import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { CreateApplicationDto } from 'src/job_application/dtos/create-application.dto';
import { UpdateApplicationDto } from 'src/job_application/dtos/update-application.dto';

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
            { ...jobApplicationData }
        ]).select();

        if (error) throw new Error(error.message);
        return data[0];
    }


    async updateApplication(applicationId: string, applicationData: UpdateApplicationDto): Promise<boolean> {
        this.logger.log(`Updating job application by id: ${applicationId}`);

        // TODO: optimize this
        const application = await this.getJobById(applicationId);
        const { data, error } = await this.client.from('applications').update({ ...applicationData, cv_used: application.cv_used }).eq('id', applicationId).select();

        console.log(data)
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

}
