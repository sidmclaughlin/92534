-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CONSTRUCTION', 'INCIDENT', 'ROAD_CONDITION', 'SPECIAL_EVENT', 'WEATHER_CONDITION');

-- CreateEnum
CREATE TYPE "EventSubtype" AS ENUM ('ACCIDENT', 'SPILL', 'OBSTRUCTION', 'HAZARD', 'ROAD_MAINTENANCE', 'ROAD_CONSTRUCTION', 'EMERGENCY_MAINTENANCE', 'PLANNED_EVENT', 'CROWD', 'HAIL', 'THUNDERSTORM', 'HEAVY_DOWNPOUR', 'STRONG_WINDS', 'BLOWING_DUST', 'SANDSTORM', 'INSECT_SWARMS', 'AVALANCH_HAZARD', 'SURFACE_WATER_HAZARD', 'MUD', 'LOOSE_GRAVEL', 'OIL_ON_HIGHWAY', 'FIRE', 'SIGNAL_LIGHT_FAILURE', 'PARTLY_ICY', 'ICE_COVERED', 'PARTLY_SNOW_PACKED', 'SNOW_PACKED', 'PARTLY_SNOW_COVERED', 'SNOW_COVERED', 'DRIFTING_SNOW', 'POOR_VISIBILITY', 'ALMOST_IMPASSABLE', 'PASSABLE_WITH_CARE');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('MINOR', 'MODERATE', 'MAJOR', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "jurisdiction_url" TEXT NOT NULL,
    "event_type" "EventType" NOT NULL,
    "event_subtypes" "EventSubtype"[],
    "severity" "Severity" NOT NULL,
    "status" "Status" NOT NULL,
    "headline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "geography" JSONB NOT NULL,
    "roads" JSONB[],
    "schedule" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenLog" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AreaToEvent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AreaToEvent_AB_unique" ON "_AreaToEvent"("A", "B");

-- CreateIndex
CREATE INDEX "_AreaToEvent_B_index" ON "_AreaToEvent"("B");

-- AddForeignKey
ALTER TABLE "_AreaToEvent" ADD CONSTRAINT "_AreaToEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaToEvent" ADD CONSTRAINT "_AreaToEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
