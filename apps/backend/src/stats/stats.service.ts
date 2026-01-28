import { Injectable, Logger } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class StatsService {
    private logger = new Logger(StatsService.name);

    constructor(private readonly dbService: DbService) {}

    async getStatsForUser(user_id: string) {
        this.logger.log(`Fetching stats for user: ${user_id}`);
        
        return await this.dbService.getStatsForUser(user_id);
    }
}
