// USE CASE:
// Reads the required roles for a route using NestJS Reflector
// Checks if the user’s role matches the required roles
// If not, throws a 403 ForbiddenException

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    // If no roles are required, allow access
    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.session?.user;

    if (!user) {

      throw new ForbiddenException('Access denied');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
