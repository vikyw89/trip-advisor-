-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_itineraryId_fkey";

-- AlterTable
ALTER TABLE "Trip" ALTER COLUMN "itineraryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
