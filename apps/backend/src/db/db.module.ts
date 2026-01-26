import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  providers: [DbService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
  exports: [DbService],
})
export class DbModule { }
