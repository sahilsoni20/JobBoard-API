import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApplicationStatus } from '@prisma/client';
import { NotificationService } from 'src/notifications/notifications.service';


@Injectable()
export class JobApplicationsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService, // ✅ Inject NotificationService
  ) {}

  // Apply for a job (with duplicate check)
  async applyForJob(userId: string, jobId: string, resumeUrl?: string) {
    // Ensure the job exists and is open
    const job = await this.prisma.jobs.findUnique({ where: { id: jobId } });

    if (!job || job.status !== 'OPEN') {
      throw new NotFoundException('Job not found or closed');
    }

    // Check if the user has already applied
    const existingApplication = await this.prisma.jobApplication.findFirst({
      where: { job_id: jobId, user_id: userId },
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied for this job.');
    }

    const application = await this.prisma.jobApplication.create({
      data: {
        job_id: jobId,
        user_id: userId,
        resumeUrl: resumeUrl || null, // Ensures null if undefined
      },
    });

    // Notify employer about new application
    await this.notificationService.sendNotification(
      job.employer_id,
      `📩 New application received for "${job.title}".`
    );

    return application;
  }

  // Get user applications
  async getUserApplications(userId: string) {
    return this.prisma.jobApplication.findMany({
      where: { user_id: userId },
      include: { job: true },
    });
  }

  // Get all applications for a specific job (Employer only)
  async getApplicationsForJob(jobId: string, employerId: string) {
    const job = await this.prisma.jobs.findUnique({
      where: { id: jobId, employer_id: employerId },
    });

    if (!job) throw new NotFoundException('Job not found or not authorized');

    return this.prisma.jobApplication.findMany({
      where: { job_id: jobId },
      include: { user: true },
    });
  }

  // Update application status (with notification)
  async updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
    const application = await this.prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: { job: true, user: true },
    });

    if (!application) throw new NotFoundException('Application not found');

    const updatedApplication = await this.prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    // Notify user about status update
    await this.notificationService.sendNotification(
      application.user.id,
      `📢 Your application for "${application.job.title}" has been ${status.toLowerCase()}.`
    );

    return updatedApplication;
  }

  // Get all job applications (Admin use)
  async getAllApplications() {
    return this.prisma.jobApplication.findMany({
      include: { job: true, user: true },
    });
  }
}
