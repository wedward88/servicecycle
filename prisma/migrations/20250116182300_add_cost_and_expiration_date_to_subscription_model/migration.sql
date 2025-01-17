-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "cost" DECIMAL(65,30) DEFAULT 0.00,
ADD COLUMN     "expiration_date" TIMESTAMP(3);
