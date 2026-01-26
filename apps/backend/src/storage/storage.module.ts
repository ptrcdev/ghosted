import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [StorageService]
})
export class StorageModule {}
