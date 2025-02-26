import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsDto } from './dto/jobs.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('jobs')
@UseGuards(RolesGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('create')
  @Roles('EMPLOYER', 'ADMIN')
  async createJob(@Body() jobData: JobsDto, @Request() req) {
    return this.jobsService.createJob(
      req.session.user.id,
      req.session.user.id,
      jobData,
    );
  }

  @Get()
  async getAllJobs(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.jobsService.getAllJobs(page, Number(limit));
  }

  @Get(':id')
  async getJobById(@Param('id') jobId: string) {
    return this.jobsService.getJobById(jobId);
  }

  @Patch(':id')
  @Roles('EMPLOYER', 'ADMIN')
  async updateJob(
    @Param('id') jobId: string,
    @Body() updateData: Partial<JobsDto>,
    @Request() req,
  ) {
    return this.jobsService.updateJob(jobId, req.session.user.id, updateData);
  }

  @Delete(':id')
  @Roles('EMPLOYER', 'ADMIN')
  async deleteJob(@Param('id') jobId: string, @Request() req) {
    return this.jobsService.deleteJob(jobId, req.session.user.id);
  }
}
