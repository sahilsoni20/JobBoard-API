import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { AdminService } from './admin.service';
import { AdminDto } from './dto/admin.dto';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getAllUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.adminService.getAllUsers(page, Number(limit));
  }

  @Get('user/:id')
  async getUserById(@Param('id') userId: string) {
    return this.adminService.getUserById(userId);
  }

  @Patch('user/:id')
  async updateUserRole(@Param('id') userId: string, @Body() dto: AdminDto) {
    return this.adminService.updateUserRole(userId, dto.role);
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  // Update any job as Admin
  @Patch('jobs/:id')
  @Roles('ADMIN')
  async updateJobAsAdmin(
    @Param('id') jobId: string,
    @Body() updateData: any,
  ) {
    return this.adminService.updateJobAsAdmin(jobId, updateData);
  }

  // Delete any job as Admin
  @Delete('jobs/:id')
  @Roles('ADMIN')
  async deleteJobAsAdmin(@Param('id') jobId: string) {
    return this.adminService.deleteJobAsAdmin(jobId);
  }
}
