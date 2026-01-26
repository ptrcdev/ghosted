import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { SupabaseStrategy } from './strategies/supabase.strategy';

@Module({
    imports: [PassportModule, ConfigModule, JwtModule.registerAsync({
        useFactory: (configService: ConfigService) => {
            return {
                global: true,
                secret: configService.get('SUPABASE_KEY'),
                signOptions: { expiresIn: '1h' }
            }
        },
        inject: [ConfigService]
    })],
    providers: [JwtAuthGuard, SupabaseStrategy],
    exports: [JwtAuthGuard, JwtModule]
})
export class AuthModule { }
