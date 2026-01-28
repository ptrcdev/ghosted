import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JobApplicationModule } from './job_application/job_application.module';
import { DbModule } from './db/db.module';
import { StorageModule } from './storage/storage.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), JobApplicationModule, DbModule, StorageModule, ThrottlerModule.forRoot({
    throttlers: [
      {
        ttl: 60000,
        limit: 25,
      }
    ]
  }), StatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
