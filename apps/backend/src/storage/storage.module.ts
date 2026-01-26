import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { DbModule } from 'src/db/db.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [DbModule],
  providers: [StorageService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }]
})
export class StorageModule {}
