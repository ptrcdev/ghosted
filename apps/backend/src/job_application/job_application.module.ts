import { Module } from '@nestjs/common';
import { JobApplicationController } from './job_application.controller';
import { DbModule } from 'src/db/db.module';
import { JobApplicationService } from './job_application.service';
import { MulterModule } from '@nestjs/platform-express';
import { StorageModule } from 'src/storage/storage.module';
import { StorageService } from 'src/storage/storage.service';
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
