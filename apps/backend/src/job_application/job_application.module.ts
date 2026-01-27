import { Module } from '@nestjs/common';
import { JobApplicationController } from './job_application.controller';
import { DbModule } from '../db/db.module';
import { JobApplicationService } from './job_application.service';
import { MulterModule } from '@nestjs/platform-express';
import { StorageModule } from '../storage/storage.module';
import { StorageService } from '../storage/storage.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [DbModule, MulterModule, StorageModule],
  controllers: [JobApplicationController],
  providers: [JobApplicationService, StorageService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
  exports: [],
})
export class JobApplicationModule {}
