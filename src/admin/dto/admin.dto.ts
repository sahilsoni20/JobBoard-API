import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class AdminDto {
  @IsEnum(Role, { message: 'Role must be ADMIN, EMPLOYER, or JOB_SEEKER' })
  role: Role;
}
