import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { DbService } from 'src/db/db.service';

@Injectable()
export class StorageService {
    constructor(private readonly dbService: DbService) { }

    private client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)


    async uploadFile(file: Express.Multer.File, applicationId: string) {
        const path = `${file.originalname}--${applicationId}`
        const { data, error } = await this.client.storage.from('cv').upload(path, file.buffer, {
            contentType: file.mimetype
        })

        if (error) throw new Error(error.message)


        await this.dbService.updateApplicationCvPath(applicationId, data.path)

        return data
    }

    async getFileForApplication(applicationId: string) {
        const application = await this.dbService.getJobById(applicationId);

        const { data, error } = await this.client.storage.from('cv').download(application.cv_used)

        if (error) throw new Error(error.message)

        return data
    }

    async updateCvFileForApplication(applicationId, file: Express.Multer.File) {
        const application = await this.dbService.getJobById(applicationId);

        const currentFile = application.cv_used;

        if (currentFile === '{}') {
            await this.client.storage.from('cv').remove([currentFile]);
        }


        return await this.uploadFile(file, applicationId);
    }



}
