-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'CLOSED', 'DRAFT');

-- AlterTable
ALTER TABLE "Jobs" ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'OPEN';
