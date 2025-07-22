-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('ACTION', 'ADVENTURE', 'DRAMA', 'COMEDY', 'FANTASY', 'HORROR', 'MYSTERY', 'ROMANCE', 'SCI_FI', 'THRILLER', 'DOCUMENTARY', 'ANIMATION', 'CRIME');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'SERIES', 'SEASON');

-- CreateEnum
CREATE TYPE "Job" AS ENUM ('ACTOR', 'DIRECTOR', 'WRITER', 'PRODUCER', 'MUSIC', 'CINEMATOGRAPHER', 'EDITOR', 'COSTUME_DESIGNER', 'SOUND_DESIGNER', 'VISUAL_EFFECTS', 'OTHER');

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "genres" "Genre"[],
    "rating" DOUBLE PRECISION NOT NULL,
    "vPoster" TEXT NOT NULL,
    "hPoster" TEXT NOT NULL,
    "trailerLink" TEXT NOT NULL,
    "movieLink" TEXT NOT NULL,
    "tags" TEXT[],
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "genres" "Genre"[],
    "rating" DOUBLE PRECISION NOT NULL,
    "vPoster" TEXT NOT NULL,
    "hPoster" TEXT NOT NULL,
    "trailerLink" TEXT NOT NULL,
    "tags" TEXT[],
    "numberOfSeasons" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "vPoster" TEXT NOT NULL,
    "hPoster" TEXT NOT NULL,
    "trailerLink" TEXT NOT NULL,
    "noOfEpisodes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seriesId" TEXT NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "episodeLink" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seasonId" TEXT NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clip" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "referenceId" TEXT NOT NULL,
    "clipLink" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "referenceId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "reviewDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewText" TEXT NOT NULL,
    "reviewStars" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preferences" TEXT[],
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileAvatar" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchedMedia" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "referenceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WatchedMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncompleteMedia" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "referenceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "IncompleteMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "referenceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CastCrew" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "job" "Job" NOT NULL,
    "description" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "deathDate" TIMESTAMP(3),
    "imageUrls" TEXT[],
    "profilePhoto" TEXT NOT NULL,

    CONSTRAINT "CastCrew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieCast" (
    "id" TEXT NOT NULL,
    "characterName" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "castId" TEXT NOT NULL,

    CONSTRAINT "MovieCast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieCrew" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "crewId" TEXT NOT NULL,

    CONSTRAINT "MovieCrew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeriesCast" (
    "id" TEXT NOT NULL,
    "characterName" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "castId" TEXT NOT NULL,

    CONSTRAINT "SeriesCast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeriesCrew" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "crewId" TEXT NOT NULL,

    CONSTRAINT "SeriesCrew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeasonCast" (
    "id" TEXT NOT NULL,
    "characterName" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "castId" TEXT NOT NULL,

    CONSTRAINT "SeasonCast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeasonCrew" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "crewId" TEXT NOT NULL,

    CONSTRAINT "SeasonCrew_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Clip_referenceId_type_idx" ON "Clip"("referenceId", "type");

-- CreateIndex
CREATE INDEX "Review_referenceId_type_idx" ON "Review"("referenceId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clip" ADD CONSTRAINT "fk_clip_movie" FOREIGN KEY ("referenceId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clip" ADD CONSTRAINT "fk_clip_series" FOREIGN KEY ("referenceId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clip" ADD CONSTRAINT "fk_clip_season" FOREIGN KEY ("referenceId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "fk_review_movie" FOREIGN KEY ("referenceId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "fk_review_series" FOREIGN KEY ("referenceId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "fk_review_season" FOREIGN KEY ("referenceId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedMedia" ADD CONSTRAINT "WatchedMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncompleteMedia" ADD CONSTRAINT "IncompleteMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCast" ADD CONSTRAINT "MovieCast_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCast" ADD CONSTRAINT "MovieCast_castId_fkey" FOREIGN KEY ("castId") REFERENCES "CastCrew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCrew" ADD CONSTRAINT "MovieCrew_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCrew" ADD CONSTRAINT "MovieCrew_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "CastCrew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeriesCast" ADD CONSTRAINT "SeriesCast_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeriesCast" ADD CONSTRAINT "SeriesCast_castId_fkey" FOREIGN KEY ("castId") REFERENCES "CastCrew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeriesCrew" ADD CONSTRAINT "SeriesCrew_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeriesCrew" ADD CONSTRAINT "SeriesCrew_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "CastCrew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonCast" ADD CONSTRAINT "SeasonCast_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonCast" ADD CONSTRAINT "SeasonCast_castId_fkey" FOREIGN KEY ("castId") REFERENCES "CastCrew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonCrew" ADD CONSTRAINT "SeasonCrew_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonCrew" ADD CONSTRAINT "SeasonCrew_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "CastCrew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
