/*
  Warnings:

  - Changed the type of `resumeUrl` on the `JobApplication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "resumeUrl",
ADD COLUMN     "resumeUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Jobs" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
