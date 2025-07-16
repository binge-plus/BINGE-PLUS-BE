/*
  Warnings:

  - You are about to drop the column `referenceId` on the `Clip` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Clip" DROP CONSTRAINT "fk_clip_movie";

-- DropForeignKey
ALTER TABLE "Clip" DROP CONSTRAINT "fk_clip_season";

-- DropForeignKey
ALTER TABLE "Clip" DROP CONSTRAINT "fk_clip_series";

-- DropIndex
DROP INDEX "Clip_referenceId_type_idx";

-- AlterTable
ALTER TABLE "Clip" DROP COLUMN "referenceId",
ADD COLUMN     "movieId" TEXT,
ADD COLUMN     "seasonId" TEXT,
ADD COLUMN     "seriesId" TEXT;

-- CreateIndex
CREATE INDEX "Clip_movieId_idx" ON "Clip"("movieId");

-- CreateIndex
CREATE INDEX "Clip_seriesId_idx" ON "Clip"("seriesId");

-- CreateIndex
CREATE INDEX "Clip_seasonId_idx" ON "Clip"("seasonId");

-- AddForeignKey
ALTER TABLE "Clip" ADD CONSTRAINT "Clip_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clip" ADD CONSTRAINT "Clip_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clip" ADD CONSTRAINT "Clip_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;
