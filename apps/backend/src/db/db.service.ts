import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { CreateApplicationDto } from 'src/job_application/dtos/create-application.dto';
import { UpdateApplicationDto } from 'src/job_application/dtos/update-application.dto';

@Injectable()
export class DbService {
    private client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

    get admin() {
        return this.client;
    }

    async getUserById(id: string) {
        const { data, error } = await this.client.from('users').select('*').eq('id', id);
        if (error) throw new Error(error.message);
        return data[0];
    }
    async jobApplicationsForUser(userId: string) {
        const { data, error } = await this.client.from('applications').select('*').eq('user_id', userId);
        
        if (error) throw new Error(error.message);
        return data;
    }

    async getJobById(id: string) {
        const { data, error } = await this.client.from('jobs').select('*').eq('id', id);
        if (error) throw new Error(error.message);
        return data[0];
    }


    async updateApplicationStatus(applicationId: string, status: string) {
        const { data, error } = await this.client.from('applications').update({ status }).eq('id', applicationId);
        if (error) throw new Error(error.message);
        return data;
    }


    async createApplication(jobApplicationData: CreateApplicationDto) {
        const { data, error } = await this.client.from('applications').insert([
            {...jobApplicationData}
        ]).select();

        if (error) throw new Error(error.message);
        return data[0];
    }


    async updateApplication(applicationId: string, applicationData: UpdateApplicationDto) {
        const { data, error } = await this.client.from('applications').update(applicationData).eq('id', applicationId);
        if (error) throw new Error(error.message);
        return data;
    }


    async deleteApplication(applicationId: string) {
        const { data, error } = await this.client.from('applications').delete().eq('id', applicationId);
        if (error) throw new Error(error.message);
        return data;
    }

}
