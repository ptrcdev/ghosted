import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { DbService } from '../db/db.service';

@Injectable()
export class StorageService {
    constructor(private readonly dbService: DbService) { }

    private client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
    private logger = new Logger(StorageService.name);


    async uploadFile(file: Express.Multer.File, applicationId: string) {
        const path = `${file.originalname}--${applicationId}`
        this.logger.log(`Uploading file: ${file.originalname} to path: ${path}`);

        const { data, error } = await this.client.storage.from('cv').upload(path, file.buffer, {
            contentType: file.mimetype
        })

        if (error) throw new Error(error.message)


        await this.dbService.updateApplicationCvPath(applicationId, data.path)

        return data
    }

    async getFileForApplication(applicationId: string) {
        this.logger.log(`Getting file for application: ${applicationId}`);

        const application = await this.dbService.getJobById(applicationId);

        const { data, error } = await this.client.storage.from('cv').download(application.cv_used)

        if (error) throw new Error(error.message)

        return data
    }

    async updateCvFileForApplication(applicationId: string, file: Express.Multer.File) {
        const application = await this.dbService.getJobById(applicationId);

        const currentFile = application.cv_used;

        this.logger.log(`Updating file for application: ${applicationId}. The previous file will be replaced and therefore unretrievable.`);


        if (currentFile) {
            const { data, error } = await this.client.storage.from('cv').remove([currentFile]);

            if (error) throw new Error(error.message)
        }


        return await this.uploadFile(file, applicationId);
    }



}
