import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JobApplicationModule } from './job_application/job_application.module';
import { DbModule } from './db/db.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), JobApplicationModule, DbModule, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
