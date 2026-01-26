import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Request } from 'express';
import { JobApplicationService } from './job_application.service';
import { CreateApplicationDto } from './dtos/create-application.dto';
import { UpdateApplicationDto } from './dtos/update-application.dto';

@UseGuards(JwtAuthGuard)
@Controller('job-application')
export class JobApplicationController {

    constructor(private readonly jobApplicationService: JobApplicationService) {}

    @Get()
    async getJobApplicationsForUserId(@Req() req: Request) {
        const user = req.user as { userId: string };

        const data = await this.jobApplicationService.getApplicationsForUser(user.userId);

        if (!data) {
            return { message: "No applications found for this user" }
        }

        return data;
    }

    @Post()
    async addJobApplication(@Req() req: Request) {
        const user = req.user as { userId: string };
        const body = req.body as CreateApplicationDto;

        console.log(user);
        const data = await this.jobApplicationService.createJobApplication({
            ...body,
            user_id: user.userId
        });

        return data;
    }

    @Put(':applicationId')
    async updateApplication(@Param('applicationId') appId: string, @Body() updateApplicationData: UpdateApplicationDto) {
        const response = await this.jobApplicationService.updateApplication(appId, updateApplicationData);

        if (!response) {
            return { message: "Application not found" }
        }

        return response;
    }

    @Delete(':applicationId')
    async deleteApplication(@Param('applicationId') appId: string) {
        const response = await this.jobApplicationService.deleteApplication(appId);

        if (!response) {
            return { message: "Application not found" }
        }

        return response;
    }
}
