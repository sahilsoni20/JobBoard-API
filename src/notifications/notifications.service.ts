import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  // Send a notification
  async sendNotification(userId: string, message: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
  }

  // Get unread notifications
  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Mark notifications as read
  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }
}
