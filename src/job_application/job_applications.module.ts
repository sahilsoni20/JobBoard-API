import { Module } from '@nestjs/common';
import { JobApplicationsService } from './job_applications.service';
import { JobApplicationsController } from './job_applications.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [JobApplicationsController],
  providers: [JobApplicationsService]
})
export class JobApplicationModule {}
