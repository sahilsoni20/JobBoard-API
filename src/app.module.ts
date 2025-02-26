import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from './auth/session/session.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { AdminModule } from './admin/admin.module';
import { JobApplicationModule } from './job_application/job_applications.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SessionModule,
    AuthModule,
    JobsModule,
    AdminModule,
    JobApplicationModule,
    NotificationsModule,
  ],
})
export class AppModule {}
