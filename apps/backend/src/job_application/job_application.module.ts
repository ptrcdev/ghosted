import { Module } from '@nestjs/common';
import { JobApplicationController } from './job_application.controller';
import { DbModule } from 'src/db/db.module';
import { JobApplicationService } from './job_application.service';
import { MulterModule } from '@nestjs/platform-express';
import { StorageModule } from 'src/storage/storage.module';
import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [DbModule, MulterModule, StorageModule],
  controllers: [JobApplicationController],
  providers: [JobApplicationService, StorageService],
  exports: [],
})
export class JobApplicationModule {}
