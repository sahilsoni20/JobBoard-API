import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { JobApplicationsService } from './job_applications.service';
import { JobApplicationDTO } from './dto/job_applications.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer-config';

@Controller('applications')
@UseGuards(RolesGuard)
export class JobApplicationsController {
  constructor(
    private readonly jobApplicationsService: JobApplicationsService,
  ) {}

  @Post(':jobId/apply')
  @Roles('JOB_SEEKER')
  async applyForJob(
    @Request() req, // ✅ Move required parameter first
    @Param('jobId') jobId: string,
    @Body('resumeUrl') resumeUrl?: string, // ✅ Optional parameter at the end
  ) {
    return this.jobApplicationsService.applyForJob(
      req.session.user.id,
      jobId,
      resumeUrl, // ✅ Will be `undefined` if not provided
    );
  }

  @Post('upload-resume')
  @UseInterceptors(FileInterceptor('resume', multerConfig))
  async uploadResume(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('Resume file is required!');
    }
    return { resumeUrl: `/uploads/resumes/${file.filename}` };
  }

  @Get('my-applications')
  @Roles('JOB_SEEKER')
  async getMyApplications(@Request() req) {
    return this.jobApplicationsService.getUserApplications(req.session.user.id);
  }

  @Get(':jobId/employer')
  @Roles('EMPLOYER')
  async getApplicationsForJob(@Param('jobId') jobId: string, @Request() req) {
    return this.jobApplicationsService.getApplicationsForJob(
      jobId,
      req.session.user.id,
    );
  }

  @Patch(':applicationId/status')
  @Roles('EMPLOYER', 'ADMIN')
  async updateApplicationStatus(
    @Param('applicationId') applicationId: string,
    @Body() statusData: JobApplicationDTO,
  ) {
    return this.jobApplicationsService.updateApplicationStatus(
      applicationId,
      statusData.status,
    );
  }

  @Get('admin/all')
  @Roles('ADMIN')
  async getAllApplications() {
    return this.jobApplicationsService.getAllApplications();
  }
}
