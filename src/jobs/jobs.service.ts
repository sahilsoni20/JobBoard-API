import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobsDto } from './dto/jobs.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async createJob(userId: string, employerId: string, jobData: JobsDto) {
    return await this.prisma.jobs.create({
      data: {
        userId: userId,
        employer_id: employerId,
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        salary: jobData.salary,
        category: jobData.category,
      },
    });
  }

  async getAllJobs(page: number = 1, limit: number = 10) {
    return await this.prisma.jobs.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getJobById(jobId: string) {
    const job = await this.prisma.jobs.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async updateJob(
    jobId: string,
    employerId: string,
    updateData: {
      title?: string;
      description?: string;
      location?: string;
      salary?: number;
      category?: string;
    },
  ) {
    const job = await this.prisma.jobs.findUnique({ where: { id: jobId } });

    if (!job) throw new NotFoundException('Job not found');
    if (job.employer_id !== employerId)
      throw new NotFoundException('Unauthorized');

    return await this.prisma.jobs.update({
      where: { id: jobId },
      data: updateData,
    });
  }

  async deleteJob(jobId: string, employerId: string) {
    const job = await this.prisma.jobs.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.employer_id !== employerId)
      throw new NotFoundException('Unauthorized');

    return await this.prisma.jobs.delete({ where: { id: jobId } });
  }
}
