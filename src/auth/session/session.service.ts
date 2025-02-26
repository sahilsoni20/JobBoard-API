import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async createSession(userId: string, expiresAt: Date) {
    return this.prisma.session.create({
      data: { user_id: userId, expiresAt },
    });
  }

  async getSession(userId: string) {
    return this.prisma.session.findFirst({
      where: { user_id: userId },
    });
  }

  async deleteSession(sessionId: string) {
    return this.prisma.session.delete({
      where: { session_id: sessionId },
    });
  }
}
