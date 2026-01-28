import { Controller, Get, Logger, UseGuards, Version } from '@nestjs/common';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { StatsService } from './stats.service';

@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
    private logger = new Logger(StatsController.name);

    constructor(private readonly statsService: StatsService) {}

    @Version('1')
    @Get()
    async getStatsForUser(@User() user: { userId: string }) {
        this.logger.log(`User ${user.userId} requested stats.`);

        return await this.statsService.getStatsForUser(user.userId);

    }
}
