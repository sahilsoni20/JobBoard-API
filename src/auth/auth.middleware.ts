import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.session || !req.session.id) {
      throw new UnauthorizedException('Not authenticated');
    }
    next();
  }
}
