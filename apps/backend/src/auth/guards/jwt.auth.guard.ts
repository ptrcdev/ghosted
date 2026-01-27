import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request & { method?: string }>();
    if (req?.method === 'OPTIONS') return true; // ✅ allow preflight
    return super.canActivate(context) as any;
  }
}
