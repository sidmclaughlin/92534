-- CreateTable
CREATE TABLE "TokenLog" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenLog_pkey" PRIMARY KEY ("id")
);
