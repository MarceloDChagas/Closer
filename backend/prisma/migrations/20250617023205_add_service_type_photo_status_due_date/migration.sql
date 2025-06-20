/*
  Warnings:

  - Added the required column `serviceType` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "dueDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "photoDeliveryStatus" TEXT NOT NULL DEFAULT 'NOT_DELIVERED',
ADD COLUMN     "serviceType" TEXT;

-- Update existing rows with a default service type
UPDATE "Session" SET "serviceType" = 'BOOK' WHERE "serviceType" IS NULL;

-- Make serviceType NOT NULL after setting defaults
ALTER TABLE "Session" ALTER COLUMN "serviceType" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Payment_clientId_idx" ON "Payment"("clientId");

-- CreateIndex
CREATE INDEX "Payment_sessionId_idx" ON "Payment"("sessionId");

-- CreateIndex
CREATE INDEX "Session_clientId_idx" ON "Session"("clientId");
