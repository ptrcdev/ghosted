import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as jwksRsa from "jwks-rsa";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(configService: ConfigService) {
        const supabaseUrl = configService.get<string>("SUPABASE_URL");
        if (!supabaseUrl) throw new Error("SUPABASE_URL is missing");

        const jwksUri = new URL("/auth/v1/.well-known/jwks.json", supabaseUrl).toString();

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            algorithms: ["ES256"],
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri,
            }),
            issuer: `${supabaseUrl}/auth/v1`,
            audience: "authenticated",
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
}
