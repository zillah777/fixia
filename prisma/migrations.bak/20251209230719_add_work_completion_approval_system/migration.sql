-- AlterTable
ALTER TABLE "Match" ADD COLUMN "providerApprovedCompletion" BOOLEAN,
ADD COLUMN "clientApprovedCompletion" BOOLEAN,
ADD COLUMN "providerCompletionComment" TEXT;
