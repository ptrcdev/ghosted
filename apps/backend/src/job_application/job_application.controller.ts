import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors, Version } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { JobApplicationService } from './job_application.service';
import { CreateApplicationDto } from './dtos/create-application.dto';
import { UpdateApplicationDto } from './dtos/update-application.dto';
import { User } from '../auth/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';

@UseGuards(JwtAuthGuard)
@Controller('job-application')
export class JobApplicationController {

    constructor(private readonly jobApplicationService: JobApplicationService, private readonly storageService: StorageService) { }

    @Version('1')
    @Get()
    async getJobApplicationsForUserId(@User() user: { userId: string }) {
        const data = await this.jobApplicationService.getApplicationsForUser(user.userId);

        if (!data) {
            return { message: "No applications found for this user" }
        }

        return data;
    }

    @Version('1')
    @Get(':jobId')
    async getJobApplicationById(@Param('jobId') jobId: string) {
        const data = await this.jobApplicationService.getApplicationById(jobId);

    
        if (!data) {
            return { message: "Application not found" }
        }

        return data;
    }

    @Version('1')
    @Post()
    async addJobApplication(@User() user: { userId: string }, @Body() createApplicationDto: CreateApplicationDto) {

        const data = await this.jobApplicationService.createJobApplication({
            ...createApplicationDto,
            user_id: user.userId
        });

        return data;
    }

    @Version('1')
    @Post(':applicationId/cv')
    @UseInterceptors(FileInterceptor('cv'))
    async uploadCvForApplication(@Param('applicationId') applicationId: string, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new FileTypeValidator({ fileType: 'pdf' })
        ],
        exceptionFactory: (errors) => {
            throw new BadRequestException(`File validation failed: ${errors}`);
        }
    })) cv: Express.Multer.File) {
        const response = await this.storageService.uploadFile(cv, applicationId);
        return { message: "CV uploaded successfully", response };

    }


    @Version('1')
    @Get('cv/download/:applicationId')
    async downloadCv(@Param('applicationId') applicationId: string) {
        return await this.storageService.getFileForApplication(applicationId);
    }

    @Version('1')
    @Put(':applicationId')
    async updateApplication(@Param('applicationId') appId: string, @Body() updateApplicationData: UpdateApplicationDto) {
        const response = await this.jobApplicationService.updateApplication(appId, updateApplicationData);

        if (!response) {
            return { message: "Application not found" }
        }

        return response;
    }

    @Version('1')
    @Put('cv/:applicationId')
    @UseInterceptors(FileInterceptor('cv'))
    async updateCvForApplication(@Param('applicationId') applicationId: string, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new FileTypeValidator({ fileType: 'application/pdf' })
        ],
        exceptionFactory: (errors) => {
            throw new BadRequestException(`File validation failed: ${errors}`);
        }
    })) cv: Express.Multer.File) {
        const response = await this.storageService.updateCvFileForApplication(applicationId, cv);

        return { message: "CV updated successfully", response };
    }


    @Version('1')
    @Delete(':applicationId')
    async deleteApplication(@Param('applicationId') appId: string) {
        const response = await this.jobApplicationService.deleteApplication(appId);

        if (!response) {
            return { message: "Application not found" }
        }

        return response;
    }
}
