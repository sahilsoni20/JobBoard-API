import { Controller, Get, Patch, Post, Body, Param } from '@nestjs/common';
import { NotificationService } from './notifications.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  // ✅ Send a new notification
  @Post('send')
  async sendNotification(
    @Body('userId') userId: string,
    @Body('message') message: string,
  ) {
    return this.notificationService.sendNotification(userId, message);
  }

  // ✅ Mark a notification as read
  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: string) {
    return this.notificationService.markAsRead(notificationId);
  }
}
