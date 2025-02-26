import { ApplicationStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class JobApplicationDTO {
    @IsEnum(ApplicationStatus)
    status: ApplicationStatus;
}