/*
  Warnings:

  - The values [CINEMATOGRAPHER,EDITOR,COSTUME_DESIGNER,SOUND_DESIGNER,VISUAL_EFFECTS,OTHER] on the enum `Job` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `image` on the `Clip` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `Review` table. All the data in the column will be lost.
  - Changed the column `job` on the `CastCrew` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.
  - Added the required column `progress` to the `IncompleteMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Job_new" AS ENUM ('ACTOR', 'DIRECTOR', 'WRITER', 'PRODUCER', 'MUSIC');
ALTER TABLE "CastCrew" ALTER COLUMN "job" TYPE "Job_new"[] USING ("job"::text::"Job_new"[]);
ALTER TYPE "Job" RENAME TO "Job_old";
ALTER TYPE "Job_new" RENAME TO "Job";
DROP TYPE "Job_old";
COMMIT;

-- AlterEnum
ALTER TYPE "MediaType" ADD VALUE 'EPISODE';

-- AlterTable
ALTER TABLE "CastCrew" ALTER COLUMN "job" SET DATA TYPE "Job"[];

-- AlterTable
ALTER TABLE "Clip" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "IncompleteMedia" ADD COLUMN     "progress" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "author",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "IncompleteMedia_referenceId_type_idx" ON "IncompleteMedia"("referenceId", "type");

-- CreateIndex
CREATE INDEX "WatchedMedia_referenceId_type_idx" ON "WatchedMedia"("referenceId", "type");

-- CreateIndex
CREATE INDEX "Wishlist_referenceId_type_idx" ON "Wishlist"("referenceId", "type");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedMedia" ADD CONSTRAINT "fk_watched_movie" FOREIGN KEY ("referenceId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedMedia" ADD CONSTRAINT "fk_watched_season" FOREIGN KEY ("referenceId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncompleteMedia" ADD CONSTRAINT "fk_incomplete_movie" FOREIGN KEY ("referenceId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncompleteMedia" ADD CONSTRAINT "fk_incomplete_episode" FOREIGN KEY ("referenceId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "fk_wishlist_movie" FOREIGN KEY ("referenceId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "fk_wishlist_series" FOREIGN KEY ("referenceId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
