import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getResponse();
    return !!request.session.userId;
  }
}


// it will ensure that only authenticated user can access the protected routes