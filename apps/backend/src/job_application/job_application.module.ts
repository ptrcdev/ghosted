import { Module } from '@nestjs/common';
import { JobApplicationController } from './job_application.controller';
import { DbModule } from 'src/db/db.module';
import { JobApplicationService } from './job_application.service';

@Module({
  imports: [DbModule],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
  exports: [],
})
export class JobApplicationModule {}
