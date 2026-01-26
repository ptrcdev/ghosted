import { Injectable, Logger } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateApplicationDto } from './dtos/create-application.dto';
import { UpdateApplicationDto } from './dtos/update-application.dto';

@Injectable()
export class JobApplicationService {
    constructor(private readonly dbService: DbService) {}

    async getApplicationsForUser(userId: string) {
        return await this.dbService.jobApplicationsForUser(userId);
    }

    async createJobApplication(jobApplicationData: CreateApplicationDto) {
       
        return await this.dbService.createApplication(jobApplicationData);
    }

    async updateApplication(applicationId: string, jobApplicationUpdateData: UpdateApplicationDto) {
        return await this.dbService.updateApplication(applicationId, jobApplicationUpdateData);
    }

    async deleteApplication(applicationId: string) {
        return await this.dbService.deleteApplication(applicationId);
    }

    async getApplicationById(applicationId: string) {
        return await this.dbService.getJobById(applicationId);
    }
}
