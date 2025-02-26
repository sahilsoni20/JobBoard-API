import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(page: number, limit: number) {
    const skip = (page - 1) * Number(limit);
    const users = await this.prisma.user.findMany({ skip, take: limit });
    return users
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user
  }

  async updateUserRole(userId: string, newRole: Role) {
    const user = await this.prisma.user.update({
        where: {id: userId},
        data: {role: newRole}
    })
    return {message: "User updated successfully", user}
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({where: {id: userId}})
    return {message: "User deleted successfully"}
  }

  // Update any job as Admin
  async updateJobAsAdmin(jobId: string, updateData: any) {
    const job = await this.prisma.jobs.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');

    return this.prisma.jobs.update({
      where: { id: jobId },
      data: updateData,
    });
  }

  // Delete any job as Admin
  async deleteJobAsAdmin(jobId: string) {
    const job = await this.prisma.jobs.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');

    await this.prisma.jobs.delete({ where: { id: jobId } });
    return { message: 'Job deleted successfully' };
  }
}
